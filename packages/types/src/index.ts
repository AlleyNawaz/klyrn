// ============================================================
// Klyrn — Shared Types
// Used by: apps/web, apps/api, packages/sdk
// ============================================================

// ---- Enums ----

export enum UserRole {
  FREELANCER = "FREELANCER",
  CLIENT = "CLIENT",
  BOTH = "BOTH",
}

export enum KycStatus {
  NONE = "NONE",
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export enum ContractStatus {
  PENDING_ACCEPTANCE = "PENDING_ACCEPTANCE",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum MilestoneStatus {
  PENDING = "PENDING",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  DISPUTED = "DISPUTED",
  PARTIALLY_RELEASED = "PARTIALLY_RELEASED",
  REJECTED = "REJECTED",
}

export enum DecisionAuthority {
  CLIENT = "CLIENT",
  AI = "AI",
  JUROR_PANEL = "JUROR_PANEL",
  AUTO_TIMEOUT = "AUTO_TIMEOUT",
  FREELANCER_REFUND = "FREELANCER_REFUND",
}

export enum MilestoneDecision {
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  PARTIAL = "PARTIAL",
}

export enum DisputeReason {
  INCOMPLETE = "INCOMPLETE",
  OFF_SPEC = "OFF_SPEC",
  LOW_QUALITY = "LOW_QUALITY",
  PLAGIARISM = "PLAGIARISM",
  LATE = "LATE",
  OTHER = "OTHER",
}

export enum DisputeStatus {
  AWAITING_RESPONSES = "AWAITING_RESPONSES",
  AI_REVIEW = "AI_REVIEW",
  AI_DECIDED = "AI_DECIDED",
  ESCALATED_TO_JURY = "ESCALATED_TO_JURY",
  JURY_VOTING = "JURY_VOTING",
  RESOLVED = "RESOLVED",
}

// ---- File/Attachment Types ----

export interface FileAttachment {
  name: string;
  url: string;
  hash: string;
  size: number;
  mime?: string;
}

export interface ExternalLink {
  label: string;
  url: string;
}

// ---- API Response Types ----

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

// ---- User ----

export interface UserProfile {
  id: string;
  email: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  country: string | null;
  timezone: string | null;
  walletAddress: string;
  totalContractsCompleted: number;
  totalVolumeUsdCents: number;
  disputeRate: number;
  avgRating: number | null;
  onTimeDeliveryRate: number | null;
  onTimePaymentRate: number | null;
  reputationNftMint: string | null;
  createdAt: string;
}

export interface PublicUserProfile {
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  country: string | null;
  totalContractsCompleted: number;
  totalVolumeUsdCents: number;
  disputeRate: number;
  avgRating: number | null;
  onTimeDeliveryRate: number | null;
  onTimePaymentRate: number | null;
  reputationNftMint: string | null;
  createdAt: string;
}

// ---- Contract ----

export interface MilestoneInput {
  title: string;
  description: string;
  amountUsdc: number;
  dueDate?: string;
}

export interface CreateContractInput {
  freelancerEmail: string;
  title: string;
  briefMarkdown: string;
  totalAmountUsdc: number;
  milestones: MilestoneInput[];
  autoApprovalDays?: number;
  attachments?: FileAttachment[];
}

export interface ContractSummary {
  id: string;
  title: string;
  status: ContractStatus;
  totalAmountUsdcCents: string; // BigInt serialized
  clientHandle: string;
  freelancerHandle: string;
  milestoneCount: number;
  completedMilestones: number;
  createdAt: string;
}

export interface ContractDetail {
  id: string;
  title: string;
  briefMarkdown: string;
  briefAttachments: FileAttachment[];
  status: ContractStatus;
  totalAmountUsdcCents: string;
  autoApprovalDays: number;
  contractPda: string | null;
  escrowPda: string | null;
  client: PublicUserProfile;
  freelancer: PublicUserProfile;
  milestones: MilestoneDetail[];
  createdAt: string;
  acceptedAt: string | null;
  completedAt: string | null;
}

export interface MilestoneDetail {
  id: string;
  index: number;
  title: string;
  description: string;
  amountUsdcCents: string;
  dueDate: string | null;
  status: MilestoneStatus;
  submittedAt: string | null;
  submissionNotes: string | null;
  submissionFiles: FileAttachment[] | null;
  submissionExternalLinks: ExternalLink[] | null;
  submissionScreencastUrl: string | null;
  decidedAt: string | null;
  decidedBy: DecisionAuthority | null;
  decision: MilestoneDecision | null;
  partialPercent: number | null;
  releaseTxSig: string | null;
  autoApprovalAt: string | null;
  dispute: DisputeSummary | null;
}

// ---- Dispute ----

export interface DisputeSummary {
  id: string;
  reasonCategory: DisputeReason;
  status: DisputeStatus;
  aiVerdict: MilestoneDecision | null;
  aiConfidence: number | null;
  finalDecision: MilestoneDecision | null;
  openedAt: string;
}

export interface DisputeDetail {
  id: string;
  milestoneId: string;
  reasonCategory: DisputeReason;
  clientStatement: string | null;
  clientFiles: FileAttachment[] | null;
  freelancerStatement: string | null;
  freelancerFiles: FileAttachment[] | null;
  status: DisputeStatus;
  aiVerdict: MilestoneDecision | null;
  aiConfidence: number | null;
  aiReasoning: string | null;
  aiPartialPercent: number | null;
  finalDecision: MilestoneDecision | null;
  finalPartialPercent: number | null;
  decidedAt: string | null;
  decidedBy: DecisionAuthority | null;
  responseDeadline: string;
  openedAt: string;
  jurorVotes: JurorVoteSummary[];
}

export interface JurorVoteSummary {
  jurorHandle: string;
  vote: MilestoneDecision;
  partialPercent: number | null;
  reasoning: string;
  votedAt: string;
}

// ---- AI Arbitration (request/response to arbiter service) ----

export interface ArbitrationRequest {
  dispute_id: string;
  contract: {
    title: string;
    brief_markdown: string;
    brief_attachments: FileAttachment[];
  };
  milestone: {
    index: number;
    title: string;
    description: string;
    amount_usdc: number;
    due_date: string | null;
    submitted_at: string;
  };
  submission: {
    notes: string;
    files: FileAttachment[];
    external_links: ExternalLink[];
    screencast_url: string | null;
  };
  dispute: {
    reason_category: string;
    client_statement: string;
    client_files: FileAttachment[];
    freelancer_statement: string | null;
    freelancer_files: FileAttachment[];
  };
}

export interface ArbitrationResponse {
  verdict: "APPROVED" | "REJECTED" | "PARTIAL";
  partial_percent: number | null;
  confidence: number;
  reasoning: string;
  evidence_cited: EvidenceCitation[];
  should_escalate: boolean;
  escalation_reason: string | null;
  tokens_used: { input: number; output: number };
  cost_usd: number;
  model: string;
  ran_at: string;
}

export interface EvidenceCitation {
  source: string;
  quote_or_observation: string;
  weight: number;
}

// ---- Notifications ----

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  ctaUrl: string | null;
  readAt: string | null;
  createdAt: string;
}

// ---- Pagination ----

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
