#!/bin/bash
# SessionStart (cloud only): make every session motion-ready before the first prompt.
# Idempotent — re-runs are cheap no-ops once the container state is cached.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}"
PIN=$(node -p "require('./package.json').config.hyperframes")

# 1. npm deps — root (gsap + Inter, vendored into films) and the Remotion host.
#    npm install (not ci) so the cached container keeps node_modules between sessions.
npm install --no-audit --no-fund --loglevel=error
npm --prefix remotion install --no-audit --no-fund --loglevel=error

# 2. HyperFrames pinned Chrome — same pixels as render; the Seam Gate measures with it too.
npx --yes "hyperframes@${PIN}" browser ensure >/dev/null

# 3. Official HyperFrames skills (hyperframes, -core, -animation, -cli, -registry, …) →
#    ~/.claude/skills. tezpi-motion skills supersede their generic motion guidance.
npx --yes "hyperframes@${PIN}" skills update >/dev/null 2>&1 || echo "warn: hyperframes skills update failed — run: npx hyperframes@${PIN} skills update"

# 4. Report readiness (never fails the session; prints fixes instead).
node tools/doctor.mjs || true
