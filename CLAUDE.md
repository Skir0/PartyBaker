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
```

### Backend (Go)
```bash
go run cmd/server/main.go          # Start server (reads .env)
go test ./internal/...            # Run all backend tests
go test ./internal/db/...         # Run DB-specific tests
go build -o bin/server cmd/server/main.go  # Build binary
go mod tidy                        # Sync dependencies
```

### Database (PostgreSQL + SQLC)
```bash
sqlc generate        # Generate Go code from query.sql (requires sqlc.yaml)
psql -U <user> -d party_baker -f migrations/000001_init_schema.up.sql  # Apply migrations
```

---

## 🏗️ Code Architecture

### Project Structure
```
PartyBaker/
├── cmd/server/main.go              # Backend entry point
├── internal/                       # Core backend packages
│   ├── api/                        # HTTP handlers, middleware, routing
│   │   ├── handler.go
│   │   ├── middleware.go
│   │   ├── models.go
│   │   └── router.go
│   ├── blockchain/                 # TON/Jetton integration
│   │   ├── client.go               # TON client setup
│   │   ├── constants.go            # Contract addresses, config
│   │   ├── gift_wallet.go          # GiftWallet contract wrapper
│   │   └── messages.go            # TON message builders
│   ├── db/                         # PostgreSQL layer (sqlc-generated)
│   │   ├── db.go                   # Connection pool, config
│   │   ├── models.go               # DB structs (Events, Gifts, etc.)
│   │   └── query.sql.go            # Generated CRUD queries
│   ├── indexer/                    # Blockchain event indexer
│   │   └── worker.go
│   ├── repository/                 # Business logic / data access
│   │   └── repository.go
│   └── telegram/                   # Telegram Bot API integration
│       └── auth.go
├── front-react-dapp/               # React + TypeScript + Vite
│   ├── src/
│   │   ├── api/                    # API clients (giftService.ts, apiClient.ts)
│   │   ├── components/             # UI components
│   │   │   ├── cards/              # ProTipCard, StepHeaderCard, StreamlineCard
│   │   │   ├── forms/              # EventForm, DateFields, EventNameField
│   │   │   └── ui/                 # BottomButton, MaterialIcon, TopAppBar
│   │   ├── pages/                  # NewEventPage, CreateEventCard
│   │   ├── types/                  # event.types.ts
│   │   └── wrappers/               # GiftWallet.compile.ts, GiftWallet.ts
│   ├── index.html
│   ├── vite.config.ts
│   └── tailwind.config.js
├── contracts/                       # TON contracts (PartyBaker)
│   ├── errors.tolk
│   ├── gift-wallet-contract.tolk
│   ├── messages.tolk
│   ├── storage.tolk
│   └── utils.tolk
├── migrations/                      # PostgreSQL migrations (sequential)
│   ├── 000001_init_schema.up.sql
│   ├── 000002_add_wallet_address.up.sql
│   ├── 000003_update_gift_to_active.up.sql
│   └── 000004_add_collected_amount.sql
├── scripts/                         # Deployment & utility scripts
│   ├── deployGiftWallet.ts
│   └── sendNotification.ts
├── tests/                           # E2E / integration tests
│   └── GiftWallet.spec.ts
├── tolk-jetton-blueprint/           # Jetton (token) contracts (submodule)
│   ├── contracts/
│   ├── wrappers/
│   └── tests/
├── sqlc.yaml                        # SQLC config (generates db/query.sql.go)
├── query.sql                        # SQL queries consumed by sqlc
├── .env                             # Environment variables (DB_URL, TON config, etc.)
└── go.mod / go.sum                   # Go module definition
```

### Key Patterns
- **Backend**: Uses `sqlc` to generate type-safe DB code from `query.sql`. All DB access goes through `repository.go`.
- **Frontend**: Uses `@tonconnect/ui-react` for wallet auth. API calls go through `giftService.ts` → `apiClient.ts`.
- **Blockchain**: TON contracts written in Tolk. GiftWallet wrapper in `front-react-dapp/src/wrappers/`.
- **Migrations**: Sequential `.up.sql` files in `migrations/`. Applied manually or via a tool like `golang-migrate`.
- **Telegram**: Integrated for notifications (`sendNotification.ts`) and auth (`internal/telegram/auth.go`).

---

## 📝 Key References
1. **README.md** – Project overview, deploy steps, Jetton setup.
2. **sqlc.yaml** – Defines SQLC behavior (output, package names).
3. **.env** – Must define `DATABASE_URL`, `TON_API_KEY`, `TELEGRAM_BOT_TOKEN`, etc.
4. **migrations/** – Schema changes; always review before modifying DB models.

---

## ✅ Getting Started
1. **Backend**:
   ```bash
   cp .env.example .env   # Or create .env with PostgreSQL URL
   go mod tidy
   sqlc generate          # If query.sql changed
   go run cmd/server/main.go
   ```
2. **Frontend**:
   ```bash
   cd front-react-dapp
   npm install
   npm run dev
   ```
3. **Database**:
   ```bash
   createdb party_baker   # If not exists
   psql party_baker -f migrations/000001_init_schema.up.sql
   ```
4. **Contracts**: Compile Tolk contracts via `tolk-cli` if modified.

---

## 🔄 Update Policy
This file is updated whenever there are **significant project changes**:
- New major directories or packages
- Database schema changes (new migrations)
- New technology integrations (e.g., adding Redis, changing ORMs)
- Architectural shifts (e.g., adding a message queue)

_Last updated: 2026-04-26 — PostgreSQL confirmed, full structure added._

##Clarification Before Action:
Before diving into complex work, ask 3–4 clarifying questions to understand context, goals, and constraints. Use the built-in interactive Q&A checkboxes — not inline lists. Once you have enough context, respond fully without further unnecessary questions. The goal is a better response that covers edge cases the user may not have anticipated.

##Improve & Suggest:
While working, briefly note opportunities for automation, improvement, or repeatability (1–2 sentences, only when relevant). If a task is a good candidate for a Claude Skill, say so — and remind the user to update their Skills or preferences based on usage patterns.

##File & Output Preferences:
Default to Markdown (.md) for any file output unless the request clearly calls for another format (.docx, .xlsx, .pptx, etc.). When no file is needed, respond directly in chat.

##Learning skill
explain all your moves in order i could learn new technologies for me such as React, Go etc