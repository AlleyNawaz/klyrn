use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::state::*;
use crate::errors::ProofPayError;
use crate::events::ContractCancelled;

#[derive(Accounts)]
#[instruction(contract_id: [u8; 16])]
pub struct CancelContract<'info> {
    #[account(mut)]
    pub caller: Signer<'info>,

    #[account(
        mut,
        seeds = [b"contract", contract_id.as_ref()],
        bump = contract.bump,
        constraint = contract.status == ContractStatus::Pending @ ProofPayError::ContractNotPending,
    )]
    pub contract: Account<'info, Contract>,

    #[account(
        mut,
        seeds = [b"escrow", contract.key().as_ref()],
        bump,
        constraint = escrow_token_account.key() == contract.escrow_token_account @ ProofPayError::Unauthorized,
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = client_token_account.owner == contract.client @ ProofPayError::Unauthorized,
    )]
    pub client_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<CancelContract>, contract_id: [u8; 16]) -> Result<()> {
    let contract = &mut ctx.accounts.contract;
    let caller = ctx.accounts.caller.key();

    // Either party can cancel if pending and not yet accepted
    require!(
        caller == contract.client || caller == contract.freelancer,
        ProofPayError::Unauthorized
    );

    let refund_amount = ctx.accounts.escrow_token_account.amount;

    if refund_amount > 0 {
        let seeds = &[
            b"contract".as_ref(),
            contract_id.as_ref(),
            &[contract.bump],
        ];
        let signer_seeds = &[&seeds[..]];

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
            refund_amount,
        )?;

        contract.refunded_amount = contract.refunded_amount.checked_add(refund_amount).unwrap();
    }

    contract.status = ContractStatus::Cancelled;

    emit!(ContractCancelled {
        contract: contract.key(),
        refund_amount,
    });

    Ok(())
}
