# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🔧 Common Commands

### Frontend (`front-react-dapp/`)
```bash
cd front-react-dapp
npm install          # Install dependencies
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run lint         # ESLint + Prettier check
npm test             # Jest tests
npm run graphql      # Run GraphQL queries against dev server
npm run graphiql     # Start GraphiQL explorer
```

### Backend (Go + GraphQL)
```bash
# Run server with GraphQL endpoint
go run cmd/server/main.go --graphql :8080

# Run GraphQL introspection
graphql --endpoint http://localhost:8080/graphql < schema.graphql

# Run healthcheck services
flyctl status party-baker-server
kubectl get pods -n party-baker
```

### Database (PostgreSQL + SQLC + Prisma)
```bash
# Initialize database
createdb party_baker

# Run initial migration
psql -U <user> -d party_baker -f migrations/000001_init_schema.up.sql

# Generate type-safe queries
sqlc generate
prisma migrate dev --name init

# Run speculative queries
psql -d party_baker -c "SET speculative_additions=ON" -f queries/speculative.sql
```

---

## 🏗️ Code Architecture

### Project Structure
```
PartyBaker/
├── cmd/server/main.go              # Entry point with GraphQL API
├── internal/                       # Core backend packages
│   ├── api/                        # HTTP + GraphQL handlers
│   │   ├── handler.go              # HTTP endpoints
│   │   ├── gqlsetup.go             # GraphQL schema setup
│   │   ├── models.go
│   │   ├── router.go               # Request routing
│   │   └── subscriptions.go        # GraphQL subscriptions
│   ├── blockchain/                 # TON/Jetton integration
│   │   ├── clients/                # Different chain clients
│   │   └── processors/             # Event processing pipelines
│   ├── db/                         # Double-layered DB access
│   │   ├── sqlc/                   # SQLC-generated code
│   │   └── prisma/                 # N+1 querying helpers
│   ├── indexer/                    # Streaming analytics
│   │   └── workers/                # Event processing workers
│   ├── repository/                 # Service layer
│   └── telegram/                   # Notification subsystem
│       └── bots/                   # Multiple bot implementations
├── front-react-dapp/               # React + TypeScript + Vite
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── api/                    # GraphQL clients
│   │   │   ├── mutations
│   │   │   ├── queries
│   │   │   └── subscriptions
│   │   ├── components/             # Isomorphic components
│   │   │   ├── auth/               # Auth forms
│   │   │   ├── events/
│   │   │   └── layout/
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── useAuthenticated.ts
│   │   │   ├── useGiftWallet.ts
│   │   │   └── useTonConnect.ts
│   │   ├── pages/
│   │   │   ├── dashboard/
│   │   │   ├── events/
│   │   │   └── profile/
│   │   └── styles/                 # Theming system
│   ├── surf.config.ts              # Tailwind variants
│   └── .env.example                # Env template
├── contracts/                       # TON contracts
│   ├── core/                       # Base contract files
│   ├── minting/                    # Minting logic variants
│   └── interfaces/                 # Common interfaces
├── migrations/                      # Versioned schema changes with time travel
│   ├── 000001_init_schema.up.sql
│   ├── 000002_add_wallets.up.sql
│   ├── 000003_update_gifts.up.sql
│   ├── 000004_add_collected_amount.sql
│   └── 000005_add_events.up.sql     # New events table
├── scripts/                         # Deployment scripts
│   ├── rotate-keys.ts              # Key rotation
│   └── backup-redis.sh             # Redis maintenance
├── tests/                           # Quality gate
│   ├── backend/
│   │   ├── unit/
│   │   ├── e2e/
│   │   └── coverage/               # HTML coverage reports
│   ├── frontend/
│   │   ├── visual/
│   │   └── smoke/
│   ├── blockchain/
│   └── integration/
├── tolk-jetton-blueprint/           # Monorepo of token contracts
│   ├── core/
│   ├── swap/                     # DEX implementation
│   └── governance/
├── prisma/schema.prisma
├── sqlc.yaml
├── .env                            # Manager credentials hidden
└── .gitignore                      # Security exceptions

### Architecture Enhancements
- **Data Layer**: Dual-layered approach with SQLC (static) + Prisma (dynamic queries)
- **Auth**: Unified auth system with TON wallets + third-party providers
- **Observability**: Distributed tracing + metrics collection
- **Composability**: Reusable components across frontend pages and admin UI

---

## 📝 Key References

1. **README.md** - Comprehensive deployment guide with Docker and K8s
2. **Prisma Migration Guide** - Editing schema without data loss
3. **Tolkein to SQL Flow** - Contract events → DB columns
4. **Security Checklist** - Regular pentest procedures
5. **Event Bus Documentation** - Real-time notification system

---

## ✅ Getting Started

1. **Full System**: `cd front-react-dapp && npm install && npm run dev`
2. **API First**: `go run cmd/server/main.go --graphql :8080`
3. **Specialized**: `npx ts-node scripts/rotate-keys.ts`
4. **Production**: `flyctl deploy` for globally distributed deployment

---

## 🔄 Update Policy

This file is updated whenever there are significant project changes:
- New major directories (e.g., tolk-jetton-blueprint → Monorepo)
- Database schema changes with upgrade paths
- New technology integrations (Prisma, GraphQL subscriptions)
- Architectural shifts (e.g., added latency optimization)

_Last updated: 2026-05-18 — Full documentation example_