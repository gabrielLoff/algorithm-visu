# GitHub Flow with squash merge and Conventional Commits

**Status:** accepted

We adopted **GitHub Flow** as our branching strategy: feature branches off `main`, pull requests for review, squash-merge into a single commit.

## Decision

| Rule | Choice |
|---|---|
| Branching model | GitHub Flow (no `develop` branch) |
| Branch naming | `issue/<number>-<slug>` (e.g. `issue/3-clean-up-grid-model`) |
| Merge strategy | Squash merge — one commit per PR on `main` |
| Commit format | [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, etc.) |
| PR approval | Author can merge their own PR |
| `main` protection | Requires a PR; direct pushes are rejected |

## Context

The project started as a solo effort with all commits pushed directly to `main`. As collaborators may join, we needed a lightweight workflow that enforces review and keeps history clean without the ceremony of GitFlow.

## Considered alternatives

- **GitFlow** (`main` + `develop` + `release` branches): rejected because the project has no versioned releases or hotfix cycles. The extra branches would add overhead without benefit.
- **Trunk-based development**: rejected because it requires heavy CI infrastructure (fast test suites, automatic rollback) that doesn't fit a small frontend project.
- **Merge commits**: rejected because they preserve per-commit noise on `main`. The server-side commit history benefits from squash — each PR intent maps to one commit, and the original branch commits are disposable.

## Consequences

- All new work starts with `git checkout -b issue/<number>-<slug>` from `main`.
- Agents must typecheck (`npm run build`) and test (`npm test`) before pushing a branch.
- PR titles become the squash commit message and must follow Conventional Commits.
- `main` branch protection must be enabled on GitHub manually.
