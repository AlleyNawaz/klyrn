use anchor_lang::prelude::*;

use crate::state::*;
use crate::errors::ProofPayError;
use crate::events::MilestoneDisputed;

#[derive(Accounts)]
#[instruction(contract_id: [u8; 16], milestone_index: u8)]
pub struct DisputeMilestone<'info> {
    #[account(mut)]
    pub client: Signer<'info>,

    #[account(
        seeds = [b"contract", contract_id.as_ref()],
        bump = contract.bump,
        has_one = client @ ProofPayError::Unauthorized,
        constraint = contract.status == ContractStatus::Active @ ProofPayError::ContractNotActive,
    )]
    pub contract: Account<'info, Contract>,

    #[account(
        mut,
        seeds = [b"milestone", contract.key().as_ref(), &[milestone_index]],
        bump = milestone.bump,
        constraint = milestone.contract == contract.key() @ ProofPayError::Unauthorized,
    )]
    pub milestone: Account<'info, Milestone>,
}

pub fn handler(
    ctx: Context<DisputeMilestone>,
    _contract_id: [u8; 16],
    milestone_index: u8,
) -> Result<()> {
    let milestone = &mut ctx.accounts.milestone;

    require!(
        milestone.status == MilestoneStatus::Submitted,
        ProofPayError::MilestoneNotSubmitted
    );

    milestone.status = MilestoneStatus::Disputed;

    emit!(MilestoneDisputed {
        contract: ctx.accounts.contract.key(),
        milestone_index,
    });

    Ok(())
}
