use anchor_lang::prelude::*;

use crate::state::*;
use crate::errors::ProofPayError;
use crate::events::MilestoneSubmitted;

#[derive(Accounts)]
#[instruction(contract_id: [u8; 16], milestone_index: u8)]
pub struct SubmitMilestone<'info> {
    /// Freelancer submitting the deliverable
    #[account(mut)]
    pub freelancer: Signer<'info>,

    /// Parent contract — must be Active and owned by this freelancer
    #[account(
        seeds = [b"contract", contract_id.as_ref()],
        bump = contract.bump,
        has_one = freelancer @ ProofPayError::Unauthorized,
        constraint = contract.status == ContractStatus::Active @ ProofPayError::ContractNotActive,
    )]
    pub contract: Account<'info, Contract>,

    /// Milestone PDA — must be Pending
    #[account(
        mut,
        seeds = [b"milestone", contract.key().as_ref(), &[milestone_index]],
        bump = milestone.bump,
        constraint = milestone.contract == contract.key() @ ProofPayError::Unauthorized,
    )]
    pub milestone: Account<'info, Milestone>,
}

pub fn handler(
    ctx: Context<SubmitMilestone>,
    _contract_id: [u8; 16],
    milestone_index: u8,
    deliverable_hash: [u8; 32],
) -> Result<()> {
    let milestone = &mut ctx.accounts.milestone;
    let contract = &ctx.accounts.contract;

    require!(
        milestone.status == MilestoneStatus::Pending,
        ProofPayError::MilestoneNotPending
    );

    let clock = Clock::get()?;

    milestone.status = MilestoneStatus::Submitted;
    milestone.deliverable_hash = deliverable_hash;
    milestone.submitted_at = clock.unix_timestamp;
    milestone.auto_approval_at = clock
        .unix_timestamp
        .checked_add(contract.auto_approval_seconds)
        .unwrap();

    emit!(MilestoneSubmitted {
        contract: contract.key(),
        milestone_index,
        deliverable_hash,
    });

    Ok(())
}
