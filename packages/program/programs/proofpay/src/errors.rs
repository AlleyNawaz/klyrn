use anchor_lang::prelude::*;

#[error_code]
pub enum ProofPayError {
    #[msg("Sum of milestone amounts must equal total contract amount")]
    InvalidMilestoneSum,

    #[msg("Maximum 10 milestones per contract")]
    TooManyMilestones,

    #[msg("Contract is not in Active state")]
    ContractNotActive,

    #[msg("Milestone is not in Pending state")]
    MilestoneNotPending,

    #[msg("Milestone is not in Submitted state")]
    MilestoneNotSubmitted,

    #[msg("Auto-approval deadline has not been reached yet")]
    AutoApprovalNotReached,

    #[msg("You are not authorized to perform this action")]
    Unauthorized,

    #[msg("Contract has already been funded")]
    AlreadyFunded,

    #[msg("Insufficient funds in source account")]
    InsufficientFunds,

    #[msg("Partial percent must be between 1 and 99")]
    InvalidPartialPercent,

    #[msg("This dispute has already been resolved")]
    DisputeAlreadyResolved,

    #[msg("Contract must be funded before acceptance")]
    ContractNotFunded,

    #[msg("Milestone is not in Disputed state")]
    MilestoneNotDisputed,

    #[msg("Invalid decision value (must be 0=APPROVED, 1=REJECTED, 2=PARTIAL)")]
    InvalidDecision,

    #[msg("Contract is not in Pending state")]
    ContractNotPending,

    #[msg("Milestone count must be at least 1")]
    ZeroMilestones,

    #[msg("Milestone amounts vector length must match milestone count")]
    MilestoneCountMismatch,
}
