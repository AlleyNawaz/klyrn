"""
Klyrn AI Arbitration Service
FastAPI server that resolves disputes using Claude AI.
Section 7 of the spec.
"""

import os
import json
import time
import hashlib
from datetime import datetime, timezone
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import anthropic
import httpx

load_dotenv()

app = FastAPI(
    title="Klyrn Arbiter",
    description="AI-powered dispute arbitration service",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("API_URL", "http://localhost:3001")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- Models ----

class FileAttachment(BaseModel):
    name: str
    url: str
    hash: str
    size: int
    mime: Optional[str] = None

class ExternalLink(BaseModel):
    label: str
    url: str

class ContractInfo(BaseModel):
    title: str
    brief_markdown: str
    brief_attachments: list[FileAttachment] = []

class MilestoneInfo(BaseModel):
    index: int
    title: str
    description: str
    amount_usdc: float
    due_date: Optional[str] = None
    submitted_at: str

class SubmissionInfo(BaseModel):
    notes: str
    files: list[FileAttachment] = []
    external_links: list[ExternalLink] = []
    screencast_url: Optional[str] = None

class DisputeInfo(BaseModel):
    reason_category: str
    client_statement: str
    client_files: list[FileAttachment] = []
    freelancer_statement: Optional[str] = None
    freelancer_files: list[FileAttachment] = []

class ArbitrationRequest(BaseModel):
    dispute_id: str
    contract: ContractInfo
    milestone: MilestoneInfo
    submission: SubmissionInfo
    dispute: DisputeInfo

class EvidenceCitation(BaseModel):
    source: str
    quote_or_observation: str
    weight: float

class ArbitrationResponse(BaseModel):
    verdict: str  # APPROVED | REJECTED | PARTIAL
    partial_percent: Optional[int] = None
    confidence: int
    reasoning: str
    evidence_cited: list[EvidenceCitation]
    should_escalate: bool
    escalation_reason: Optional[str] = None
    tokens_used: dict
    cost_usd: float
    model: str
    ran_at: str

# ---- Cache ----
_cache: dict[str, ArbitrationResponse] = {}

def compute_cache_key(req: ArbitrationRequest) -> str:
    """Cache by hash of brief + deliverable + statements."""
    key_data = json.dumps({
        "brief": req.contract.brief_markdown,
        "submission_notes": req.submission.notes,
        "client_statement": req.dispute.client_statement,
        "freelancer_statement": req.dispute.freelancer_statement or "",
    }, sort_keys=True)
    return hashlib.sha256(key_data.encode()).hexdigest()

# ---- System Prompt (verbatim from spec Section 7) ----
SYSTEM_PROMPT = """You are an impartial arbitration judge for Klyrn, a freelance escrow platform. Your job is to fairly resolve disputes between clients and freelancers based ONLY on the contractual brief, the delivered work, and both sides' statements. You are not biased toward either party.

YOUR PRINCIPLES:
1. The brief is the contract. The delivered work is judged against what the brief actually said, NOT against what either party now wishes it had said.
2. Ambiguity in the brief is the CLIENT's risk, not the freelancer's. If the brief was vague and the freelancer made a reasonable interpretation, that is acceptable delivery.
3. Quality must be assessed against industry baseline for the price paid. A $50 logo is not held to a $5,000 logo's standard.
4. Late delivery does not by itself justify rejection unless the brief explicitly made the date a hard deadline.
5. You may award PARTIAL release when the work substantially meets the brief but has clear, specific deficiencies. Use percentages in intervals of 10 (10, 20, ..., 90).
6. You must escalate to human jurors when (a) you suspect plagiarism, (b) the dispute hinges on facts you cannot verify from the evidence provided, or (c) your confidence is below 70%.
7. NEVER fabricate evidence. NEVER assume the existence of documents or facts not provided. Cite specific quotes from the brief and specific observations from the submission.

OUTPUT FORMAT:
Return ONLY valid JSON matching this schema. No prose outside the JSON.

{
  "verdict": "APPROVED" | "REJECTED" | "PARTIAL",
  "partial_percent": <int 10-90 or null>,
  "confidence": <int 0-100>,
  "reasoning": "<markdown, 200-800 words. Walk through: (1) what the brief required, (2) what was delivered, (3) where they match or diverge, (4) verdict justification.>",
  "evidence_cited": [
    {"source": "<brief|submission_file:NAME|client_statement|freelancer_statement>",
     "quote_or_observation": "<verbatim if text, descriptive if image>",
     "weight": <0.0-1.0>}
  ],
  "should_escalate": <bool>,
  "escalation_reason": <string or null>
}"""

def build_user_message(req: ArbitrationRequest) -> str:
    """Build the user message from the arbitration request."""
    # Calculate submission timing
    due_info = f"Due: {req.milestone.due_date}" if req.milestone.due_date else "Due: no hard deadline"

    # File lists
    submission_files = ", ".join([f.name for f in req.submission.files]) if req.submission.files else "none"
    external_links = ", ".join([f"{l.label}: {l.url}" for l in req.submission.external_links]) if req.submission.external_links else "none"
    brief_attachments = ", ".join([f.name for f in req.contract.brief_attachments]) if req.contract.brief_attachments else "none"
    client_files = ", ".join([f.name for f in req.dispute.client_files]) if req.dispute.client_files else "none"
    freelancer_files = ", ".join([f.name for f in req.dispute.freelancer_files]) if req.dispute.freelancer_files else "none"

    return f"""=== CONTRACT BRIEF ===
Title: {req.contract.title}
Total contract: ${req.milestone.amount_usdc}
This milestone: ${req.milestone.amount_usdc} ({req.milestone.title})

Full brief:
{req.contract.brief_markdown}

Brief attachments: {brief_attachments}

=== MILESTONE EXPECTATION ===
{req.milestone.description}
{due_info}
Submitted: {req.milestone.submitted_at}

=== DELIVERED WORK ===
Freelancer's notes: {req.submission.notes}
Files: {submission_files}
External links: {external_links}
Screencast: {req.submission.screencast_url or "none"}

=== CLIENT'S DISPUTE ===
Reason: {req.dispute.reason_category}
Statement: {req.dispute.client_statement}
Supporting files: {client_files}

=== FREELANCER'S RESPONSE ===
{req.dispute.freelancer_statement or "Freelancer did not respond within 48h"}
Supporting files: {freelancer_files}

Now adjudicate."""


@app.get("/healthz")
async def healthz():
    return {"ok": True, "service": "klyrn-arbiter"}


@app.post("/arbitrate", response_model=ArbitrationResponse)
async def arbitrate(req: ArbitrationRequest):
    """Run AI arbitration on a dispute."""
    start_time = time.time()

    # Check cache
    cache_key = compute_cache_key(req)
    if cache_key in _cache:
        return _cache[cache_key]

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY not configured")

    client = anthropic.Anthropic(api_key=api_key)
    user_message = build_user_message(req)

    try:
        # Call Claude with extended thinking for high-quality reasoning
        response = client.messages.create(
            model="claude-sonnet-4-5-20250929",
            max_tokens=16000,
            thinking={
                "type": "enabled",
                "budget_tokens": 10000,
            },
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}],
        )

        # Extract text response (skip thinking blocks)
        text_content = ""
        for block in response.content:
            if block.type == "text":
                text_content = block.text
                break

        # Parse the JSON response
        parsed = json.loads(text_content)

        # Apply override rules (Section 7, step 9)
        should_escalate = parsed.get("should_escalate", False)
        escalation_reason = parsed.get("escalation_reason")

        if req.dispute.reason_category == "PLAGIARISM":
            should_escalate = True
            escalation_reason = "Plagiarism disputes always require human review"

        if parsed.get("confidence", 0) < 70:
            should_escalate = True
            escalation_reason = escalation_reason or "Confidence below 70% threshold"

        # Calculate cost
        input_tokens = response.usage.input_tokens
        output_tokens = response.usage.output_tokens
        cost = (input_tokens * 0.003 + output_tokens * 0.015) / 1000

        result = ArbitrationResponse(
            verdict=parsed["verdict"],
            partial_percent=parsed.get("partial_percent"),
            confidence=parsed["confidence"],
            reasoning=parsed["reasoning"],
            evidence_cited=[
                EvidenceCitation(**e) for e in parsed.get("evidence_cited", [])
            ],
            should_escalate=should_escalate,
            escalation_reason=escalation_reason,
            tokens_used={"input": input_tokens, "output": output_tokens},
            cost_usd=round(cost, 4),
            model="claude-sonnet-4-5-20250929",
            ran_at=datetime.now(timezone.utc).isoformat(),
        )

        # Cache result
        _cache[cache_key] = result
        return result

    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response as JSON: {str(e)}")
    except anthropic.APIError as e:
        raise HTTPException(status_code=502, detail=f"Anthropic API error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Arbitration failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("ARBITER_PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)
