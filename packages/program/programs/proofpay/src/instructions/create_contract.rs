use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

use crate::state::*;
use crate::errors::ProofPayError;
use crate::events::ContractCreated;

#[derive(Accounts)]
#[instruction(
    contract_id: [u8; 16],
    freelancer: Pubkey,
    total_amount: u64,
    milestone_count: u8,
)]
pub struct CreateContract<'info> {
    /// Client creating the contract; pays for account rent
    #[account(mut)]
    pub client: Signer<'info>,

    /// Contract PDA — deterministic address from contract_id
    #[account(
        init,
        payer = client,
        space = Contract::SIZE,
        seeds = [b"contract", contract_id.as_ref()],
        bump,
    )]
    pub contract: Account<'info, Contract>,

    /// Escrow token account — PDA-owned ATA that holds USDC during escrow
    #[account(
        init,
        payer = client,
        token::mint = mint,
        token::authority = contract,
        seeds = [b"escrow", contract.key().as_ref()],
        bump,
    )]
    pub escrow_token_account: Account<'info, TokenAccount>,

    /// USDC mint — validates we're working with the correct SPL token
    pub mint: Account<'info, Mint>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<CreateContract>,
    contract_id: [u8; 16],
    freelancer: Pubkey,
    total_amount: u64,
    milestone_count: u8,
    milestone_amounts: Vec<u64>,
    auto_approval_seconds: i64,
    brief_hash: [u8; 32],
) -> Result<()> {
    // Validate: at least 1, at most 10 milestones
    require!(milestone_count >= 1, ProofPayError::ZeroMilestones);
    require!(milestone_count <= 10, ProofPayError::TooManyMilestones);

    // Validate: milestone amounts vector matches count
    require!(
        milestone_amounts.len() == milestone_count as usize,
        ProofPayError::MilestoneCountMismatch
    );

    // Validate: sum of milestone amounts equals total
    let sum: u64 = milestone_amounts.iter().sum();
    require!(sum == total_amount, ProofPayError::InvalidMilestoneSum);

    let clock = Clock::get()?;
    let contract = &mut ctx.accounts.contract;

    contract.client = ctx.accounts.client.key();
    contract.freelancer = freelancer;
    contract.mint = ctx.accounts.mint.key();
    contract.escrow_token_account = ctx.accounts.escrow_token_account.key();
    contract.total_amount = total_amount;
    contract.released_amount = 0;
    contract.refunded_amount = 0;
    contract.status = ContractStatus::Pending;
    contract.milestone_count = milestone_count;
    contract.auto_approval_seconds = auto_approval_seconds;
    contract.brief_hash = brief_hash;
    contract.created_at = clock.unix_timestamp;
    contract.bump = ctx.bumps.contract;
    contract.contract_id = contract_id;
    contract.is_funded = false;

    emit!(ContractCreated {
        contract: contract.key(),
        client: ctx.accounts.client.key(),
        freelancer,
        total_amount,
        milestone_count,
    });

    Ok(())
}
