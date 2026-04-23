# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Context — DevSecOps Assignment

This is **RevoShop**, a Next.js 15 e-commerce app being used as the base project for a DevSecOps university assignment. The frontend already exists and should **not** be rebuilt. All DevSecOps work is layered on top.

**Assignment deliverables (deadline: May 2, 2026):**
1. **Threat Modelling** — DFD Level 0 & 1, STRIDE-based threat modelling, risk assessment with countermeasures
2. **Project 2** — CI/CD pipeline (Jenkins) with integrated security scanning + Grafana monitoring
3. **Project 3** — SAST (SonarQube/Semgrep) + DAST (OWASP ZAP), minimum 3 reports, before/after comparison

**Architectural decision:** Instead of a separate backend, Next.js API Routes (`src/app/api/`) act as a security middleware layer that proxies to the Platzi Fake Store API (`https://api.escuelajs.co/api/v1`). This gives real backend code for SAST, real endpoints for DAST, and a place to add rate limiting, logging, and Prometheus metrics for Grafana — without rebuilding the frontend.

---

## Commands

```bash
npm run dev       # Start dev server at localhost:3000
npm run build     # Production build
npm run start     # Start production server
npm test          # Run all tests with coverage
```

Run a single test file:
```bash
npx jest src/__test__/components/LoginForm.test.tsx
```

Run tests without coverage (faster):
```bash
npx jest --coverage=false
```

---

## Architecture

### Route Groups & Pages

```
src/app/
├── (customer)/          # Public-facing routes — has its own layout with Header/Footer
│   ├── page.tsx         # Home
│   ├── shop/page.tsx    # Product listing with category/price filters
│   ├── cart/page.tsx    # Protected — customer & admin
│   └── product/[slug]/[id]/page.tsx  # Dynamic product detail (SSR)
├── (admin)/
│   └── dashboard/page.tsx  # Protected — admin only; product CRUD
├── login/page.tsx
├── faq/page.tsx
├── unauthorized/page.tsx
└── api/                 # (TO BE BUILT) — security proxy layer for DevSecOps
```

### Auth Flow

Auth is split across two files with **duplicate logic** — this is a known tech debt:
- [store.ts](store.ts) — the primary Zustand store used by the app; handles user + cart together
- [src/lib/authStore.ts](src/lib/authStore.ts) — secondary auth-only Zustand store, not fully wired up (has TODO comments)

**Login sequence** ([src/app/login/page.tsx](src/app/login/page.tsx)):
1. POST credentials → Platzi API → get `access_token`
2. GET `/auth/profile` with Bearer token → get user object
3. `setUser()` in `store.ts` → writes `auth_session` cookie (JSON-stringified user, 1-day expiry, SameSite=Lax)
4. Cart for that user is restored from `cart_user_{userId}` cookie

**Route protection** ([src/proxy.ts](src/proxy.ts)):
- Next.js middleware reads `auth_session` cookie, parses JSON, checks `user.role`
- Matcher runs on: `/cart/*`, `/admin/*`, `/dashboard/*`
- Config lives in [src/config/protectedroutes.ts](src/config/protectedroutes.ts)

**Important:** `auth_session` cookie contains the full user object as plaintext JSON — no HttpOnly, no encryption. This is a known vulnerability intentionally left for SAST/DAST to catch and for before/after comparison.

### State Management

Zustand store at [store.ts](store.ts) holds both `user` and `items` (cart). The `persist` middleware is configured to not actually persist items (`partialize: () => ({ items: [] })`); cart persistence is handled manually via cookies per-user (`cart_user_{userId}`), not localStorage.

### Path Aliases

Defined in `tsconfig.json` and `jest.config.ts`:
- `@/` → project root (e.g., `@/store` → `store.ts`)
- `@/src/` → `src/`
- `@/components/` → `src/components/`

### Testing

Tests live in [src/__test__/](src/__test__/) and mirror the component structure. Jest uses jsdom environment. Coverage is collected automatically on every `npm test` run and output to `coverage/`.

---

## Known Vulnerabilities (for SAST/DAST before/after)

These are real issues to document as "before" state, then fix:

| Issue | Location | Type |
|---|---|---|
| `auth_session` cookie not HttpOnly | `store.ts:128` | XSS risk |
| `auth_session` cookie not Secure flag | `store.ts:128` | MITM risk |
| Cookie value is plaintext JSON (no encryption) | `store.ts:128` | Info exposure |
| No security headers (HSTS, X-Frame-Options, etc.) | `next.config.ts` | Missing headers |
| `dangerouslyAllowSVG: true` | `next.config.ts:6` | XSS via SVG |
| `hostname: '**'` in image remotePatterns | `next.config.ts:10` | SSRF risk |
| No rate limiting on login | `src/app/login/page.tsx` | Brute force |
| No input sanitization on login form | `src/app/login/page.tsx` | Input validation |
| Direct fetch to external API from client | `src/app/login/page.tsx:30` | Exposes API endpoint |

---

## DevSecOps Additions To Build

### 1. Next.js API Routes (security proxy layer)
Create under `src/app/api/`:
- `auth/login/route.ts` — proxy to Platzi, add rate limiting + request logging
- `auth/profile/route.ts` — proxy with token validation
- `products/route.ts` — proxy with response sanitization

### 2. Docker
- `Dockerfile` — multi-stage build (node:alpine)
- `docker-compose.yml` — app + Prometheus + Grafana services

### 3. Jenkins CI/CD
- `Jenkinsfile` — stages: Install → Test → SAST (Semgrep/SonarQube) → Build → Docker Build → Deploy

### 4. Monitoring
- Prometheus metrics endpoint at `src/app/api/metrics/route.ts`
- Grafana dashboard connected to Prometheus
- Key metrics: auth failures, request rate, response time

### 5. Security Headers
Add to `next.config.ts` via `headers()`:
- `Strict-Transport-Security`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy`
- `Referrer-Policy`

---

## External API

All product/user data comes from **Platzi Fake Store API**: `https://api.escuelajs.co/api/v1`

Key endpoints used:
- `POST /auth/login` — returns `access_token`
- `GET /auth/profile` — returns user object (requires Bearer token)
- `GET /products` — product listing
- `GET /categories` — category listing
- `GET /products/{id}` — single product (used in SSR product detail page)
