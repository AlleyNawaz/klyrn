use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

use crate::state::*;
use crate::errors::ProofPayError;
use crate::events::ContractFunded;

#[derive(Accounts)]
#[instruction(contract_id: [u8; 16])]
pub struct FundContract<'info> {
    /// Client funding the contract; must match contract.client
    #[account(mut)]
    pub client: Signer<'info>,

    /// Contract PDA — must be owned by client and in Pending state
    #[account(
        mut,
        seeds = [b"contract", contract_id.as_ref()],
        bump = contract.bump,
        has_one = client @ ProofPayError::Unauthorized,
    )]
    pub contract: Account<'info, Contract>,

    /// Client's USDC token account — source of funds
    #[account(
        mut,
        constraint = client_token_account.owner == client.key() @ ProofPayError::Unauthorized,
        constraint = client_token_account.mint == contract.mint @ ProofPayError::InvalidMilestoneSum,
    )]
    pub client_token_account: Account<'info, TokenAccount>,

    /// Escrow token account — destination for funds
    #[account(
        mut,
        seeds = [b"escrow", contract.key().as_ref()],
        bump,
        constraint = escrow_token_account.key() == contract.escrow_token_account @ ProofPayError::Unauthorized,
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<FundContract>, _contract_id: [u8; 16]) -> Result<()> {
    let contract = &mut ctx.accounts.contract;

    // Cannot fund twice
    require!(!contract.is_funded, ProofPayError::AlreadyFunded);

    // Calculate how much needs to be funded
    let fund_amount = contract
        .total_amount
        .checked_sub(contract.released_amount)
        .unwrap()
        .checked_sub(contract.refunded_amount)
        .unwrap();

    require!(fund_amount > 0, ProofPayError::AlreadyFunded);

    // Check client has enough
    require!(
        ctx.accounts.client_token_account.amount >= fund_amount,
        ProofPayError::InsufficientFunds
    );

    // Transfer USDC from client to escrow
    let cpi_accounts = Transfer {
        from: ctx.accounts.client_token_account.to_account_info(),
        to: ctx.accounts.escrow_token_account.to_account_info(),
        authority: ctx.accounts.client.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    token::transfer(CpiContext::new(cpi_program, cpi_accounts), fund_amount)?;

    contract.is_funded = true;

    emit!(ContractFunded {
        contract: contract.key(),
        amount: fund_amount,
    });

    Ok(())
}
