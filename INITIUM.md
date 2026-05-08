## Ghost Comments UI — Setup & Maintenance Guide

### Fork Overview

-   Repo: https://github.com/initium-web/Ghost
-   Upstream: https://github.com/TryGhost/Ghost
-   Working branch: `comments-mod`

Current state after the May 8, 2026 rebase:

-   Rebases cleanly onto current `upstream/main`
-   Our forked work is now 10 commits ahead of upstream
-   Local push back to origin requires `--force-with-lease` after the history rewrite

Our custom work includes:

-   UI styling changes
-   zh-Hant / zh translations
-   Badge-related comments UI behavior

### Why We Forked the Entire Ghost Monorepo

We previously tried extracting `apps/comments-ui` into a standalone repo. That approach was not practical because:

1. Internal dependency: `@tryghost/i18n`

-   Lives inside `ghost/i18n/`
-   Is not published independently for external consumption

2. Workspace-coupled packages

-   Ghost now uses `pnpm` workspaces in the monorepo
-   Internal packages resolve cleanly only inside the full repo

Conclusion:

Maintaining a full fork is simpler than re-publishing and maintaining internal packages ourselves.

### Local Development

Prerequisites

-   macOS or Linux
-   git
-   Node version from `.nvmrc`
-   `pnpm` via Corepack

Setup

```bash
git clone git@github.com:initium-web/Ghost.git ~/Documents/Projects/Ghost
cd ~/Documents/Projects/Ghost

git remote add upstream https://github.com/TryGhost/Ghost.git
git checkout comments-mod

corepack enable pnpm
pnpm install
```

Important:

-   Do not use `yarn install`
-   Upstream now enforces `pnpm` via `.github/scripts/enforce-package-manager.js`

Source to edit

```bash
apps/comments-ui/src/
```

### Build

Build only Comments UI:

```bash
pnpm --dir apps/comments-ui build
```

Install dependencies after upstream syncs before rebuilding:

```bash
pnpm install
pnpm --dir apps/comments-ui build
```

## Key Task: Sync with Upstream

Main sync flow:

```bash
cd ~/Documents/Projects/Ghost
git checkout comments-mod
git fetch upstream
git rebase upstream/main
```

If you have local working-tree changes, stash them first:

```bash
git stash push --include-untracked -m "temp before upstream rebase"
```

After the rebase:

```bash
git stash pop
pnpm install
pnpm --dir apps/comments-ui build
```

Because the branch history is rewritten during rebase, update origin with:

```bash
git push --force-with-lease origin comments-mod
```

### What to Expect During Rebase

-   Conflicts will likely happen in `apps/comments-ui/src/`
-   Translation conflicts may appear in:
    -   `ghost/i18n/locales/zh-Hant/comments.json`
    -   `ghost/i18n/locales/zh/comments.json`
-   Prefer keeping current upstream logic, then reapply our custom UI and translation behavior on top
-   Watch for case-only path drift on macOS, especially around files such as `content.tsx`

### QA Checklist

Verify locally after each sync:

-   `pnpm install` completes successfully
-   `pnpm --dir apps/comments-ui build` passes
-   Comments UI renders correctly
-   Comment posting and replying still work
-   zh-Hant / zh translations are correct
-   Badge-related behavior still appears as expected
-   No browser console errors

### Maintenance

-   Sync every 1–2 months
-   Avoid long gaps between rebases
-   Re-run dependency install after upstream changes because package manager and lockfile state may have changed
