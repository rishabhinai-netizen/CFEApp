# CFE Exam Mastery

> The CFE exam is expensive enough. The prep materials shouldn't be too.

A Progressive Web App covering all four Certified Fraud Examiner (CFE) exam domains — built by a CFE for CFE candidates. Works offline. Syncs progress across devices. Costs nothing.

---

## Why This Exists

The ACFE's official study materials run to $1,000+. Third-party prep options are thin, especially for Indian candidates who need context around Indian legal frameworks, RBI regulations, and SEBI enforcement alongside the core ACFE curriculum.

This app closes that gap.

## CFE Exam Domains

The CFE exam covers four equally-weighted domains:

| Domain | Core Topics | Indian Context Added |
|--------|-------------|---------------------|
| **Financial Transactions & Fraud Schemes** | Asset misappropriation, payroll fraud, financial statement manipulation | Indian accounting standards, RBI circulars |
| **Law** | Criminal law, civil remedies, evidence rules, expert testimony | IPC, CrPC, PMLA, Indian Evidence Act |
| **Investigation** | Interview techniques, sources of information, digital evidence, report writing | Indian investigation procedures, SFIO |
| **Fraud Prevention & Deterrence** | Ethics, corporate governance, fraud risk assessment, COSO | SEBI LODR, Companies Act 2013 |

## Features

- Practice questions with detailed explanations
- Spaced repetition algorithm — surfaces weak areas automatically
- Domain-wise performance tracking
- Offline-capable PWA — study on the Metro with no signal
- Progress sync via Supabase
- Clean, distraction-free interface

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Backend | Supabase (auth + progress sync) |
| PWA | vite-plugin-pwa + Workbox |
| Deployment | Vercel |

## Setup

```bash
git clone https://github.com/rishabhinai-netizen/CFEApp
cd CFEApp
npm install
npm run dev
```

For production build:
```bash
npm run build
```

## Who It's For

- CA professionals pursuing the CFE designation
- Fraud examiners, forensic accountants, and internal auditors
- BFSI professionals looking to add CFE to their credential stack
- Anyone serious about the fraud examination domain

---

*Built by a CA and CFE based in Mumbai. The credential took serious work. The prep tool should too.*
