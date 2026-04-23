# Memory — RevoShop DevSecOps

File ini menyimpan konteks percakapan dan keputusan yang perlu diingat di sesi-sesi berikutnya.

---

## User

- Mahasiswa program FSSE (Full Stack Software Engineering)
- Komunikasi dalam **Bahasa Indonesia** — kode tetap Bahasa Inggris
- Tidak terlalu familiar dengan DevSecOps (Jenkins, Grafana, SAST/DAST) — perlu penjelasan praktis
- Pragmatis: lebih suka solusi effort minimal tapi nilai DevSecOps-nya tinggi
- Tidak mau rebuild frontend dari nol

---

## Keputusan Arsitektur

**Backend:** Pakai Next.js API Routes (`src/app/api/`) sebagai proxy layer ke Platzi Fake Store API — bukan bikin backend baru, bukan pakai Platzi langsung dari frontend.

Alasan: Ada source code backend untuk SAST, ada endpoint nyata untuk DAST, bisa pasang Prometheus metrics untuk Grafana, threat modelling lebih kaya — tanpa rebuild frontend.

**Justifikasi tech stack (untuk assignment):**
- Next.js dipilih karena SSR untuk SEO dan middleware server-side untuk auth guard
- Zustand + cookies karena lightweight state management dengan server-side persistence
- Platzi API sebagai backend agar bisa fokus ke frontend/security layer

---

## Assignment Deliverables (Deadline: May 2, 2026)

### Threat Modelling
- DFD minimal Level 0 & Level 1
- STRIDE threat modelling dari semua DFD
- Risk assessment + counter measures dari setiap temuan
- Lampirkan hasil pengukuran sebagai justifikasi

### Project 2 — CI/CD + Grafana
- Wajib Jenkins (bukan GitHub Actions)
- Integrated security scanning di pipeline
- Wajib pakai Grafana untuk monitoring

### Project 3 — SAST + DAST
- SAST: SonarQube atau Semgrep
- DAST: OWASP ZAP
- Minimal 3 report total
- Review & perbaiki temuan
- Perbandingan before vs after

---

## Yang Masih Perlu Dibangun

- [ ] `src/app/api/auth/login/route.ts` — proxy ke Platzi + rate limiting + logging
- [ ] `src/app/api/auth/profile/route.ts` — proxy dengan token validation
- [ ] `src/app/api/products/route.ts` — proxy dengan response sanitization
- [ ] `src/app/api/metrics/route.ts` — Prometheus metrics endpoint
- [ ] `Dockerfile` — multi-stage build (node:alpine)
- [ ] `docker-compose.yml` — app + Prometheus + Grafana
- [ ] `Jenkinsfile` — stages: Install → Test → SAST → Build → Docker Build → Deploy
- [ ] Security headers di `next.config.ts` via `headers()`
- [ ] Fix cookie `auth_session` → tambah HttpOnly + Secure flag
- [ ] Rate limiting pada login endpoint
