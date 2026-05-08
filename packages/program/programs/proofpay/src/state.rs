use anchor_lang::prelude::*;

// ---- Contract Account ----
// Holds the escrow state for a freelance contract between client and freelancer.
// PDA seeds: ["contract", contract_id_bytes]
#[account]
pub struct Contract {
    /// The client who created and funded this contract
    pub client: Pubkey,                    // 32
    /// The freelancer hired to deliver the work
    pub freelancer: Pubkey,                // 32
    /// SPL token mint (USDC)
    pub mint: Pubkey,                      // 32
    /// PDA token account holding escrowed USDC
    pub escrow_token_account: Pubkey,      // 32
    /// Total contract value in USDC base units (1 USDC = 1_000_000)
    pub total_amount: u64,                 // 8
    /// Amount already released to freelancer
    pub released_amount: u64,              // 8
    /// Amount refunded to client (disputes/cancellations)
    pub refunded_amount: u64,              // 8
    /// Current contract lifecycle status
    pub status: ContractStatus,            // 1
    /// Number of milestones in this contract (1-10)
    pub milestone_count: u8,               // 1
    /// Seconds after submission before auto-approval kicks in
    pub auto_approval_seconds: i64,        // 8
    /// SHA-256 hash of the brief for on-chain verification
    pub brief_hash: [u8; 32],              // 32
    /// Unix timestamp of contract creation
    pub created_at: i64,                   // 8
    /// PDA bump seed
    pub bump: u8,                          // 1
    /// Off-chain UUID used as PDA seed (16 bytes = 128-bit UUID)
    pub contract_id: [u8; 16],             // 16
    /// Whether the contract has been fully funded
    pub is_funded: bool,                   // 1
}

// Total: 8 (discriminator) + 220 = 228 bytes. Pad to 256.
impl Contract {
    pub const SIZE: usize = 8 + 32 + 32 + 32 + 32 + 8 + 8 + 8 + 1 + 1 + 8 + 32 + 8 + 1 + 16 + 1 + 48; // padding to 268
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum ContractStatus {
    Pending = 0,    // Awaiting freelancer acceptance
    Active = 1,     // Work in progress
    Completed = 2,  // All milestones approved
    Cancelled = 3,  // Cancelled before acceptance
}

// ---- Milestone Account ----
// Tracks individual deliverable within a contract.
// PDA seeds: ["milestone", contract_pda, &[index]]
#[account]
pub struct Milestone {
    /// Parent contract PDA
    pub contract: Pubkey,                  // 32
    /// 0-based milestone index
    pub index: u8,                         // 1
    /// USDC amount for this milestone in base units
    pub amount: u64,                       // 8
    /// Current milestone lifecycle status
    pub status: MilestoneStatus,           // 1
    /// SHA-256 hash of the deliverable bundle
    pub deliverable_hash: [u8; 32],        // 32
    /// Unix timestamp of submission
    pub submitted_at: i64,                 // 8
    /// Unix timestamp when auto-approval triggers
    pub auto_approval_at: i64,             // 8
    /// Unix timestamp of decision (approval/rejection)
    pub decided_at: i64,                   // 8
    /// Actual amount released (handles partial releases)
    pub release_amount: u64,               // 8
    /// PDA bump seed
    pub bump: u8,                          // 1
}

impl Milestone {
    pub const SIZE: usize = 8 + 32 + 1 + 8 + 1 + 32 + 8 + 8 + 8 + 8 + 1 + 16; // padding
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum MilestoneStatus {
    Pending = 0,
    Submitted = 1,
    Approved = 2,
    Disputed = 3,
    PartiallyReleased = 4,
    Rejected = 5,
}

// ---- Reputation Stats Account ----
// On-chain reputation for a user, updated after each contract completion.
// PDA seeds: ["reputation", user_pubkey]
#[account]
pub struct ReputationStats {
    /// The user this reputation belongs to
    pub user: Pubkey,                      // 32
    /// Number of contracts completed successfully
    pub contracts_completed: u32,          // 4
    /// Total USD volume transacted (USDC base units)
    pub total_volume: u64,                 // 8
    /// Number of disputes this user initiated
    pub disputes_initiated: u16,           // 2
    /// Number of disputes this user lost
    pub disputes_lost: u16,                // 2
    /// Number of milestones delivered on time
    pub on_time_milestones: u32,           // 4
    /// Number of milestones delivered late
    pub late_milestones: u32,              // 4
    /// PDA bump seed
    pub bump: u8,                          // 1
}

impl ReputationStats {
    pub const SIZE: usize = 8 + 32 + 4 + 8 + 2 + 2 + 4 + 4 + 1 + 16; // padding
}
