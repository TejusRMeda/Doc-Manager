#!/bin/bash
# Start the local dev server.
#
#   ./dev.sh [port]        default port 3000
#
# Why this exists: `vercel dev` injects the linked project's *cloud* Development
# environment variables into the function runtime and does NOT read .env.local.
# Vars that only exist locally (e.g. ANALYTICS_SECRET, which is Production-only
# in the cloud) must be exported into the process instead. This script does that.
#
# Note: package.json intentionally has no "dev" script — `vercel dev` would
# invoke it and recurse into itself.

set -euo pipefail
cd "$(dirname "$0")"

PORT="${1:-3000}"

if [ -f .env.local ]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
  echo "loaded .env.local"
else
  echo "warning: .env.local not found — local-only vars will be unset" >&2
fi

exec vercel dev --listen "$PORT" --yes
