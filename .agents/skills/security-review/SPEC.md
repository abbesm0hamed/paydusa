# Security Review Specification

## Intent

The `security-review` skill finds exploitable security vulnerabilities in application code and reports only high-confidence findings. Its main job is to turn a file, diff, or component into a short list of issues where a vulnerable pattern is confirmed to receive attacker-controlled input, each with a location, impact, evidence, and fix.

The skill is deliberately conservative. It asks the agent to research the whole codebase (data flow, configuration, framework protections, upstream validation) before flagging anything, and to drop theoretical or best-practice findings rather than pad the report. A short, accurate report is the success condition; a long list of pattern-matched suspects is a failure.

## Scope

In scope:

- Reviewing a specific file, diff, pull request, or component the user names, with codebase-wide research to confirm or dismiss each candidate finding.
- OWASP-style vulnerability classes: injection, XSS, authentication, authorization, cryptography, deserialization, file handling, SSRF, CSRF, data protection, API design, business logic, misconfiguration, error handling, supply chain, logging, and modern threats (prototype pollution, DOM clobbering, WebSocket security, LLM prompt injection).
- Python (Django, Flask, FastAPI) and JavaScript/TypeScript (Node, Express, React, Vue, Next.js) framework-specific guidance.
- Dockerfile review.
- Severity classification and confidence-tagged reporting in the fixed output format in `SKILL.md`.

Out of scope:

- GitHub Actions workflow exploitation; that belongs to the `gha-security-review` skill.
- In-depth Django access-control review of permission classes and endpoint scopes; `SKILL.md` routes that to the `django-access-review` skill when it is available and falls back to `references/authorization.md` when it is not.
- Kubernetes, Terraform, and cloud IAM configuration review. No bundled guides exist; do not reference them from `SKILL.md` until they are written.
- Dedicated Go, Rust, Java, or other language guides. The agent falls back to the language-agnostic `references/` files.
- Reporting low-confidence, defense-in-depth, or style-level findings.
- Running scanners, fuzzers, or dynamic testing tools.

## Users And Trigger Context

- Primary users: engineers and coding agents asked to look for security problems in application code.
- Common user requests: "security review this", "find vulnerabilities", "check for security issues", "audit security", "OWASP review", "is this injectable / XSS-able / SSRF-able".
- Should not trigger for: general code review, performance review, GitHub Actions workflow review, Django permission audits, or requests to write exploits against systems the user does not own.

## Runtime Contract

- Required first actions: identify the exact scope being reported on, detect the code type and language, and load only the matching `references/`, `languages/`, and `infrastructure/` files from the routing tables in `SKILL.md`.
- Required research: for each candidate finding, trace where the input comes from, check for upstream validation or sanitization, and check framework and configuration protections before deciding confidence.
- Required outputs: the `## Security Review:` report format from `SKILL.md`, with `[VULN-nnn]` entries for HIGH-confidence findings and `[VERIFY-nnn]` entries for MEDIUM-confidence ones, or the sentence "No high-confidence vulnerabilities identified."
- Non-negotiable constraints: report only on the user-provided scope; never flag server-controlled values (settings, environment variables, config files, constants) as attacker-controlled; never report LOW-confidence findings; never flag test files, dead code, or framework-auto-escaped output without the specific unsafe pattern.
- Expected bundled files loaded at runtime: `SKILL.md` always; a subset of `references/*.md`, `languages/*.md`, and `infrastructure/*.md` chosen by the routing tables.

## Source And Evidence Model

Authoritative sources:

- OWASP Cheat Sheet Series (CC BY-SA 4.0), from which the `references/` material is derived; see `LICENSE`.
- OWASP Top 10 and OWASP API Security Top 10 for category and severity framing.
- Framework security documentation for Django, Flask, FastAPI, Express, React, Vue, and Next.js.

Useful improvement sources:

- positive examples: reviews that trace input to its source and either confirm exploitability or correctly dismiss a pattern because of configuration or framework mitigation.
- negative examples: false positives on `settings.*` or environment-derived URLs, on ORM-parameterized queries, on auto-escaped template output, on MD5 used for checksums, and on test fixtures.
- negative examples: missed findings where a vulnerable pattern was present but the agent did not load the relevant reference file.
- commit logs/changelogs: upstream OWASP cheat sheet revisions that change recommended mitigations.
- issue or PR feedback: reviewer pushback on noisy or theoretical findings.
- validation results: `quick_validate.py` output and manual checks that every bundled file is reachable from a routing table.

Data that must not be stored:

- secrets or credentials observed during a review
- customer data or PII from the reviewed codebase
- private repository URLs or identifiers not needed to reproduce an example

## Reference Architecture

- `SKILL.md` contains the scope rules, confidence model, do-not-flag lists, routing tables, review process, severity table, quick pattern reference, and output format.
- `references/` contains one file per vulnerability class with vulnerable and safe code pairs, detection grep patterns, and a testing checklist.
- `languages/` contains per-ecosystem framework guidance (`python.md`, `javascript.md`).
- `infrastructure/` contains infrastructure configuration guidance (`docker.md` only).
- `LICENSE` records the OWASP attribution and CC BY-SA 4.0 terms for the derived material.
- `references/evidence/`, `scripts/`, and `assets/` contain no files currently.

Every file under `references/`, `languages/`, and `infrastructure/` must appear in at least one routing table in `SKILL.md` (Detect Context, Load Language Guide, or Load Infrastructure Guide) and in the Reference Files index. Do not list a file in `SKILL.md` that does not exist in the skill directory.

## Validation

- Lightweight validation: run `uv run skills/skill-writer/scripts/quick_validate.py skills/security-review` from the repository root; then confirm by hand that the set of files on disk under `references/`, `languages/`, and `infrastructure/` matches the set referenced in `SKILL.md` in both directions.
- Deeper validation: run the skill against a small fixture set containing one confirmed SQL injection, one confirmed stored XSS, one SSRF false positive sourced from settings, one ORM-parameterized query, and one auto-escaped template; check that only the two true positives are reported as findings.
- Holdout examples: a JavaScript object-merge endpoint that should route to `modern-threats.md`, a Dockerfile running as root, and a Go or Rust file that should still be reviewed using the generic references without the agent attempting to load a nonexistent language guide.
- Acceptance gates: report uses the fixed output format; every finding has a confirmed attacker-controlled input and a concrete fix; no finding cites a server-controlled value as the input; no LOW-confidence items appear; the agent loaded at least one reference file matching the code type.

## Known Limitations

- Language coverage beyond Python and JavaScript relies on language-agnostic references, so framework-specific mitigations in Go, Rust, Java, PHP, and Ruby may be missed or over-flagged.
- Infrastructure coverage is limited to Dockerfiles. Kubernetes, Terraform, and cloud IAM review will produce generic results until dedicated guides exist.
- Confidence depends on the agent actually tracing data flow; on very large codebases the research step can be incomplete and findings may land in "Needs Verification" more often.
- The reference material is a derivative of the OWASP cheat sheets at a point in time and does not track upstream revisions automatically.

## Maintenance Notes

- Update `SKILL.md` when a reference, language, or infrastructure file is added or removed, so the routing tables and Reference Files index stay in lockstep with the directory contents.
- Update `SPEC.md` when the scope, confidence policy, output contract, or set of covered languages and infrastructure types changes.
- When adding a new `languages/` or `infrastructure/` guide, add both a routing row and an index entry in the same change; when removing one, remove both.
- Keep the OWASP attribution comment after the frontmatter in `SKILL.md` and keep `LICENSE` in the skill root when derived material is edited or extended.
- Keep public inventories pointed at the canonical `skills/security-review` skill, not the `.agents/skills` mirror.
