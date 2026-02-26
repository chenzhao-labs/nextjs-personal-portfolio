# Contributing Guidelines

Thank you for your interest in contributing to this project!

## Git Workflow

### Linear History (Required)

This repository enforces **linear commit history** to maintain a clean and readable git log.

- ❌ Merge commits are **not allowed**
- ✅ Use **Squash and merge** when merging PRs
- ✅ Use `git rebase` to sync with the main branch

### Local Development Workflow

```bash
# 1. Create a feature branch from latest main
git checkout main
git pull --rebase origin main
git checkout -b feature/your-feature

# 2. Make your changes and commit
git add .
git commit -m "feat: add new feature"

# 3. Before pushing, sync with latest main
git fetch origin
git rebase origin/main

# 4. Push your branch (force push if rebased)
git push -f origin feature/your-feature

# 5. Create a Pull Request on GitHub
```

### Branch Auto-deletion

After a PR is merged, the source branch will be **automatically deleted**. No manual cleanup needed.

To prune deleted remote branches locally:

```bash
git fetch --prune
```

## Code Style

- Follow existing code patterns and conventions
- Run linting before committing: `pnpm lint`
- Ensure TypeScript types are correct: `pnpm type-check`

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Pull Request Process

1. Ensure your code passes all checks
2. Update documentation if needed
3. Fill out the PR template
4. Wait for review and address feedback
5. Once approved, the PR will be squash-merged
