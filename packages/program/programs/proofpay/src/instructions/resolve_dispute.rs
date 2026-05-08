use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::state::*;
use crate::errors::ProofPayError;
use crate::events::DisputeResolved;

#[derive(Accounts)]
#[instruction(contract_id: [u8; 16], milestone_index: u8)]
pub struct ResolveDispute<'info> {
    /// Arbiter authority — backend-controlled key for MVP
    #[account(mut)]
    pub arbiter: Signer<'info>,

    #[account(
        mut,
        seeds = [b"contract", contract_id.as_ref()],
        bump = contract.bump,
    )]
    pub contract: Account<'info, Contract>,

    #[account(
        mut,
        seeds = [b"milestone", contract.key().as_ref(), &[milestone_index]],
        bump = milestone.bump,
        constraint = milestone.contract == contract.key() @ ProofPayError::Unauthorized,
    )]
    pub milestone: Account<'info, Milestone>,

    #[account(
        mut,
        seeds = [b"escrow", contract.key().as_ref()],
        bump,
        constraint = escrow_token_account.key() == contract.escrow_token_account @ ProofPayError::Unauthorized,
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    /// Freelancer's token account for receiving funds
    #[account(
        mut,
        constraint = freelancer_token_account.owner == contract.freelancer @ ProofPayError::Unauthorized,
    )]
    pub freelancer_token_account: Account<'info, TokenAccount>,

    /// Client's token account for refunds
    #[account(
        mut,
        constraint = client_token_account.owner == contract.client @ ProofPayError::Unauthorized,
    )]
    pub client_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<ResolveDispute>,
    contract_id: [u8; 16],
    milestone_index: u8,
    decision: u8,
    partial_percent: u8,
) -> Result<()> {
    let milestone = &mut ctx.accounts.milestone;
    let contract = &mut ctx.accounts.contract;

    require!(
        milestone.status == MilestoneStatus::Disputed,
        ProofPayError::MilestoneNotDisputed
    );

    // Validate decision: 0=APPROVED, 1=REJECTED, 2=PARTIAL
    require!(decision <= 2, ProofPayError::InvalidDecision);

    if decision == 2 {
        require!(
            partial_percent >= 1 && partial_percent <= 99,
            ProofPayError::InvalidPartialPercent
        );
    }

    let amount = milestone.amount;
    let clock = Clock::get()?;

    let seeds = &[
        b"contract".as_ref(),
        contract_id.as_ref(),
        &[contract.bump],
    ];
    let signer_seeds = &[&seeds[..]];

    let (freelancer_amount, client_amount) = match decision {
        0 => (amount, 0u64),           // APPROVED: all to freelancer
        1 => (0u64, amount),           // REJECTED: all to client
        2 => {                         // PARTIAL: split by percent
            let fl = amount
                .checked_mul(partial_percent as u64)
                .unwrap()
                .checked_div(100)
                .unwrap();
            (fl, amount.checked_sub(fl).unwrap())
        }
        _ => unreachable!(),
    };

    // Transfer to freelancer
    if freelancer_amount > 0 {
        let cpi = Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.freelancer_token_account.to_account_info(),
            authority: contract.to_account_info(),
        };
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                cpi,
                signer_seeds,
            ),
            freelancer_amount,
        )?;
        contract.released_amount = contract
            .released_amount
            .checked_add(freelancer_amount)
            .unwrap();
    }

    // Refund to client
    if client_amount > 0 {
        let cpi = Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.client_token_account.to_account_info(),
            authority: contract.to_account_info(),
        };
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                cpi,
                signer_seeds,
            ),
            client_amount,
        )?;
        contract.refunded_amount = contract
            .refunded_amount
            .checked_add(client_amount)
            .unwrap();
    }

    milestone.release_amount = freelancer_amount;
    milestone.decided_at = clock.unix_timestamp;

    milestone.status = match decision {
        0 => MilestoneStatus::Approved,
        1 => MilestoneStatus::Rejected,
        2 => MilestoneStatus::PartiallyReleased,
        _ => unreachable!(),
    };

    // Check completion
    if contract.released_amount + contract.refunded_amount >= contract.total_amount {
        contract.status = ContractStatus::Completed;
    }

    emit!(DisputeResolved {
        contract: contract.key(),
        milestone_index,
        decision,
        freelancer_amount,
        client_amount,
    });

    Ok(())
}
