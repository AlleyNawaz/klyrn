/**
 * Klyrn Email Service
 * Uses Resend for transactional emails
 * Section 11 of the spec
 */

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Klyrn <noreply@klyrn.io>";
const APP_URL = process.env.APP_URL || "http://localhost:3000";

// ---- Base HTML Template ----
function baseTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #09090B; color: #FAFAFA; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 0 auto; padding: 40px 24px; }
    .logo { display: flex; align-items: center; gap: 8px; margin-bottom: 32px; }
    .logo-icon { width: 32px; height: 32px; background: linear-gradient(135deg, #00D395, #00B37E); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    .logo-text { font-size: 18px; font-weight: 700; color: #FAFAFA; }
    h1 { font-size: 20px; font-weight: 700; margin: 0 0 8px; }
    p { font-size: 14px; color: #A1A1AA; line-height: 1.6; margin: 0 0 16px; }
    .card { background: #18181B; border: 1px solid #27272A; border-radius: 12px; padding: 20px; margin: 16px 0; }
    .card-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
    .card-label { color: #71717A; }
    .card-value { color: #FAFAFA; font-weight: 500; }
    .btn { display: inline-block; padding: 12px 24px; background: #00D395; color: #000; font-size: 14px; font-weight: 600; border-radius: 8px; text-decoration: none; margin: 8px 0; }
    .btn-outline { background: transparent; border: 1px solid #27272A; color: #FAFAFA; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #27272A; font-size: 12px; color: #3F3F46; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 11px; font-weight: 600; }
    .badge-green { background: rgba(0,211,149,0.15); color: #00D395; border: 1px solid rgba(0,211,149,0.3); }
    .badge-red { background: rgba(239,68,68,0.15); color: #EF4444; border: 1px solid rgba(239,68,68,0.3); }
    .badge-yellow { background: rgba(245,158,11,0.15); color: #F59E0B; border: 1px solid rgba(245,158,11,0.3); }
    .amount { font-size: 24px; font-weight: 700; color: #00D395; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <div class="logo-icon">🛡️</div>
      <span class="logo-text">Klyrn</span>
    </div>
    ${content}
    <div class="footer">
      <p>Klyrn — Escrow for freelancers, powered by Solana.</p>
      <p>You're receiving this because you're using Klyrn. <a href="${APP_URL}/settings" style="color: #71717A;">Email preferences</a></p>
    </div>
  </div>
</body>
</html>`;
}

// ---- Email Types ----

export interface ContractInviteData {
  freelancerEmail: string;
  freelancerName: string;
  clientName: string;
  contractTitle: string;
  totalAmountUsd: string;
  milestoneCount: number;
  contractId: string;
}

export interface MilestoneSubmittedData {
  recipientEmail: string;
  recipientName: string;
  freelancerName: string;
  contractTitle: string;
  milestoneTitle: string;
  milestoneAmountUsd: string;
  contractId: string;
  autoApprovalDate: string;
}

export interface DisputeFiledData {
  recipientEmail: string;
  recipientName: string;
  opponentName: string;
  contractTitle: string;
  milestoneTitle: string;
  disputeReason: string;
  responseDeadline: string;
  disputeId: string;
}

export interface VerdictRenderedData {
  recipientEmail: string;
  recipientName: string;
  contractTitle: string;
  milestoneTitle: string;
  verdict: "APPROVED" | "REJECTED" | "PARTIAL";
  confidence: number;
  amountUsd: string;
  disputeId: string;
}

export interface PaymentReleasedData {
  recipientEmail: string;
  recipientName: string;
  contractTitle: string;
  milestoneTitle: string;
  amountUsd: string;
  txSignature: string;
}

// ---- Email Senders ----

export async function sendContractInvite(data: ContractInviteData) {
  const html = baseTemplate(`
    <h1>You've been invited to a contract!</h1>
    <p>${data.clientName} wants to hire you on Klyrn.</p>
    <div class="card">
      <div class="card-row"><span class="card-label">Project</span><span class="card-value">${data.contractTitle}</span></div>
      <div class="card-row"><span class="card-label">Budget</span><span class="card-value amount">${data.totalAmountUsd}</span></div>
      <div class="card-row"><span class="card-label">Milestones</span><span class="card-value">${data.milestoneCount}</span></div>
      <div class="card-row"><span class="card-label">Escrow</span><span class="card-value"><span class="badge badge-green">Funded & Secured</span></span></div>
    </div>
    <p>Funds are already deposited in a smart contract escrow. They'll be released as you complete each milestone.</p>
    <a href="${APP_URL}/contracts/${data.contractId}" class="btn">Review & Accept →</a>
    <p style="font-size: 12px; color: #71717A;">Not interested? Simply ignore this email.</p>
  `);

  return resend.emails.send({
    from: FROM,
    to: data.freelancerEmail,
    subject: `${data.clientName} invited you to "${data.contractTitle}" — ${data.totalAmountUsd}`,
    html,
  });
}

export async function sendMilestoneSubmitted(data: MilestoneSubmittedData) {
  const html = baseTemplate(`
    <h1>Deliverable submitted for review</h1>
    <p>${data.freelancerName} submitted work for <strong>${data.milestoneTitle}</strong>.</p>
    <div class="card">
      <div class="card-row"><span class="card-label">Contract</span><span class="card-value">${data.contractTitle}</span></div>
      <div class="card-row"><span class="card-label">Milestone</span><span class="card-value">${data.milestoneTitle}</span></div>
      <div class="card-row"><span class="card-label">Amount</span><span class="card-value">${data.milestoneAmountUsd}</span></div>
      <div class="card-row"><span class="card-label">Auto-approves</span><span class="card-value"><span class="badge badge-yellow">${data.autoApprovalDate}</span></span></div>
    </div>
    <p>Review the deliverable and approve or dispute before the auto-approval deadline.</p>
    <a href="${APP_URL}/contracts/${data.contractId}" class="btn">Review Submission →</a>
  `);

  return resend.emails.send({
    from: FROM,
    to: data.recipientEmail,
    subject: `📦 Deliverable submitted: ${data.milestoneTitle}`,
    html,
  });
}

export async function sendDisputeFiled(data: DisputeFiledData) {
  const html = baseTemplate(`
    <h1>A dispute has been filed</h1>
    <p>${data.opponentName} has disputed <strong>${data.milestoneTitle}</strong>.</p>
    <div class="card">
      <div class="card-row"><span class="card-label">Contract</span><span class="card-value">${data.contractTitle}</span></div>
      <div class="card-row"><span class="card-label">Milestone</span><span class="card-value">${data.milestoneTitle}</span></div>
      <div class="card-row"><span class="card-label">Reason</span><span class="card-value"><span class="badge badge-red">${data.disputeReason}</span></span></div>
      <div class="card-row"><span class="card-label">Response deadline</span><span class="card-value">${data.responseDeadline}</span></div>
    </div>
    <p>You have 48 hours to submit your response. After both sides respond, the AI arbitrator will render a verdict.</p>
    <a href="${APP_URL}/disputes/${data.disputeId}" class="btn">Respond Now →</a>
  `);

  return resend.emails.send({
    from: FROM,
    to: data.recipientEmail,
    subject: `⚠️ Dispute filed: ${data.milestoneTitle}`,
    html,
  });
}

export async function sendVerdictRendered(data: VerdictRenderedData) {
  const verdictLabel = data.verdict === "APPROVED" ? "Approved — Freelancer"
    : data.verdict === "REJECTED" ? "Rejected — Client"
    : "Partial Release";
  const badgeClass = data.verdict === "APPROVED" ? "badge-green"
    : data.verdict === "REJECTED" ? "badge-red" : "badge-yellow";

  const html = baseTemplate(`
    <h1>AI Verdict Rendered</h1>
    <p>The AI arbitrator has decided on <strong>${data.milestoneTitle}</strong>.</p>
    <div class="card" style="text-align: center;">
      <p><span class="badge ${badgeClass}" style="font-size: 14px; padding: 4px 12px;">${verdictLabel.toUpperCase()}</span></p>
      <p style="font-size: 32px; font-weight: 700; color: #00D395; margin: 12px 0 4px;">${data.confidence}%</p>
      <p style="font-size: 12px; color: #71717A; margin: 0;">confidence</p>
    </div>
    <p>Review the full reasoning and evidence citations. If you disagree, you can appeal to human jurors within 48 hours.</p>
    <a href="${APP_URL}/disputes/${data.disputeId}" class="btn">View Full Verdict →</a>
    <a href="${APP_URL}/disputes/${data.disputeId}#appeal" class="btn btn-outline" style="margin-left: 8px;">Appeal ($25)</a>
  `);

  return resend.emails.send({
    from: FROM,
    to: data.recipientEmail,
    subject: `⚖️ AI Verdict: ${verdictLabel} — ${data.milestoneTitle}`,
    html,
  });
}

export async function sendPaymentReleased(data: PaymentReleasedData) {
  const html = baseTemplate(`
    <h1>Payment Released! 🎉</h1>
    <p>Funds have been released for <strong>${data.milestoneTitle}</strong>.</p>
    <div class="card" style="text-align: center;">
      <p class="amount" style="font-size: 36px; margin: 8px 0;">${data.amountUsd}</p>
      <p style="font-size: 12px; color: #71717A; margin: 0;">USDC deposited to your wallet</p>
    </div>
    <div class="card">
      <div class="card-row"><span class="card-label">Contract</span><span class="card-value">${data.contractTitle}</span></div>
      <div class="card-row"><span class="card-label">Milestone</span><span class="card-value">${data.milestoneTitle}</span></div>
      <div class="card-row"><span class="card-label">Transaction</span><span class="card-value"><a href="https://solscan.io/tx/${data.txSignature}?cluster=devnet" style="color: #00D395; text-decoration: none;">${data.txSignature.slice(0, 12)}...</a></span></div>
    </div>
    <a href="${APP_URL}/dashboard" class="btn">View Dashboard →</a>
  `);

  return resend.emails.send({
    from: FROM,
    to: data.recipientEmail,
    subject: `💰 ${data.amountUsd} released — ${data.milestoneTitle}`,
    html,
  });
}
