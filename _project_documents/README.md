# Rose Silvers — Project Documentation & AI Source of Truth

Welcome to the central documentation repository for **Rose Silvers** headless Shopify storefront. This directory serves as the unified **Source of Truth** for developers, AI coding assistants, and designers.

---

## 📁 Directory Structure

```
_project_documents/
├── README.md                      # This index file
├── PRD.md                         # Product Requirements Document (Full architecture, routes, APIs, constraints)
├── design.md                      # Design System & Guidelines (Colors, typography, mobile guide, spacing)
├── AGENTS.md                      # Rules and operational instructions for AI agents
├── CLAUDE.md                      # Configuration for Claude / AI assistant context
└── plans/                         # Detailed feature specifications and roadmap plans
    └── ai_gift_chooser_plan.md    # AI Chooser & Gift/Surprise Concierge specification
```

---

## 📌 Core Documents Guide

### 1. [PRD.md](./PRD.md)
* **What to build:** Complete specification of pages, routes (Next.js App Router), Shopify Storefront API GraphQL queries/mutations, Cart persistence, and bilingual setup (EN/AR).
* **What NOT to do:** Explicit negative constraints (no pure black `#000000`, no rounded corners > 2px, no CSS frameworks like Tailwind, no client-side hardcoded products).

### 2. [design.md](./design.md)
* **Visual Identity:** Exact color palette (`#F9F9F9`, `#FFFFFF`, `#111111`, `#777777`), typography pairings (`Playfair Display` + `Inter` for English, `Amiri` + `Tajawal` for Arabic).
* **Mobile Guidelines:** Touch targets (44px min), sticky navigation, edge-to-edge imagery, single/double column responsive layouts.

### 3. [plans/ai_gift_chooser_plan.md](./plans/ai_gift_chooser_plan.md)
* **Smart Gift Concierge (Phase 2):** User questionnaire flow, occasion/aesthetic matching logic, surprise bundle generator, and Storefront API query definitions.

### 4. [AGENTS.md](./AGENTS.md) & [CLAUDE.md](./CLAUDE.md)
* Specific environment constraints and Next.js / framework guidelines.

---

## 💡 Quick Rules for AI Assistants
1. **Always read `design.md` and `PRD.md`** before writing UI or architecture code.
2. Use **Vanilla CSS Modules** for styling. Do not install Tailwind or component UI libraries.
3. Keep code strictly typed (TypeScript strict mode) and files under 300 lines.
