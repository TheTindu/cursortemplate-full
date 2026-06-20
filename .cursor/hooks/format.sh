#!/usr/bin/env bash
# afterFileEdit hook: auto-format and lint-fix edited JS/TS files with Biome.
# Fails open — never blocks an edit, even if Biome or the file path is missing.

set -uo pipefail

input=$(cat)

# Extract the edited file path. Try the common field names; fall back to empty.
file=$(printf '%s' "$input" | jq -r '.file_path // .filePath // .path // empty' 2>/dev/null)

[ -z "$file" ] && exit 0
[ ! -f "$file" ] && exit 0

case "$file" in
  *.ts | *.tsx | *.js | *.jsx | *.mjs | *.cjs | *.json | *.jsonc)
    npx --no-install biome check --write "$file" >/dev/null 2>&1 || true
    ;;
esac

exit 0
