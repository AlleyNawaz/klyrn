# Klyrn

**Stripe for freelancers, but the escrow can't be stolen and disputes are resolved by AI in 8 seconds instead of by Upwork in 8 weeks.**

Klyrn is a Solana-based freelance escrow platform with AI-powered dispute arbitration. Clients fund milestone-based contracts into on-chain escrow. Freelancers submit deliverables with cryptographic proof. Disputes are resolved by Claude AI in seconds, with optional human jury escalation.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│   Next.js   │────▶│   Hono API  │────▶│   FastAPI     │
│   Frontend  │     │   Backend   │     │   AI Arbiter  │
│   :3000     │     │   :3001     │     │   :8000       │
└──────┬──────┘     └──────┬──────┘     └──────┬───────┘
       │                   │                    │
       │            ┌──────▼──────┐      ┌──────▼───────┐
       │            │  Postgres   │      │   Claude AI   │
       │            │  + Prisma   │      │  (Anthropic)  │
       │            └─────────────┘      └──────────────┘
       │
┌──────▼──────┐     ┌─────────────┐
│   Privy     │     │   Solana    │
│  Auth/Wallet│     │  Program    │
└─────────────┘     │  (Anchor)   │
                    └─────────────┘
```

## Quick Start

```bash
# 1. Boot Postgres + Redis
docker compose -f infra/docker-compose.yml up -d

# 2. Install dependencies
pnpm install

# 3. Start all services
pnpm dev
```

## Demo

```bash
# Seed demo data and run
make demo

# Or manually:
pnpm seed:demo
pnpm dev
# Open http://localhost:3000
```

The demo walks through: contract creation → milestone submission → dispute → AI arbitration in 8 seconds.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), Tailwind, Framer Motion |
| API | Hono (Node.js), Zod, BullMQ |
| AI Arbiter | Python FastAPI, Claude claude-sonnet-4-5 |
| Database | PostgreSQL 16, Prisma ORM |
| Blockchain | Solana, Anchor 0.30.1 |
| Auth | Privy (embedded wallets) |
| Email | Resend + React Email |
| Storage | Cloudflare R2 |

## Project Structure

```
klyrn/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # Hono backend API
│   └── arbiter/      # Python AI arbitration service
├── packages/
│   ├── program/      # Anchor Solana program
│   ├── sdk/          # TypeScript SDK
│   ├── db/           # Prisma schema + client
│   └── types/        # Shared TS types
├── infra/
│   ├── docker-compose.yml
│   └── seed/         # Demo seed scripts
```

## Known Limitations (MVP)

1. **Arbiter authority** is a single backend-controlled key (see SECURITY.md)
2. **File storage** uses placeholder URLs — needs R2 integration for production
3. **Privy integration** needs real API keys for wallet creation
4. **On-ramp** (MoonPay) widget is placeholder
5. **cNFT minting** for reputation is stubbed

## V2 Roadmap

- [ ] Squads multisig for arbiter authority (replace hot key)
- [ ] Real cNFT reputation minting via Bubblegum
- [ ] Mainnet deployment
- [ ] Mobile app (React Native)
- [ ] Smart invoice generation
- [ ] Multi-currency support (beyond USDC)
- [ ] Escrow insurance fund
