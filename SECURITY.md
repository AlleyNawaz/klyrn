# Klyrn Security Model

## Trust Assumptions

### 1. Arbiter Authority (CRITICAL — MVP RISK)

**Current state:** The `resolve_dispute` instruction accepts a single signer as the arbiter authority. In the MVP, this is a hot key controlled by the backend server.

**Risk:** If the backend server or its key are compromised, an attacker could resolve disputes in their favor, stealing escrowed funds.

**Mitigation (V2):** Replace with a Squads multisig requiring 2-of-3 signatures from:
- The AI arbitration service
- A time-locked governance key
- A DAO-controlled key

### 2. Privy Embedded Wallets

Users' Solana wallets are created and managed by Privy's infrastructure. Privy holds the key shares using MPC (multi-party computation).

**Trust:** We trust Privy to not collude or lose key shares. Users can export their keys at any time.

### 3. On-Chain Escrow

Funds are held in PDA-controlled token accounts. The program logic is the only authority over escrow funds. No admin key can drain escrow.

**Trust:** The Anchor program is correct and the Solana runtime enforces the constraints.

### 4. AI Arbitration

Claude's decisions are logged and auditable. The system prompt is fixed and documented. Both parties receive the full reasoning.

**Trust:** We trust Anthropic's model to follow the system prompt faithfully. We do NOT trust it blindly — confidence < 70% or plagiarism cases are always escalated to humans.

### 5. File Integrity

Deliverable files are hashed (SHA-256) and the hash is stored on-chain. This proves what was submitted at the time of submission.

**Trust:** SHA-256 collision resistance. The file content itself is stored off-chain (R2).

## API Security

- All financial amounts use BigInt — never floating point
- Zod validation on every request body; unknown fields rejected
- Rate limiting via Redis sliding window (60 writes/min, 600 reads/min)
- Webhook signature verification for Helius and Privy
- Signed S3/R2 URLs with 24h expiry for file access
- Idempotency keys on transaction-triggering endpoints

## Abuse Prevention

- Contract creation limited to 5/day without KYC, 50/day with
- Minimum contract value: $20
- Maximum contract value: $50,000 (MVP)
- Disposable email domains blocked at signup

## Privacy

- KYC data handled by Civic (we don't store sensitive docs)
- Email notifications contain titles/links only, not file contents
- Public profiles show aggregated stats only
