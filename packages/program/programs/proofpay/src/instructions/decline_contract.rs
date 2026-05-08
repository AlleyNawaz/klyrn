use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::state::*;
use crate::errors::ProofPayError;
use crate::events::ContractCancelled;

#[derive(Accounts)]
#[instruction(contract_id: [u8; 16])]
pub struct DeclineContract<'info> {
    /// Freelancer declining the contract
    #[account(mut)]
    pub freelancer: Signer<'info>,

    /// Contract PDA — must be Pending and owned by this freelancer
    #[account(
        mut,
        seeds = [b"contract", contract_id.as_ref()],
        bump = contract.bump,
        has_one = freelancer @ ProofPayError::Unauthorized,
    )]
    pub contract: Account<'info, Contract>,

    /// Escrow token account — refund USDC back to client
    #[account(
        mut,
        seeds = [b"escrow", contract.key().as_ref()],
        bump,
        constraint = escrow_token_account.key() == contract.escrow_token_account @ ProofPayError::Unauthorized,
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    /// Client's token account — receives refund
    #[account(
        mut,
        constraint = client_token_account.owner == contract.client @ ProofPayError::Unauthorized,
    )]
    pub client_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<DeclineContract>, contract_id: [u8; 16]) -> Result<()> {
    let contract = &mut ctx.accounts.contract;

    require!(
        contract.status == ContractStatus::Pending,
        ProofPayError::ContractNotPending
    );

    let refund_amount = ctx.accounts.escrow_token_account.amount;

    if refund_amount > 0 {
        // PDA signs the transfer from escrow back to client
        let seeds = &[
            b"contract".as_ref(),
            contract_id.as_ref(),
            &[contract.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.escrow_token_account.to_account_info(),
            to: ctx.accounts.client_token_account.to_account_info(),
            authority: contract.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        token::transfer(
            CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds),
            refund_amount,
        )?;

        contract.refunded_amount = contract
            .refunded_amount
            .checked_add(refund_amount)
            .unwrap();
    }

    contract.status = ContractStatus::Cancelled;

    emit!(ContractCancelled {
        contract: contract.key(),
        refund_amount,
    });

    Ok(())
}
