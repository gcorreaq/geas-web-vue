#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# Install gh CLI from GitHub releases if not already installed.
# Uses direct download instead of the apt repo (cli.github.com) because
# cli.github.com is not in the default allowlisted domains, while
# github.com and objects.githubusercontent.com are.
if ! command -v gh &> /dev/null; then
  GH_VERSION=$(curl -fsSL https://api.github.com/repos/cli/cli/releases/latest | grep -o '"tag_name": "v[^"]*"' | head -1 | sed 's/"tag_name": "v//;s/"//')
  curl -fsSL "https://github.com/cli/cli/releases/download/v${GH_VERSION}/gh_${GH_VERSION}_linux_amd64.deb" -o /tmp/gh.deb
  dpkg -i /tmp/gh.deb
  rm /tmp/gh.deb
fi

# Install npm dependencies
cd "$CLAUDE_PROJECT_DIR"
npm install
