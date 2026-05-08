## Ghost Comments UI — Setup & Maintenance Guide

### Fork Overview

-   Repo: https://github.com/initium-web/Ghost
-   Upstream: https://github.com/TryGhost/Ghost
-   Working branch: comments-mod

Current state:

-   13 commits ahead (our custom comments UI changes)
-   1,752 commits behind upstream main (base: 2025-10-23)

Our 13 commits include:

-   UI styling
-   Translations (zh-Hant / zh-Hans)
-   Badge system

### Why We Forked the Entire Ghost Monorepo

We previously tried extracting apps/comments-ui into a standalone repo — it failed due to:

1. Internal dependency (@tryghost/i18n)

-   Lives inside ghost/i18n/
-   Not published to npm
-   Cannot be installed outside the monorepo

2. yarn workspace dependencies

-   Uses "workspace:\*" and "catalog:"
-   Only resolves inside Ghost’s monorepo

Conclusion:

Maintaining a full fork is simpler than re-publishing and maintaining internal packages.

3. Local Development

Prerequisites

-   macOS or Linux
-   git
-   yarn (run corepack enable if needed)
-   Node version from .nvmrc

Setup

```
git clone git@github.com:initium-web/Ghost.git ~/Documents/Projects/Ghost
cd ~/Documents/Projects/Ghost

git remote add upstream https://github.com/TryGhost/Ghost.git
git checkout comments-mod

yarn install
```

Source to edit

```
apps/comments-ui/src/
```

4. Build

```
cd apps/comments-ui
yarn build
```

## Key Task: Sync with Upstream

We are currently ~6 months behind upstream. The main task is to rebase our branch onto the latest main.

### Sync Process

```
cd ~/Documents/Projects/Ghost
git fetch upstream
git checkout comments-mod
git rebase upstream/main
```

### What to Expect

-   There will be merge conflicts during rebase
-   Focus on keeping upstream logic intact
-   Reapply our custom UI, translations, and badge changes on top

### QA Checklist

Verify in local Ghost:

-   Comments functionality works (post + reply)
-   UI displays correctly
-   Translations (zh-Hant / zh-Hans) are correct
-   No console errors

### Maintenance

-   Sync every 1–2 months
-   Avoid long gaps — rebasing becomes much harder
