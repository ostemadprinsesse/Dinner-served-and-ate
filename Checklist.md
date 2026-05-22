# IT Architecture, Agile Development & Cloud — Project Checklist
<!-- Awesome Recipe Cookbook Semester Project -->
<!--
  HOW TO USE THIS FILE WITH AN AI IN VS CODE:
  Paste this file into your AI chat (e.g. GitHub Copilot, Claude, Cursor) and ask:
  "Go through every item in this checklist and help me verify whether it has been completed
  based on my repository and project files."
  Or ask it to check specific sections, e.g.:
  "Check all items under PHASE 3 — CI/CD and tell me what is missing."
-->

---

## OVERVIEW

This checklist covers all required deliverables, group tasks, individual tasks, and exam requirements
extracted from the semester cookbook. Items are organised by phase/week. Mandatory exam items are
marked **[MANDATORY]**.

**Legend**
- `[ ]` Not started
- `[~]` In progress
- `[x]` Done
- `[OPT]` Optional — not required for exam but recommended

---

## PHASE 1 — Setup & Legacy Code Analysis

### GitHub Organisation (Group)
- [ ] Created a GitHub organisation for the group
- [ ] Added all members as collaborators with admin rights
- [ ] Created the main code repository/repositories (NOT forks)
- [ ] Made the main code repositories **public**
- [ ] Chose and applied an appropriate **software license** to each repository
- [ ] Named the project (you are not required to use "AwesomeCookbook" branding)

### groups.py Pull Request (Group) **[MANDATORY]**
- [ ] Forked or cloned the semester repository
- [ ] Added your group entry to `groups.py` with correct keys:
  - [ ] `name` — group name
  - [ ] `gitLinks` — link(s) to your repositories
  - [ ] `members` — all group members
  - [ ] `backend` — URL filled in (update as you progress)
  - [ ] `frontend` — URL filled in (update as you progress)
  - [ ] `monitoring` — URL filled in (update as you progress)
  - [ ] `stack` — tech stack listed
  - [ ] `documentation` — documentation links added
- [ ] Validated `groups.py` syntax with `python -m py_compile groups.py`
- [ ] Pulled latest changes from upstream before making the PR
- [ ] PR successfully merged
- [ ] **Keep `groups.py` up to date throughout the course**

### Legacy Code Analysis (Group) **[MANDATORY — Part of Mandatory I]**
- [ ] Studied the "Awesome Recipe Cookbook" legacy Flask codebase
- [ ] Created a prioritised document listing **all problems** in the legacy code (most critical first)
- [ ] Confirmed: problems only identified, NOT solved yet

### Python 2 → 3 Upgrade (Group)
- [ ] Upgraded the server code from Python 2.7 to Python 3.x.x
- [ ] All group members aware of what changed
- [ ] Confirmed: legacy bugs from the problem list were NOT fixed during upgrade — only version migration

### Dependency Graph / Digraph (Group) **[MANDATORY — Part of Mandatory I]**
- [ ] Created a dependency graph (Digraph) for the entire legacy system
- [ ] Graph covers all components (not just Python dependencies)
- [ ] Saved as SVG or image file
- [ ] Stored somewhere accessible to the entire group

---

## PHASE 2 — Framework Decision & Rewrite

### Framework Choice (Group) **[MANDATORY — Part of Mandatory II]**
- [ ] Group agreed on a **programming language and micro-web framework**
  - Excluded: Flask, any Kotlin-based framework, heavy full frameworks (Django, Spring MVC, etc.)
  - Suggested options: Go/Gorilla, Ruby/Sinatra, Rust/Rocket, Python/FastAPI, Node.js, Svelte, Vue
- [ ] Decided on **server-side rendering** vs **client-side rendering**
- [ ] Documented the decision for the exam report:
  - [ ] What framework was chosen and why
  - [ ] What frameworks were rejected and why
  - [ ] Pros and cons experienced during the course (update this throughout the semester)

### Application Rewrite (Group)
- [ ] Backend server implementation started in the chosen framework
- [ ] Using SQLite database (until database topic is covered)
- [ ] Legacy code kept in the repository alongside new code (gradual strangler fig approach)
- [ ] OpenAPI specification adhered to exactly (the provided `api-schema.yaml`)
- [ ] Additional routes added as needed (beyond the spec)
- [ ] Code follows the agreed naming conventions (see Conventions section below)
- [ ] Frontend implemented (server-side or client-side, per decision above)

### Conventions (Group)
- [ ] Group agreed on coding conventions (documented verbally or in writing):
  - Python: snake_case variables/functions
  - JS: camelCase variables/functions, PascalCase classes/components
  - CSS: kebab-case classes
  - Environment variables: UPPER_SNAKE_CASE
  - Database tables: plural, snake_case
- [ ] `.gitignore` created for the project (use gitignore.io)
- [ ] Global `.gitignore` set up on each developer's machine (for IDE/OS-specific files)
- [ ] Meaningful commit messages adopted by the team

### OpenAPI Specification (Group)
- [ ] Provided `api-schema.yaml` reviewed in Swagger Editor
- [ ] Imported and tested in Postman
- [ ] Own OpenAPI specification **generated from your framework's code**
- [ ] Spec accessible (embedded in app or linked in README)

### Kanban Board / Project Tracker (Group)
- [ ] GitHub Project (or Trello/similar) created for the group
- [ ] Kanban board set up with columns (e.g. Backlog, In Progress, Done)
- [ ] Tasks/issues added for the rewrite
- [ ] Board kept up to date throughout the course

### Work Log (Individual — Ongoing Course Requirement) **[MANDATORY]**
- [ ] Personal work log / notebook started (text file, Notion, etc.)
- [ ] Records: dates, what was done, what went wrong, solutions found + links
- [ ] Updated continuously until end of semester

---

## PHASE 3 — Shell, Package Managers & Environment Variables

### Shell Skills (Individual)
- [ ] Able to use basic shell commands: `ls -l`, `chmod`, `grep`, `cat`, `echo`
- [ ] Able to use pipes (`|`) and output redirection (`>`, `>>`)
- [ ] Able to write and execute a basic bash script
- [ ] Understand and set environment variables (temporarily and permanently)

### Package Manager (Individual)
- [ ] Package manager installed on your machine:
  - Linux: `apt`
  - macOS: `brew`
  - Windows: `chocolatey`

### End-of-Week Checklist (Group) ← from document
- [ ] Group GitHub organisation exists
- [ ] Cookbook repository exists with your framework code
- [ ] `groups.py` up to date (repo URL, group members, stack)
- [ ] OpenAPI REST API documentation added to framework code
- [ ] Latest code merged into the **main/master branch**
- [ ] **Tags and releases** created on GitHub
- [ ] `Dockerfile` and `docker-compose.yml` added to repository
- [ ] README file has a simple description of how to run the application
- [ ] GitHub Project / Kanban board is set up
- [ ] Issues tab checked (instructor may leave feedback there)

---

## PHASE 4 — Git Branching Strategies

### Research (Individual)
- [ ] Read about Git Flow, GitHub Flow, and Trunk-Based Development
- [ ] Understand merging vs. rebasing
- [ ] Able to explain pros and cons of each strategy

### Branching Strategy (Group) **[MANDATORY — Part of Exam Report]**
- [ ] Group agreed on a branching strategy
- [ ] Strategy is actually being used in the repository
- [ ] Documented for the exam report:
  - [ ] What strategy was chosen and how it is enforced
  - [ ] Why this strategy was chosen over others
  - [ ] Advantages and disadvantages encountered during the course
- [ ] Document updated whenever the strategy changes

### Branching Practice (Individual)
- [ ] Able to create, switch, push, and delete branches via CLI
- [ ] Able to create a pull request on GitHub
- [ ] [OPT] Practiced creating and resolving a merge conflict

---

## PHASE 5 — GitHub Actions & CI

### CI Setup (Group)
- [ ] GitHub CLI (`gh`) installed and authenticated
- [ ] At least one GitHub Actions workflow created in `.github/workflows/`
- [ ] Workflow triggers on `push` and `pull_request` to main
- [ ] Workflow runs successfully (green checks on GitHub)
- [ ] GitHub Secrets defined for any sensitive values (tokens, keys)
- [ ] Secrets used in workflows (never logged in plain text)

### PR & Issue Templates (Group)
- [ ] Pull Request template created at `.github/PULL_REQUEST_TEMPLATE.md`
- [ ] Issue template created at `.github/ISSUE_TEMPLATE.md`
- [ ] Templates tested (create a PR and an issue to verify)

### Branch Protection Rules (Group)
- [ ] Branch protection rule created for `main`:
  - [ ] Require pull request before merging
  - [ ] Require at least 1–2 approvals
  - [ ] [OPT] Require status checks (CI) to pass before merging
- [ ] Rules documented and understood by all team members

---

## PHASE 6 — Linting & Code Quality

### Linting (Group)
- [ ] Linter chosen and configured for your language/framework
- [ ] Linter runs in CI (GitHub Actions workflow)
- [ ] [OPT] Git pre-commit hook set up to run linter locally before commits
- [ ] [OPT] `pre-commit` library configured (`.pre-commit-config.yaml`)

### Code Quality Tool (Group)
- [ ] At least one code quality / static analysis tool integrated:
  - Options: SonarQube, Code Climate, CodeRabbit, DeepSource
- [ ] Tool configured on the repository
- [ ] Issues identified by the tool are reviewed and addressed

### [OPT] GitHub Actions Badge (Group)
- [ ] Workflow status badge added to `README.md`

---

## PHASE 7 — Containerisation & CD (Azure)

### Docker (Group)
- [ ] `Dockerfile` created for the application
- [ ] `docker-compose.yml` (or `compose.yaml`) created
- [ ] Application runs locally with `docker compose up`
- [ ] Docker image published to GitHub Container Registry (GHCR)
  - [ ] CR_PAT (Container Registry Personal Access Token) created
  - [ ] PAT stored as a GitHub Secret
  - [ ] CI/CD workflow pushes image to GHCR on merge to main

### Azure VM Deployment (Group) **[MANDATORY]**
- [ ] Azure for Students account set up
- [ ] Available Azure regions identified for your account
- [ ] SSH key pair generated locally
- [ ] Azure VM created (Ubuntu, Standard_B1s or similar)
  - [ ] Port 22 (SSH) open
  - [ ] Application port (80 / 443 / your port) open
  - [ ] Static IP address configured
- [ ] Application deployed and running on the VM
- [ ] Application accessible from the internet (URL in `groups.py`)
- [ ] [OPT] AZ CLI installed and configured locally
- [ ] Deployment automated via CI/CD pipeline (push to main → deploy to VM)

### CD Pipeline (Group)
- [ ] GitHub Actions workflow deploys to Azure VM on push to main
- [ ] Deployment uses SSH (private key stored as GitHub Secret)
- [ ] Deployment pulls new Docker image from GHCR and restarts container

---

## PHASE 8 — Nginx Reverse Proxy

### Nginx Setup (Group)
- [ ] Nginx running as a reverse proxy in a Docker container
- [ ] `nginx.conf` configured to proxy traffic to the backend
- [ ] Frontend served through Nginx (or separate frontend service behind proxy)
- [ ] HTTP (port 80) traffic handled; [OPT] HTTPS (port 443) configured
- [ ] Nginx added to `docker-compose.yml`
- [ ] Application accessible through Nginx proxy URL

---

## PHASE 9 — Infrastructure as Code (IaC)

### IaC Scripts (Group) **[MANDATORY]**
- [ ] **Provision script** created (sets up Azure VM, opens ports, installs dependencies, deploys app)
- [ ] **Teardown script** created (deletes VM and resource group cleanly)
- [ ] Scripts are **idempotent** (safe to run multiple times)
- [ ] Scripts stored in version control
- [ ] All group members have tested running the scripts themselves

### Two-VM Setup (Group)
- [ ] [OPT] Separate VM for Nginx (reverse proxy) and backend
- [ ] [OPT] Networking between VMs configured correctly

---

## PHASE 10 — Monitoring & Logging

### Monitoring Setup (Group) **[MANDATORY]**
- [ ] **Prometheus** configured and collecting metrics from the application
- [ ] **Grafana** set up and connected to Prometheus as data source
- [ ] At least one Grafana dashboard created with meaningful metrics
- [ ] Monitoring URL added to `groups.py`
- [ ] Metrics exposed from your application (e.g. `/metrics` endpoint)

### Logging
- [ ] Application logs accessible (via Docker logs, file, or log aggregation)
- [ ] [OPT] Structured logging implemented in the application

### What to Measure (Group) — Exercise
- [ ] Group discussed and agreed on the most important metrics to monitor
- [ ] Metrics cover: availability, latency, error rate, resource usage

---

## PHASE 11 — Deployment Strategy

### Strategy Decision (Group)
- [ ] Group agreed on a deployment strategy:
  - Options: Blue-Green, Canary, Rolling Update, Ramped, etc.
- [ ] Deployment strategy documented in exam report
- [ ] Strategy implemented or clearly described

### Definition of Done (Group)
- [ ] Group has defined "Definition of Done" for tasks/user stories
- [ ] Definition applied consistently during development

---

## EXAM REQUIREMENTS SUMMARY

The following are confirmed exam requirements. Ensure each has a corresponding artefact.

### DevOps Theory
- [ ] Can explain what DevOps is and the Three Ways (Flow, Feedback, Continual Learning)
- [ ] Can reflect on how DevOps principles were applied in your project

### Technology — Tech Stack
- [ ] Chosen stack is documented and justified
- [ ] All group members can explain the stack choices

### Technology — Organisation
- [ ] Git branching strategy documented and reflected upon
- [ ] Kanban board used throughout the project (GitHub Projects or similar)
- [ ] PR templates and issue templates in use

### Technology — Software Quality
- [ ] Linting integrated (CI or pre-commit hooks)
- [ ] Code quality tool integrated (SonarQube, CodeRabbit, etc.)
- [ ] OpenAPI specification generated from your own code

### Technology — Automation
- [ ] CI pipeline: builds and lints on every PR/push
- [ ] CD pipeline: deploys automatically on merge to main
- [ ] IaC scripts: provision and teardown are scripted and version-controlled

### Technology — Monitoring
- [ ] Prometheus + Grafana running and publicly accessible
- [ ] Meaningful dashboards exist
- [ ] URL is in `groups.py`

### Technology — Deployment & Production
- [ ] Application is deployed and running in production (Azure VM)
- [ ] Application is accessible via public URL
- [ ] Deployment strategy chosen and documented
- [ ] Zero-downtime deployment considered (blue-green, rolling, etc.)

### Other Requirements
- [ ] Exam report written (see exam report requirements document)
- [ ] All mandatory assignments completed
- [ ] Work log maintained throughout the semester (individual)
- [ ] groups.py kept up to date with final URLs and stack

---

## OPTIONAL / BONUS ITEMS

- [ ] [OPT] `Makefile` created with useful commands (start, stop, deploy, lint, test)
- [ ] [OPT] HTTPS/TLS configured on Nginx (Let's Encrypt)
- [ ] [OPT] Separate production and staging environments
- [ ] [OPT] Database migrated from SQLite to a production database
- [ ] [OPT] Automated tests added and run in CI
- [ ] [OPT] CodeRabbit AI code review integrated on PRs
- [ ] [OPT] GitHub Actions workflow status badge in README
- [ ] [OPT] Shields.io badges in README
- [ ] [OPT] `node_exporter` set up on Azure VM for system-level metrics
- [ ] [OPT] Two-VM infrastructure (Nginx VM + backend VM) with IaC scripts

---

## QUICK SELF-CHECK QUESTIONS (for exam prep)

Use these to test yourself and your group before the exam:

1. What problems did you find in the legacy codebase? Which were most critical?
2. Why did you choose your framework? What did you consider and reject?
3. What branching strategy do you use and how do you enforce it?
4. Walk through your CI/CD pipeline from a push to production.
5. How would you rebuild your infrastructure from scratch using your IaC scripts?
6. What does your Grafana dashboard show and why did you choose those metrics?
7. What deployment strategy do you use and what are the tradeoffs?
8. What was your "Definition of Done"?
9. What went wrong during the semester and how did you address it? (From your work log)
10. How did you apply the Three Ways of DevOps in practice?

---

*Last updated: based on Cookbook_raw.docx — update this file as new material is added.*