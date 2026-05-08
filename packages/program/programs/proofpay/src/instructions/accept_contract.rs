use anchor_lang::prelude::*;

use crate::state::*;
use crate::errors::ProofPayError;
use crate::events::ContractAccepted;

#[derive(Accounts)]
#[instruction(contract_id: [u8; 16])]
pub struct AcceptContract<'info> {
    /// Freelancer accepting the contract; must match contract.freelancer
    #[account(mut)]
    pub freelancer: Signer<'info>,

    /// Contract PDA — must be Pending and funded before acceptance
    #[account(
        mut,
        seeds = [b"contract", contract_id.as_ref()],
        bump = contract.bump,
        has_one = freelancer @ ProofPayError::Unauthorized,
    )]
    pub contract: Account<'info, Contract>,
}

pub fn handler(ctx: Context<AcceptContract>, _contract_id: [u8; 16]) -> Result<()> {
    let contract = &mut ctx.accounts.contract;

    // Must be in Pending state
    require!(
        contract.status == ContractStatus::Pending,
        ProofPayError::ContractNotPending
    );

    // Must be funded
    require!(contract.is_funded, ProofPayError::ContractNotFunded);

    contract.status = ContractStatus::Active;

    emit!(ContractAccepted {
        contract: contract.key(),
    });

    Ok(())
}
