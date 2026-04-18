# EZ Agents — Project Documentation

> Comprehensive reference for building a documentation website for **@howlil/ez-agents**.

**Version:** 5.0.6
**License:** MIT
**Repository:** [github.com/howlil/ez-agents](https://github.com/howlil/ez-agents)
**NPM Package:** [@howlil/ez-agents](https://www.npmjs.com/package/@howlil/ez-agents)
**Node requirement:** `>=16.7.0`

---

## Table of Contents

1. [Overview](#1-overview)
2. [Getting Started](#2-getting-started)
3. [Core Concepts](#3-core-concepts)
4. [CLI Commands Reference](#4-cli-commands-reference)
5. [Agents](#5-agents)
6. [Workflows](#6-workflows)
7. [Skills System](#7-skills-system)
8. [Phase System](#8-phase-system)
9. [Architecture](#9-architecture)
10. [Design Patterns](#10-design-patterns)
11. [Configuration](#11-configuration)
12. [Runtime Guards](#12-runtime-guards)
13. [Build, Test & Release](#13-build-test--release)
14. [Docker Support](#14-docker-support)
15. [CI/CD Pipelines](#15-cicd-pipelines)
16. [Contributing & Governance](#16-contributing--governance)
17. [Security](#17-security)
18. [FAQ](#18-faq)

---

## 1. Overview

### What is EZ Agents?

**EZ Agents** is a **multi-agent orchestration system** for building software with AI agents. It coordinates a team of specialist AI agents through a structured **10-phase SDLC workflow** — from initial project brief to production-ready code.

The system takes your project requirements, decomposes them into a dependency-aware task graph, delegates work to specialist agents in parallel, enforces quality gates, and delivers implementation-ready output: code, tests, documentation, and release artifacts.

### Why EZ Agents?

| Problem | EZ Agents Solution |
|---|---|
| Coordinating multiple AI agents on complex projects | Structured 10-phase workflow with specialist roles |
| Context loss across large codebases | Fresh 200K-token context per task |
| Ensuring code quality & test coverage | Built-in verification gates & auto-generated tests |
| Maintaining clean git history | One atomic commit per task, enforced by executor |
| Tracking project progress | `STATE.md` as single source of truth |

### Who is it for?

- **Individual developers** building MVPs rapidly
- **Startup teams** shipping product iterations
- **Enterprise teams** maintaining large codebases
- **Researchers/designers** exploring AI-assisted development

### Supported Runtimes

- Claude Code
- OpenCode
- Gemini CLI
- Codex CLI
- GitHub Copilot
- Qwen Code
- Kimi Code

---

## 2. Getting Started

### Install

```bash
npm install -g @howlil/ez-agents@5.0.6
```

### Configure for Your Runtime

```bash
# Claude Code (global)
ez-agents --claude --global

# OpenCode
ez-agents --opencode --global

# Gemini CLI
ez-agents --gemini --global

# Qwen Code
ez-agents --qwen --global

# See all options
ez-agents --help
```

Common flags:

| Flag | Purpose |
|---|---|
| `--global` | Install to user profile (affects all projects) |
| `--project` | Install only in the current project |
| `--claude` / `--qwen` / `--gemini` / `--codex` | Target a specific runtime |
| `--dry-run` | Preview changes without writing |

### First Project (Fast Path)

```bash
cd my-project

/ez:new-project          # Create requirements + roadmap
/ez:product-discovery    # Validate problem + prioritize features
/ez:run-phase 1          # Execute phase 1 end-to-end (≈35-55 min)
/ez:audit-milestone      # Verify requirements met
/ez:complete-milestone 1.0.0
```

### Update

```bash
ez-agents-update          # Preview + apply latest changelog
```

---

## 3. Core Concepts

### Roadmap → Phase → Plan → Task

```
ROADMAP.md           (product-level: phases in a milestone)
   └── Phase 01      (a single deliverable chunk)
        └── Plan     (detailed task breakdown for the phase)
             └── Task 1.1  →  1 git commit
             └── Task 1.2  →  1 git commit
             └── Task 1.3  →  1 git commit  (runs in parallel wave)
```

### Milestone lifecycle

```
new-project → product-discovery → run-phase (×N) → audit-milestone → complete-milestone → new-milestone
```

### Wave-Based Parallel Execution

Tasks inside a phase are grouped by dependency. Every task gets a **fresh 200K-token context window**. Independent tasks in the same wave run concurrently, each producing exactly **one git commit**.

### Single Source of Truth

All state is captured in four files under `.planning/`:

| File | Length cap | Purpose |
|---|---|---|
| `STATE.md` | 200 lines | Current progress, sprint metrics, health |
| `ROADMAP.md` | 300 lines | Phase structure and ordering |
| `REQUIREMENTS.md` | 500 lines | MoSCoW-prioritized features |
| `PROJECT.md` | 300 lines | Product overview, domain context |

Per-plan `SUMMARY.md` files (50 lines, YAML frontmatter) document what each phase built.

---

## 4. CLI Commands Reference

All commands are invoked with `/ez:<command>` in your AI runtime.

### Project lifecycle

| Command | Description | Typical duration |
|---|---|---|
| `/ez:new-project` | Initialize requirements + roadmap from a brief | 10–20 min |
| `/ez:product-discovery` | Validate problem, prioritize features (RICE), define metrics | 20–30 min |
| `/ez:new-milestone` | Start next version cycle, archive previous milestone | 5 min |

### Phase workflow (per phase)

| Command | Description | Duration |
|---|---|---|
| `/ez:run-phase [N]` | Run full discuss → plan → execute → verify pipeline | 35–55 min |
| `/ez:discuss-phase [N]` | Clarify implementation approach | 15 min |
| `/ez:plan-phase [N]` | Create task breakdown with verification criteria | 20 min |
| `/ez:execute-phase [N]` | Build in parallel waves, one commit per task | 30 min |
| `/ez:verify-work [N]` | Manual testing with auto-diagnosis | 10 min |

`--yolo` on `run-phase` disables pause points (fully autonomous).

### Milestone completion

| Command | Description |
|---|---|
| `/ez:audit-milestone` | Check every requirement is met |
| `/ez:complete-milestone <version>` | Create git tag + archive |

### Utilities

| Command | Description |
|---|---|
| `/ez:quick` | Run a small task without the full phase workflow |
| `/ez:map-codebase` | Analyze an existing codebase into structured docs |
| `/ez:progress` | Show status across roadmap, requirements, tasks |
| `/ez:resume-work` | Restore context after a stale session |
| `/ez:settings` | Configure workflow toggles + model profile |
| `/ez:update` | Update EZ Agents with changelog preview |
| `/ez:help` | Show all commands |
| `/ez:add-tests` | Generate tests for a completed phase |

### Smart Orchestration

Some commands auto-invoke helpers with an `[auto]` prefix in output:

| Trigger | Auto-invokes |
|---|---|
| `/ez:execute-phase` | `health-check`, `verify-work`, `discuss-phase` (if sensitive areas) |
| `/ez:plan-phase` | `discuss-phase` when touching auth, DB, payment, security |
| `/ez:release medium` | `verify-work` |
| `/ez:release enterprise` | `verify-work` → `audit-milestone` → `arch-review` |

Override with: `--no-auto`, `--verbose`, `--skip-discussion`.

---

## 5. Agents

EZ Agents ships **11 specialist agent definitions** under `agents/`. Each has a focused role and a curated toolset.

| Agent | Role |
|---|---|
| `ez-planner` | Decomposes phase intent into dependency-aware task graph with verification criteria |
| `ez-executor` | Implements tasks one-at-a-time with atomic git commits |
| `ez-verifier` | Goal-backward verification — tests the outcome, not the diff |
| `ez-debugger` | Scientific bug investigation (hypothesis → isolate → fix) |
| `ez-roadmapper` | Builds roadmaps, maps requirements to phases |
| `ez-phase-researcher` | Technical research on libraries, APIs, best practices |
| `ez-project-researcher` | Product discovery research — users, problems, competitors |
| `ez-codebase-mapper` | Produces structured maps of existing codebases |
| `ez-release-agent` | Version bumps, changelog generation, tagging |

Shared rules: `agents/PRINCIPLES.md` · Agent index: `agents/INDEX.md`.

---

## 6. Workflows

**40 workflow definitions** live in `ez-agents/workflows/`, including:

- `plan-phase`, `execute-phase`, `verify-work`
- `new-project`, `product-discovery`, `run-phase`
- `quick`, `map-codebase`, `resume-work`
- `hotfix`, `rollback`, `refactor-phase`
- `security-review`, `dependency-audit`, `accessibility-audit`
- `release`, `new-milestone`, `complete-milestone`, `audit-milestone`

Workflow templates live in `ez-agents/templates/` (34 templates). Index at `ez-agents/workflows/INDEX.md`.

---

## 7. Skills System

**229+ skills** organized by domain, loaded on-demand. Structure: `skills/{domain}/{framework}/SKILL.md`.

### Stack skills (59 frameworks)

- **Frontend:** React, Vue, Svelte, Angular, Next.js, Nuxt, Remix, Astro, Qwik, SolidJS
- **Backend:** Node.js, Express, NestJS, FastAPI, Django, Laravel, Spring Boot, Go, .NET
- **Mobile:** React Native, Flutter, Ionic
- **Database:** PostgreSQL, MongoDB, Redis
- **Other:** GraphQL, Tauri, Bun/Hono, AI/LLM integration, WebSockets, Real-time

### Domain skills

- **Testing:** Unit, Integration, E2E, Security, Performance, Contract
- **DevOps:** CI/CD, Containerization, Cloud Deployment, Monitoring
- **Architecture:** System Design, Microservices, Event-Driven, Serverless
- **Security:** OWASP, AuthN, AuthZ, Encryption
- **Observability:** Logging, Metrics, Tracing, Alerting
- **Operational:** Bug Triage, Code Review, Migration, Incident Response, Tech Debt

Each `SKILL.md` is a lightweight index (~130 lines) — agents pull deeper content only when needed.

---

## 8. Phase System

### Phase numbering

| Format | Meaning | Example |
|---|---|---|
| Integer | Planned phase | `01`, `02`, `03` |
| Decimal | Urgent inserted phase | `02.1`, `02.2` (marked `INSERTED`) |
| Letter suffix | Variant of a phase | `12A`, `12B` |

### The 4-step phase loop

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  discuss     │──▶│  plan        │──▶│  execute     │──▶│  verify      │
│  (15 min)    │   │  (20 min)    │   │  (30 min)    │   │  (10 min)    │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
```

Each step is an independent command — you can pause, inspect, retry, or run all four at once via `/ez:run-phase`.

---

## 9. Architecture

### Three-layer model

```
┌─────────────────────────────────────────────────┐
│  Workflow Layer    (40 workflows + 34 templates)│
├─────────────────────────────────────────────────┤
│  Agent Layer       (11 specialist agents)       │
├─────────────────────────────────────────────────┤
│  Library Layer     (98 TypeScript modules)      │
└─────────────────────────────────────────────────┘
```

### Repository layout

```
ez-agents/
├── bin/               CLI entry points (install, update, dependency-audit)
│   └── lib/           98 TS modules across 44 subsystems
├── agents/            11 agent definitions + PRINCIPLES.md
├── commands/          /ez:* slash commands
│   └── ez/            18 core commands
├── hooks/              Event hooks (build output under hooks/dist)
├── skills/            229+ skill definitions
├── ez-agents/
│   ├── workflows/     40 workflow scripts
│   ├── templates/     34 templates
│   ├── references/    Reference docs
│   └── VERSION
├── scripts/           Build, test, and maintenance scripts
├── docs/
│   ├── architecture/  4 files (CLASS-HIERARCHY, COMPONENTS, EVENTS, OVERVIEW)
│   ├── patterns/      6 ADRs (one per design pattern)
│   ├── migration/     TS migration guides
│   ├── CONTRIBUTING-TYPESCRIPT.md
│   └── DEPLOY.md
├── tests/             Vitest suites (unit, integration, e2e, property, perf, a11y)
├── .github/workflows/ 8 CI/CD pipelines
├── Dockerfile.agent
├── Dockerfile.staging
├── docker-compose.sandbox.yml
├── docker-compose.staging.yml
├── tsup.config.ts
├── tsconfig.json
├── vitest.config.ts
└── typedoc.json
```

### Library subsystems (`bin/lib/`)

44 subsystems, including: **adapters, analytics, business, cli, commands, config, context, cost, deploy, detector, executor, factories, file, finops, gates, git, learning, logger, metrics, model, orchestration, perf, phase, planning, prompt, quality, recovery, reporter, security, services, session, skill, state, strategies, utils, vault, workflow**.

### npm export surface

The package exports named subpackages:

- `.` (main)
- `./factories`, `./strategies`, `./adapters`, `./observer`, `./decorators`, `./facades`
- `./commands`, `./services`, `./repositories`, `./fp`

---

## 10. Design Patterns

Six patterns are implemented and documented as ADRs in `docs/patterns/`:

| ADR | Pattern | Used for |
|---|---|---|
| [ADR-001](patterns/ADR-001-factory-pattern.md) | Factory | Runtime-extensible agent creation |
| [ADR-002](patterns/ADR-002-strategy-pattern.md) | Strategy | Swappable context-compression algorithms |
| [ADR-003](patterns/ADR-003-observer-pattern.md) | Observer | Lifecycle events (task start/complete, wave boundary) |
| [ADR-004](patterns/ADR-004-adapter-pattern.md) | Adapter | Unified API across model providers |
| [ADR-005](patterns/ADR-005-decorator-pattern.md) | Decorator | Cross-cutting concerns (logging, caching, validation) |
| [ADR-006](patterns/ADR-006-facade-pattern.md) | Facade | Simplified entry points to complex subsystems |

See `docs/patterns/README.md` for the overall pattern catalog.

---

## 11. Configuration

Config lives in `.planning/config.json`.

### Model profiles

| Profile | Planner | Executor | When to use |
|---|---|---|---|
| `balanced` (default) | Opus | Sonnet | General-purpose |
| `quality` | Opus | Opus | High-stakes refactors / security work |
| `budget` | Sonnet | Sonnet | Hobby projects, low-cost exploration |

### Workflow toggles

```jsonc
{
  "workflow": {
    "research": true,
    "plan_check": true,
    "verifier": true,
    "nyquist_validation": true
  },
  "commit_docs": true,
  "parallelization": true,
  "smart_orchestration": true,
  "recovery": { "enabled": true, "auto_backup": true }
}
```

### Multi-provider credentials

Supports Anthropic, Alibaba Qwen, and custom override endpoints. Secrets never hit `.planning/` — they use the vault subsystem.

---

## 12. Runtime Guards

Six runtime safety checks run during execution:

| Guard | Protects against |
|---|---|
| **Autonomy Guard** | Unauthorized autonomous actions (e.g. `git push --force`) |
| **Context Budget Guard** | Degraded output — warns at 50% / 70% / 80% thresholds |
| **Hallucination Guard** | AI-fabricated functions, files, or APIs |
| **Hidden State Guard** | Context loss between phases |
| **Team Overhead Guard** | Coordination overhead from over-splitting work |
| **Tool Sprawl Guard** | New dependencies added without justification |

---

## 13. Build, Test & Release

### Stack

- **TypeScript** 5.4.5 · strict mode · ES2022 target · NodeNext module resolution
- **tsup** 8.0 for bundling (ESM only, target `node18`)
- **Vitest** 4.1 · 30 s timeout · **c8** coverage (target 70% lines)
- **ESLint** 8.57 (sonarjs + tsdoc + complexity plugins) · `--max-warnings=0`

### Runtime dependencies

| Package | Version | Role |
|---|---|---|
| `micromatch` | 4.0.5 | Glob-based file matching |
| `tiktoken` | 1.0.22 | Token counting for context budgeting |
| `zod` | 4.3.6 | Runtime schema validation |

### npm scripts (highlights)

| Script | Description |
|---|---|
| `build` / `build:watch` | `tsup` compile |
| `typecheck` / `typecheck:strict` | `tsc --noEmit` |
| `lint` / `lint:fix` | ESLint |
| `test` / `test:coverage` | Vitest (+ c8 with 70% threshold) |
| `test:a11y` | Accessibility tests |
| `test:qwen:code` | Qwen end-to-end battle tests |
| `docs:api` | TypeDoc API docs |
| `docs:generate` | JSDoc site |
| `check:duplicates` | jscpd duplicate detection |
| `check:complexity` | Complexity audit |
| `check:tsdoc` | TSDoc coverage |
| `check:coupling` | `madge --circular` |
| `check:abstractions` | `ts-prune` |
| `deps:audit` / `deps:audit:json` | Dependency audit |
| `gates:local` / `gates:status` / `gates:stats` | Local gate executor |
| `security:scan` | `npm audit --audit-level=moderate` |

### Test directory structure

```
tests/
├── unit/              Individual modules
├── integration/       Multi-module coordination
├── e2e/               Full workflow runs
├── critical-paths/    Core guarantees
├── property/          fast-check invariants
├── perf/              Benchmarks
├── a11y/              Accessibility
├── analytics/ finops/ gates/ state/ context/ core/ deploy/
└── fixtures/          Shared mocks
```

### Release status (at time of writing)

- **Latest:** v5.0.6 (2026-03-29) — ReDoS & regex fixes
- **System health:** 8.0/10
- **Tests:** 206/307 passing (67% → target 100%)
- **Type coverage:** 100%

---

## 14. Docker Support

| File | Purpose |
|---|---|
| `Dockerfile.agent` | Runtime container for an EZ agent |
| `Dockerfile.staging` | Staging test environment |
| `docker-compose.sandbox.yml` | Isolated sandbox for experiments |
| `docker-compose.staging.yml` | Full staging stack |

Common invocations:

```bash
npm run test:docker:all           # All staging containers
npm run test:docker:qwen:code     # Qwen code battle
npm run test:docker:qwen:edge     # Qwen edge cases
```

---

## 15. CI/CD Pipelines

Under `.github/workflows/`:

| Workflow | Trigger | Purpose |
|---|---|---|
| `ci.yml` | push/PR | Test matrix: Node 20/22/24 on Ubuntu/macOS/Windows |
| `test.yml` | push/PR | Full test suite |
| `quality-gates.yml` | push/PR | Gates (lint, duplicates, complexity, coupling) |
| `performance-regression.yml` | push/PR | Perf benchmarks |
| `codeql.yml` | schedule/PR | GitHub CodeQL static analysis |
| `secret-scanning.yml` | push | Secret leak detection |
| `cd-production.yml` | release | Publish to npm |
| `cd-staging.yml` | manual | Deploy staging |

---

## 16. Contributing & Governance

- **CONTRIBUTING.md** — contributor guide
- **docs/CONTRIBUTING-TYPESCRIPT.md** — TS/OOP/FP authoring rules
- **CHANGELOG.md** — release notes (Keep a Changelog format, built with `git-cliff`, config in `cliff.toml`)
- **STATE.md** — current project state
- **MIGRATION.md** — migration notes between majors
- **SUPPORT.md** — help channels
- **Husky** pre-commit hooks — lint-staged runs per-file checks on `*.ts` and `*.md`

---

## 17. Security

- `SECURITY.md` documents reporting & supported versions
- `npm run security:scan` runs `npm audit --audit-level=moderate`
- `codeql.yml` CI workflow for SAST
- `secret-scanning.yml` CI workflow for leaked secret detection
- `validate:token` script for token sanity checks
- Vault subsystem (`bin/lib/vault/`) for secret handling
- v5.0.6 fixed several ReDoS and regex-state vulnerabilities

---

## 18. FAQ

**Q: Do I need Claude to use EZ Agents?**
No — it works with OpenCode, Gemini CLI, Codex, Copilot, Qwen Code, and Kimi Code.

**Q: Can I use it in an existing codebase?**
Yes — run `/ez:map-codebase` first to produce structured maps, then proceed with phases.

**Q: What if a phase fails mid-execute?**
Use `/ez:resume-work` — state is persisted in `.planning/STATE.md` and checkpoints.

**Q: How is parallel execution safe?**
Tasks in the same wave are dependency-independent by construction. Each task commits atomically, so partial failures don't corrupt state.

**Q: Can I bypass the phase workflow for a tiny change?**
Yes — use `/ez:quick`.

**Q: How do I migrate between major versions?**
See `MIGRATION.md` for breaking changes and step-by-step migration guides.

---

## Appendix A — External Links

- **NPM:** https://www.npmjs.com/package/@howlil/ez-agents
- **GitHub:** https://github.com/howlil/ez-agents
- **Issues:** https://github.com/howlil/ez-agents/issues
- **API Docs:** https://howlil.github.io/ez-agents/api/
- **License:** MIT

## Appendix B — Cheatsheet

```bash
# Install + configure
npm i -g @howlil/ez-agents@5.0.6
ez-agents --claude --global

# New project, fast path
/ez:new-project
/ez:product-discovery
/ez:run-phase 1 --yolo
/ez:audit-milestone
/ez:complete-milestone 1.0.0

# Inspect / recover
/ez:progress
/ez:resume-work
/ez:settings
```
