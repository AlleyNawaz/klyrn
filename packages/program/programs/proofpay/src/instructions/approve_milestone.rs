use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::state::*;
use crate::errors::ProofPayError;
use crate::events::MilestoneApproved;

#[derive(Accounts)]
#[instruction(contract_id: [u8; 16], milestone_index: u8)]
pub struct ApproveMilestone<'info> {
    /// Approver — either the client, or anyone if auto-approval time has passed
    #[account(mut)]
    pub approver: Signer<'info>,

    /// Contract PDA — must be Active
    #[account(
        mut,
        seeds = [b"contract", contract_id.as_ref()],
        bump = contract.bump,
        constraint = contract.status == ContractStatus::Active @ ProofPayError::ContractNotActive,
    )]
    pub contract: Account<'info, Contract>,

    /// Milestone PDA — must be Submitted
    #[account(
        mut,
        seeds = [b"milestone", contract.key().as_ref(), &[milestone_index]],
        bump = milestone.bump,
        constraint = milestone.contract == contract.key() @ ProofPayError::Unauthorized,
    )]
    pub milestone: Account<'info, Milestone>,

    /// Escrow token account — source of milestone funds
    #[account(
        mut,
        seeds = [b"escrow", contract.key().as_ref()],
        bump,
        constraint = escrow_token_account.key() == contract.escrow_token_account @ ProofPayError::Unauthorized,
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    /// Freelancer's token account — destination for released funds
    #[account(
        mut,
        constraint = freelancer_token_account.owner == contract.freelancer @ ProofPayError::Unauthorized,
    )]
    pub freelancer_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<ApproveMilestone>,
    contract_id: [u8; 16],
    milestone_index: u8,
) -> Result<()> {
    let milestone = &mut ctx.accounts.milestone;
    let contract = &mut ctx.accounts.contract;

    require!(
        milestone.status == MilestoneStatus::Submitted,
        ProofPayError::MilestoneNotSubmitted
    );

    let clock = Clock::get()?;
    let is_client = ctx.accounts.approver.key() == contract.client;
    let is_auto = clock.unix_timestamp >= milestone.auto_approval_at;

    // Only the client can approve before auto-approval time
    require!(
        is_client || is_auto,
        ProofPayError::Unauthorized
    );

    if !is_client && is_auto {
        // Auto-approval: anyone can trigger but only after deadline
        require!(
            clock.unix_timestamp >= milestone.auto_approval_at,
            ProofPayError::AutoApprovalNotReached
        );
    }

    let amount = milestone.amount;

    // PDA signs the transfer from escrow to freelancer
    let seeds = &[
        b"contract".as_ref(),
        contract_id.as_ref(),
        &[contract.bump],
    ];
    let signer_seeds = &[&seeds[..]];

    let cpi_accounts = Transfer {
        from: ctx.accounts.escrow_token_account.to_account_info(),
        to: ctx.accounts.freelancer_token_account.to_account_info(),
        authority: contract.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    token::transfer(
        CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds),
        amount,
    )?;

    milestone.status = MilestoneStatus::Approved;
    milestone.release_amount = amount;
    milestone.decided_at = clock.unix_timestamp;

    contract.released_amount = contract.released_amount.checked_add(amount).unwrap();

    // Check if all milestones are approved → mark contract as Completed
    // We track this by checking if released + refunded == total
    if contract.released_amount + contract.refunded_amount >= contract.total_amount {
        contract.status = ContractStatus::Completed;
    }

    emit!(MilestoneApproved {
        contract: contract.key(),
        milestone_index,
        amount,
        by_auto_approval: !is_client,
    });

    Ok(())
}
