use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("11111111111111111111111111111111"); // Replaced after first build

pub mod state;
pub mod errors;
pub mod events;
pub mod instructions;

use instructions::*;

#[program]
pub mod proofpay {
    use super::*;

    /// Creates a new escrow contract with milestones.
    /// Caller: client. Does NOT move USDC — funding is a separate ix.
    pub fn create_contract(
        ctx: Context<CreateContract>,
        contract_id: [u8; 16],
        freelancer: Pubkey,
        total_amount: u64,
        milestone_count: u8,
        milestone_amounts: Vec<u64>,
        auto_approval_seconds: i64,
        brief_hash: [u8; 32],
    ) -> Result<()> {
        instructions::create_contract::handler(
            ctx,
            contract_id,
            freelancer,
            total_amount,
            milestone_count,
            milestone_amounts,
            auto_approval_seconds,
            brief_hash,
        )
    }

    /// Funds the escrow by transferring USDC from client's ATA to escrow ATA.
    pub fn fund_contract(ctx: Context<FundContract>, contract_id: [u8; 16]) -> Result<()> {
        instructions::fund_contract::handler(ctx, contract_id)
    }

    /// Freelancer accepts the contract, moving status to Active.
    pub fn accept_contract(ctx: Context<AcceptContract>, contract_id: [u8; 16]) -> Result<()> {
        instructions::accept_contract::handler(ctx, contract_id)
    }

    /// Freelancer declines the contract; full refund to client.
    pub fn decline_contract(ctx: Context<DeclineContract>, contract_id: [u8; 16]) -> Result<()> {
        instructions::decline_contract::handler(ctx, contract_id)
    }

    /// Freelancer submits deliverables for a milestone.
    pub fn submit_milestone(
        ctx: Context<SubmitMilestone>,
        contract_id: [u8; 16],
        milestone_index: u8,
        deliverable_hash: [u8; 32],
    ) -> Result<()> {
        instructions::submit_milestone::handler(ctx, contract_id, milestone_index, deliverable_hash)
    }

    /// Client (or anyone after auto-approval timeout) approves a milestone and releases funds.
    pub fn approve_milestone(
        ctx: Context<ApproveMilestone>,
        contract_id: [u8; 16],
        milestone_index: u8,
    ) -> Result<()> {
        instructions::approve_milestone::handler(ctx, contract_id, milestone_index)
    }

    /// Client disputes a submitted milestone, freezing funds.
    pub fn dispute_milestone(
        ctx: Context<DisputeMilestone>,
        contract_id: [u8; 16],
        milestone_index: u8,
    ) -> Result<()> {
        instructions::dispute_milestone::handler(ctx, contract_id, milestone_index)
    }

    /// Arbiter resolves a dispute, distributing funds based on decision.
    pub fn resolve_dispute(
        ctx: Context<ResolveDispute>,
        contract_id: [u8; 16],
        milestone_index: u8,
        decision: u8,
        partial_percent: u8,
    ) -> Result<()> {
        instructions::resolve_dispute::handler(
            ctx,
            contract_id,
            milestone_index,
            decision,
            partial_percent,
        )
    }

    /// Either party cancels a pending (not yet accepted) contract.
    pub fn cancel_contract(ctx: Context<CancelContract>, contract_id: [u8; 16]) -> Result<()> {
        instructions::cancel_contract::handler(ctx, contract_id)
    }

    /// Initializes a ReputationStats account for a user.
    pub fn init_reputation(ctx: Context<InitReputation>) -> Result<()> {
        instructions::init_reputation::handler(ctx)
    }
}
