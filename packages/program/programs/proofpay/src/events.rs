use anchor_lang::prelude::*;

// ---- Program Events (indexed via Helius webhooks) ----

#[event]
pub struct ContractCreated {
    pub contract: Pubkey,
    pub client: Pubkey,
    pub freelancer: Pubkey,
    pub total_amount: u64,
    pub milestone_count: u8,
}

#[event]
pub struct ContractFunded {
    pub contract: Pubkey,
    pub amount: u64,
}

#[event]
pub struct ContractAccepted {
    pub contract: Pubkey,
}

#[event]
pub struct ContractCancelled {
    pub contract: Pubkey,
    pub refund_amount: u64,
}

#[event]
pub struct MilestoneSubmitted {
    pub contract: Pubkey,
    pub milestone_index: u8,
    pub deliverable_hash: [u8; 32],
}

#[event]
pub struct MilestoneApproved {
    pub contract: Pubkey,
    pub milestone_index: u8,
    pub amount: u64,
    pub by_auto_approval: bool,
}

#[event]
pub struct MilestoneDisputed {
    pub contract: Pubkey,
    pub milestone_index: u8,
}

#[event]
pub struct DisputeResolved {
    pub contract: Pubkey,
    pub milestone_index: u8,
    pub decision: u8,
    pub freelancer_amount: u64,
    pub client_amount: u64,
}
