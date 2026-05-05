# Course Coverage Checklist (ITA Spring 2026)

This checklist is generated from the session `README.md` files and the exercise documents in this repository. It’s intended as a “what we covered” overview and as an exam-readiness checklist you can reuse in your group project.

Notes:
- Items are phrased as outcomes/skills/tasks that were covered in teaching material.
- Some items are “optional” in the repo text; they are still included (marked as optional in the label).
- One referenced exercise file appears to be missing from this repo: `24._deployment_strategies/service_level_agreement.md`.

---

## Course Meta (root + 00._course_material)

- [ ] Understand “semester repository” vs “the project” (legacy cookbook)
- [ ] Read/skim DevOps Handbook (Part 1 early; continued later)
- [ ] Understand workload expectations (heavy early; automation reduces later load)
- [ ] Practice group responsibility + individual repo activity expectations
- [ ] Use the assignment template structure (type/deadline/motivation/exam-report)
- [ ] Maintain a “Choices & Challenges” document for decisions + reflections
- [ ] Contribute back via PRs to improve course material

---

## 01._introduction — Introduction (legacy project + tools)

Learning goals / in-class topics:
- [ ] Understand semester overview + exam format expectations
- [ ] Use `SSH` + `SCP` to access external machines
- [ ] Understand the “Awsome Recipe Cookbook” legacy codebase
- [ ] Work with OpenAPI via Postman + Swagger Editor
- [ ] Form exam groups
- [ ] Use AI CLI tooling (Claude Code / similar) appropriately

After class / exercises:
- [ ] Set up group GitHub organization
- [ ] Identify critical problems in the legacy codebase (analyze; don’t fix yet)
- [ ] Upgrade the legacy application to Python 3
- [ ] Create a dependency graph for the legacy system
- [ ] Create PR adding your group info to `groups.py`
- [x] Create tags/releases for your project

---

## 02._decide_framework_convert_code — Decide framework + convert code

Learning goals / in-class topics:
- [x] Choose language + framework for the exam project
- [ ] Use Swagger Editor + Postman to work with OpenAPI documents
- [ ] Apply “Principle of Flow”: make work visible, limit WIP, reduce batch size
- [ ] Set up a GitHub Project Kanban board
- [x] Add OpenAPI documentation into your own codebase (framework tooling)
- [ ] Understand monolith vs mono-repo vs multi-repo
- [ ] Understand “conventions” in DevOps/software development

After class / exercises:
- [x] Decide on a framework (document rationale; reflect later)
- [x] Commence rewrite/migration from legacy project
- [x] Generate OpenAPI specification in your new codebase
- [ ] Set up and use Kanban GitHub Project

---

## 03._linux — Linux crash course

Learning goals / in-class topics:
- [ ] Install Linux via Docker (webtop)
- [ ] Work effectively via Linux terminal
- [ ] Understand Linux filesystem + common shell commands
- [ ] Use a package manager in Linux
- [ ] Use terminal editor (nano)
- [ ] Execute applications locally (e.g., run Python)
- [ ] Apply flow principle + “show your work”

In-class terminal task list:
- [ ] Create folders/files; copy/move/delete as instructed (Documents/DevOps folder workflow)

After class / exercises:
- [ ] Complete Unix command exercises (files, copy/move/delete, piping tools)
- [ ] Run your cookbook app locally in the Linux environment (no Docker-in-Docker)
- [ ] Make a code change using nano; push to GitHub
- [ ] From Linux terminal: add `"linux": True` to your group entry; commit/push
- [ ] From terminal: open a PR to this semester repo (hint: `gh`)

---

## 04._linux_win_mac — Cross-platform shell + package managers

Learning goals / in-class topics:
- [ ] Use a package manager on your OS (apt/brew/Chocolatey)
- [ ] Understand environment variables: what/why/how to set
- [ ] Navigate the shell using basic commands + understand permissions
- [ ] Use pipes and output redirection
- [ ] Write + execute a basic bash script
- [ ] “Show your work” routines: merge to master, handle issues/insights

After class / readiness checklist:
- [ ] Group GitHub org set up
- [x] Project repo exists with your chosen framework
- [ ] `groups.py` up to date (repo URL, members, stack)
- [x] OpenAPI REST documentation in your codebase
- [ ] Work merged into master when “stable enough”
- [x] Tags + releases created
- [x] Dockerfile + docker-compose present
- [x] README includes run instructions
- [ ] GitHub Project + Kanban board set up and used
- [ ] Review Issues tab for feedback

---

## 05._git_branching_strategies — Git branching strategies

Learning goals / in-class topics:
- [ ] Explain common branching strategies (Git Flow, GitHub Flow, Trunk-based)
- [ ] Argue for a strategy based on team size, release cadence, CI/CD needs
- [ ] Create/merge branches + resolve conflicts using git CLI
- [ ] Apply DevOps principle: reduce WIP and reduce batch size (merge frequently)

After class / exercises:
- [ ] Research branching strategies (resources + merge vs rebase)
- [x] Choose a branching strategy and document it for the exam report (living doc)
- [ ] Practice branching in a sandbox repo (create branch, push, PR, approvals)
- [ ] (Optional) Create + resolve a merge conflict intentionally

---

## 06._CI_github_actions — GitHub Actions (CI)

Learning goals / in-class topics:
- [ ] Understand YAML syntax
- [ ] Understand Actions terms: workflows/runners/jobs/steps/actions
- [ ] Create workflows triggered by push + pull request + issue creation
- [x] Use GitHub secrets in workflows
- [x] Create PR templates
- [ ] Create issue templates

After class / exercises:
- [ ] (Optional) Practice YAML using provided exercise
- [x] Create `.github/PULL_REQUEST_TEMPLATE.md`
- [ ] Create `.github/ISSUE_TEMPLATE.md` (simple template)
- [x] Define GitHub secrets (UI + `gh secret set`) and use them in workflow
- [ ] Configure branch protection rules (PR required, approvals, status checks)

---

## 07._Azure_vm_portal_az — Azure Cloud (VM + SSH + manual deployment)

Learning goals / in-class topics:
- [ ] Understand basic cloud concepts
- [ ] Create an Azure VM; open ports; set IP to static
- [ ] Understand public vs private SSH keys
- [ ] Compare pull-based vs push-based deployment
- [ ] Discuss deployment strategies and pros/cons (intro level)

After class / exercises:
- [ ] Deploy provided cookbook image from GHCR manually on a VM (individual)
- [ ] Manually deploy your own app via `ssh`/`scp` (group)
- [ ] Create PR updating `groups.py` endpoints + stack + docs URL after deploy
- [ ] (Optional) Review EK Azure resources and region availability guidance

---

## 09._Continous_delivery — Continuous Delivery / Continuous Deployment

Learning goals / in-class topics:
- [ ] Explain CD vs Continuous Deployment
- [x] Write/understand a GitHub Actions workflow file
- [ ] Run applications in production (e.g., Gunicorn/PM2 concepts)
- [x] Build and deploy a containerized application via CI/CD

Tutorial track:
- [ ] Understand prod Dockerfile/compose differences and how to run locally
- [ ] Generate CR_PAT (fine-grained PAT with correct permissions)
- [ ] (Optional) Publish images via CLI (docker login/build/push) for debugging
- [x] Understand the workflow that builds/pushes images from compose (buildx bake)
- [x] Handle environment variables safely (don’t bake `.env`; deploy via secrets)

Exercises:
- [ ] Investigate a real repo’s workflow files and explain each step
- [ ] Create your group workflow:
  - [ ] Triggered by PR to master and/or manual workflow dispatch
  - [x] Uses environment variables
  - [x] Builds Docker image(s) and pushes to ghcr.io
  - [x] Deploys to Azure VM (SCP files + SSH remote commands)

---

## 10._groupwork — Groupwork day (no lecture)

- [ ] Use the day to get your group CI/CD flow in place end-to-end
- [ ] Use Kanban actively for missing elements
- [ ] Prepare a demo-style presentation (no slides)
- [ ] Submit PR updating `groups.py` values

---

## 11._presentation_of_project — Presentation

- [ ] Present without slides (show running system + repo structure)
- [ ] Demonstrate working CI/CD pipeline (incl. earlier topics)
- [ ] Ensure each group member has an “ownership area”

---

## 12._CI_code_quality_linting_static_code_analysis — Quality, linting, static analysis

Learning goals / in-class topics:
- [ ] Relate software quality to non-functional requirements
- [ ] Understand technical debt + common causes
- [ ] Explain linting and why it belongs in CI
- [ ] Add a linter and run it in GitHub Actions
- [ ] Use PRs/code reviews to maintain quality

After class / exercises:
- [ ] Branch protection rules as quality gates
- [ ] Add linting (choose tools per language; optional SuperLinter)
- [ ] (Optional) Add workflow status badges to README
- [ ] Add software quality tooling (e.g., SonarCloud/CodeClimate/DeepSource/CodeRabbit)
- [ ] Write reflections: agree/fix/ignore and why

---

## 13._CI-Code_Quality-Git_Hooks_Linting_Testing — Git hooks, pre-commit, testing

Learning goals / in-class topics:
- [ ] Explain Git Hooks (pros/cons)
- [ ] Set up pre-commit linting hook
- [ ] Use `pre-commit` framework to share hooks across team
- [ ] Configure pre-commit to run tests before commit (where applicable)
- [ ] (Optional) JS alternative: Husky + lint-staged

After class / exercises:
- [ ] Implement git hooks in your cookbook project
- [ ] Agree as a group on what rules to enforce
- [ ] Start unit testing; run tests before commits

---

## 19._how_devops_are_you — DevOps self-assessment

- [ ] Evaluate your project using DevOps Handbook concepts
- [ ] Use rubric matrix as a checklist
- [ ] Document arguments for why you were DevOps
- [ ] Document what prevented “fully DevOps” and why

---

## 20._nginx_proxy_load_balancer — Nginx reverse proxy / load balancing

- [ ] Understand common load balancing strategies
- [ ] Understand nginx.conf structure and elements
- [x] Set up nginx configuration (reverse proxy)
- [x] Run multiple servers / services behind proxy
- [ ] Refresh docker-compose skills
- [x] Implement a proxy in your own cookbook project

---

## 21._iac — Infrastructure as Code

- [ ] Explain IaC and why it beats manual cloud management
- [ ] Compare ClickOps vs CLI vs SDK vs IaC (pros/cons)
- [ ] Understand reproducibility/recoverability/idempotency/version control for infra
- [x] Provision + teardown Azure infrastructure using scripts
- [x] Implement IaC in your own project (infrastructure folder + scripts + secrets)

---

## 22._iac_II — IaC II (team capability + feature workflow)

- [x] Ensure infra scripts are in master and runnable by everyone
- [x] Use infrastructure checklist (prereqs, repo setup, single VM, 2-VM, teardown)
- [ ] Practice “Continual Learning & Experimentation” (whole group can run infra)
- [ ] Follow structured “new feature” workflow: Kanban -> feature branch -> PR -> review -> merge
- [ ] (Optional) Add CodeRabbit and use it in PR review process

---

## 23._monitor_logging — Monitoring & logging (Prometheus + Grafana)

- [ ] Distinguish monitoring vs logging
- [ ] Set up Prometheus scraping
- [ ] Visualize metrics in Grafana dashboards
- [ ] Apply DevOps principle of feedback (make system behavior visible)
- [ ] Apply setup to own project, including multi-VM Azure scenario
- [ ] Exercise: pick meaningful metrics per layer and implement at least one
- [ ] Export Grafana dashboard JSON and commit it
- [ ] (Optional) Add alert thresholds

---

## 24._deployment_strategies — Deployment strategies, orchestration, maintenance

- [ ] Understand mutable vs immutable infrastructure
- [ ] Understand blue-green/canary/rolling updates
- [ ] Understand fault tolerance/redundancy/scalability
- [ ] Understand orchestration and why it matters
- [ ] Understand load balancing configuration in production context
- [ ] Understand maintenance and designing for maintainability

After class / exercises:
- [ ] Consider and agree on a deployment strategy for your project (discussion-based)
- [ ] Definition of Done for exam delivery
- [ ] (Optional) Take down and recreate your system to prove recoverability
- [ ] SLA exercise is referenced in the session README, but the file is missing in this repo

---

## 25._semester_round_up — Semester round-up / exam readiness

- [ ] Review monitoring dashboards + deployment strategy (expected at exam)
- [ ] Use semester overview as an exam hand-in checklist
- [ ] Reflect on what is done vs missing
- [ ] Create a project checklist for your own cookbook repo and fill it out
- [ ] Read/align with exam project requirements document
