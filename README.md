## Fuel EU Maritime Compliance — Minimal Hexagonal Implementation

This repository contains a minimal yet structured implementation of a Fuel EU Maritime compliance module following Hexagonal Architecture (Ports & Adapters) with:

- Frontend: React + TypeScript + TailwindCSS
- Backend: Node.js + TypeScript + Express + Hexagonal Architecture
- Persistence: Ports-first with in-memory adapter by default; Prisma/PostgreSQL adapter scaffolded
- Testing: Vitest for backend unit tests; React Testing Library for frontend components

### Project Structure

```
frontend/
backend/
AGENT_WORKFLOW.md
README.md
REFLECTION.md
```

### Hexagonal Architecture Summary

- Core (`core/`): framework-agnostic domain, application use-cases, and ports
- Adapters (`adapters/`): maps ports to UI, HTTP, DB, etc.
- Infrastructure (`infrastructure/`): express server, prisma client, configuration
- Shared (`shared/`): shared constants/utilities

Each side depends inward only on `core/` via ports.

### Setup & Run

Prerequisites: Node 18+ and PNPM or NPM.

Backend:

```bash
cd backend
pnpm install # or npm install
pnpm dev     # runs express server at http://localhost:4000
pnpm test    # run unit tests
```

Frontend:

```bash
cd frontend
pnpm install # or npm install
pnpm dev     # runs Vite dev server at http://localhost:5173
pnpm test    # run component tests
```

Note: The backend defaults to an in-memory adapter with seeded data. PostgreSQL/Prisma adapter is scaffolded; see `backend/prisma/README-Prisma.md` for details.

### API Overview (Backend)

- `GET /routes` — list all routes
- `POST /routes/:id/baseline` — set a route as baseline
- `GET /routes/comparison` — baseline vs others, `percentDiff`, `compliant`
- `GET /compliance/cb?shipId&year` — compute compliance balance (CB) snapshot
- `GET /compliance/adjusted-cb?shipId&year` — returns CB after any bank applications
- `GET /banking/records?shipId&year` — list banked records
- `POST /banking/bank` — bank positive CB
- `POST /banking/apply` — apply banked surplus (validate ≤ available)
- `POST /pools` — create pool per Article 21 constraints

### Frontend Tabs

- Routes: table with filters and “Set Baseline” action
- Compare: baseline vs comparison table and chart
- Banking: current CB, bank/apply actions with validations
- Pooling: create pool with members and validity rules

### Testing

Backend unit tests focus on:

- `ComputeComparison`
- `ComputeCB`
- `BankSurplus`
- `ApplyBanked`
- `CreatePool`

Run:

```bash
cd backend && pnpm test
```

Frontend unit tests focus on components rendering and basic interactions. Run:

```bash
cd frontend && pnpm test
```

### Sample Requests

```bash
# List routes
curl http://localhost:4000/routes

# Set baseline
curl -X POST http://localhost:4000/routes/R001/baseline

# Comparison
curl http://localhost:4000/routes/comparison

# Compute CB
curl "http://localhost:4000/compliance/cb?shipId=S001&year=2025"
```

See `AGENT_WORKFLOW.md` for prompts, outputs, and validation notes. See `REFLECTION.md` for learnings. 

This implementation is intentionally minimal but demonstrates clean separation, testable use-cases, and clear adapters with room for further extension.



