# Eventwise AI — Every event, effortlessly extraordinary.

A modern, production-grade, AI-assisted event planning and management SaaS platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **Multi-Agent AI Orchestration**.

---

## 🌟 Overview & Product Vision

Eventwise AI helps individuals, couples, families, college organizers, and community managers turn complex celebrations into calm, coordinated, and beautifully executed plans. 

- **Primary Markets:** India (default `INR (₹)`, Indian date formatting, and Lakhs/Crores number grouping), with an internationalized data architecture.
- **Event Domains:**
  - 💍 **Weddings & Engagements:** Pheras, sangeet, and reception timelines with ceremonial notes and guest hospitality.
  - 🎂 **Birthdays & Anniversaries:** Milestone parties, obstacle courses, themed cakes, and keepsakes.
  - 🤝 **Community & Cultural Gatherings:** Open-source hackathons, summits, fests, and volunteer coordination.
  - 🏢 **Corporate Conferences & Seminars:** Keynotes, sponsor expos, and delegate badges.

---

## 🧠 Multi-Agent AI Architecture

Eventwise AI uses a server-side multi-agent architecture with **7 specialist agents** coordinated by an application-level orchestrator:

1. **Event Planning Coordinator:** Gathers requirements, validates constraints, and routes work to specialists.
2. **Budget Advisor:** Allocates funds across categories based on guest count and location with zero floating-point arithmetic.
3. **Timeline Planner:** Backwards-plans milestone deadlines from the event date, flagging lead-time bottlenecks.
4. **Vendor Coordinator:** Identifies required services, target price points, and key questions to ask before booking.
5. **Creative Ideas Specialist:** Recommends moodboards, color palette hex swatches, decor concepts, and guest interaction rituals.
6. **Risk Assessment Specialist:** Flags weather, capacity, and schedule risks with practical mitigation steps.
7. **Guest & Hospitality Assistant:** Organizes attendee groups (Family, VIP, Friends) and tracks dietary restrictions.

> [!NOTE]
> **Deterministic Fallback Engine:** If an `OPENAI_API_KEY` is not provided or the network is unavailable, Eventwise AI automatically activates its deterministic planning templates. The app remains 100% usable in preview mode without crashing.

---

## 🚀 Quick Start Guide

### 1. Requirements
- **Node.js:** v20+ (Node v24 tested)
- **NPM:** v10+

### 2. Installation
```bash
git clone <repo-url>
cd eventwise-ai
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
# Database (SQLite for zero-friction local development; PostgreSQL for production)
DATABASE_URL="file:./dev.db"

# Authentication Secrets
JWT_SECRET="eventwise-super-secret-key-production-ready-2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# OpenAI Configuration (Optional — intelligent deterministic fallback is active if empty)
OPENAI_API_KEY="your_openai_api_key_here"
OPENAI_MODEL="gpt-4o-mini"

NODE_ENV="development"
PORT=3000
```

### 4. Database Setup & Seeding
Initialize the SQLite database and seed realistic demo events:
```bash
# Push Prisma schema to SQLite
npx prisma db push

# Seed rich sample events (Udaipur Wedding, Superhero Birthday, Community Summit)
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Demo Account Credentials

A pre-seeded demo user is available for immediate testing:
- **Email:** `demo@eventwise.ai`
- **Password:** `password123`
- *(Or click **"Auto-Fill Demo Credentials"** on the Sign In page for one-click access)*

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router, Server & Client Components) |
| **Language** | TypeScript (Strict mode enabled) |
| **Styling** | Tailwind CSS with custom design tokens (Warm neutrals & indigo) |
| **Icons & UI** | Lucide React |
| **Database & ORM** | SQLite (Dev) / PostgreSQL (Prod) via Prisma ORM |
| **Authentication** | HTTP-only Cookie JWT via `jose` + `bcryptjs` password hashing |
| **AI Orchestration** | Server-side OpenAI SDK + Zod strict schema validation + Fallback engine |
| **Testing** | Node.js native test runner via `tsx --test` (7 automated tests) |

---

## 🧪 Automated Testing

Run the automated test suite:
```bash
npm test
```
The test suite covers:
- **Financial Audit & Budgeting:** Deterministic arithmetic, category variances, and over-budget guardrails.
- **AI Multi-Agent Schema Validation:** Zod schema parsing and domain fallback templates.
- **Utilities & Formatting:** Indian Rupee currency formatting, slug generation, and countdown timers.

---

## 📦 Production Build & Deployment

To verify and run the production build:
```bash
npm run build
npm start
```

### Production PostgreSQL Deployment (Vercel / Supabase / Neon)
1. In `prisma/schema.prisma`, update the datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Set your production `DATABASE_URL="postgresql://user:pass@host:5432/eventwise"` in your hosting environment variables.
3. Run `npx prisma db push` or `prisma migrate deploy` during the build step.
