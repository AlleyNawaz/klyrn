# Klyrn Architecture

## System Overview

```mermaid
graph TB
    subgraph "Frontend (Next.js 14)"
        WEB[Web App :3000]
        PRIVY[Privy Auth SDK]
    end
    
    subgraph "Backend"
        API[Hono API :3001]
        BULL[BullMQ Workers]
        REDIS[(Redis)]
    end
    
    subgraph "AI Service"
        ARB[FastAPI Arbiter :8000]
        CLAUDE[Claude AI]
    end
    
    subgraph "Data"
        PG[(PostgreSQL)]
        R2[(Cloudflare R2)]
    end
    
    subgraph "Blockchain"
        SOL[Solana Program]
        HELIUS[Helius RPC]
    end
    
    WEB --> PRIVY
    WEB --> API
    API --> PG
    API --> REDIS
    API --> BULL
    API --> SOL
    API --> R2
    BULL --> ARB
    BULL --> API
    ARB --> CLAUDE
    SOL --> HELIUS
    HELIUS --> API
```

## Data Flow: Contract Lifecycle

```mermaid
stateDiagram-v2
    [*] --> PENDING_ACCEPTANCE: Client creates + funds
    PENDING_ACCEPTANCE --> ACTIVE: Freelancer accepts
    PENDING_ACCEPTANCE --> CANCELLED: Either party cancels
    ACTIVE --> ACTIVE: Milestone submitted
    ACTIVE --> ACTIVE: Milestone approved
    ACTIVE --> ACTIVE: Milestone disputed
    ACTIVE --> COMPLETED: All milestones resolved
    CANCELLED --> [*]
    COMPLETED --> [*]
```

## Dispute Resolution Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant API as Backend
    participant ARB as AI Arbiter
    participant SOL as Solana
    
    C->>API: Dispute milestone
    API->>SOL: dispute_milestone tx
    API-->>C: Notify freelancer
    Note over API: 48h response window
    API->>ARB: POST /arbitrate
    ARB->>ARB: Analyze brief vs delivery
    ARB-->>API: Verdict + reasoning
    alt Confidence >= 70%
        API->>SOL: resolve_dispute tx
        SOL-->>API: Funds distributed
    else Confidence < 70%
        API->>API: Assign 3 jurors
        Note over API: 24h voting window
        API->>SOL: resolve_dispute tx
    end
```

## PDA Structure

| Account | Seeds | Authority |
|---------|-------|-----------|
| Contract | `["contract", contract_id]` | Program |
| Escrow Token | `["escrow", contract_pda]` | Contract PDA |
| Milestone | `["milestone", contract_pda, index]` | Program |
| ReputationStats | `["reputation", user_pubkey]` | Program |

## Key Design Decisions

1. **Separate AI service**: Python FastAPI for file processing (PDFs, images) and Claude integration. Different scaling profile than the Node.js API.

2. **BigInt everywhere**: Financial amounts never touch floating point. Cents in DB, USDC base units on-chain.

3. **Brief-as-ground-truth**: The contract brief markdown is hashed on-chain and used as the primary evidence for AI arbitration.

4. **Auto-approval timer**: Prevents clients from indefinitely blocking payments. Default 5 days, configurable per contract.

5. **Reputation on-chain**: cNFTs via Bubblegum make reputation portable across platforms.
