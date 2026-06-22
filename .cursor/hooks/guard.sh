#!/usr/bin/env bash
# beforeShellExecution hook: guardrail for agent-run terminal commands.
#
# Policy:
#   deny  → clearly destructive commands with no legitimate use here
#   ask   → network / publishing / history-affecting commands (reversible,
#           but a human should glance at them first)
#   allow → everything else
#
# Registered with "failClosed": true, so a crash/timeout/invalid output blocks
# the command. The one exception is a missing `jq`: we degrade to allow so a
# broken toolchain can never brick the terminal.

set -uo pipefail

input=$(cat)

# Without jq we cannot reliably parse the command — degrade to allow.
command -v jq >/dev/null 2>&1 || { echo '{ "permission": "allow" }'; exit 0; }

command=$(printf '%s' "$input" | jq -r '.command // empty' 2>/dev/null)

# No command string to judge → allow.
[ -z "$command" ] && { echo '{ "permission": "allow" }'; exit 0; }

# ---------------------------------------------------------------------------
# Deny: clearly destructive
# ---------------------------------------------------------------------------

# Recursive force-delete (rm -rf / -fr / -r -f) aimed at a critical target
# (/, /*, ~, $HOME, current dir ".", parent "..").
if [[ "$command" =~ rm[[:space:]]+-[a-zA-Z]*[rR][a-zA-Z]*[fF] \
   || "$command" =~ rm[[:space:]]+-[a-zA-Z]*[fF][a-zA-Z]*[rR] \
   || "$command" =~ rm[[:space:]]+-[rRfF][[:space:]]+-[rRfF] ]]; then
  if [[ "$command" =~ ([[:space:]]/([[:space:]]|$)|[[:space:]]/\*|(^|[[:space:]])~([[:space:]]|/|$)|\$HOME|[[:space:]]\.\.?([[:space:]]|$)) ]]; then
    echo '{ "permission": "deny", "user_message": "Blocked a recursive force-delete of a critical path.", "agent_message": "A safety hook blocked this destructive rm. Do not retry; target a specific, explicit subdirectory instead." }'
    exit 0
  fi
fi

# Fork bomb.
if [[ "$command" =~ :\(\)\{ ]]; then
  echo '{ "permission": "deny", "user_message": "Blocked a fork bomb.", "agent_message": "A safety hook blocked this command. Do not retry." }'
  exit 0
fi

# Writing directly to a disk device (mkfs, dd of=/dev/..., > /dev/sdX).
if [[ "$command" =~ (^|[[:space:]])mkfs \
   || "$command" =~ (^|[[:space:]])dd[[:space:]].*of=/dev/ \
   || "$command" =~ \>[[:space:]]*/dev/(sd|nvme|disk) ]]; then
  echo '{ "permission": "deny", "user_message": "Blocked a command that writes directly to a disk device.", "agent_message": "A safety hook blocked this command. Do not retry." }'
  exit 0
fi

# Recursive permission/ownership change on root.
if [[ "$command" =~ (chmod|chown)[[:space:]]+-[a-zA-Z]*R[a-zA-Z]*[[:space:]].*[[:space:]]/([[:space:]]|$) ]]; then
  echo '{ "permission": "deny", "user_message": "Blocked a recursive permission change on /.", "agent_message": "A safety hook blocked this command. Do not retry." }'
  exit 0
fi

# Force push.
if [[ "$command" =~ git[[:space:]]+push.*(--force([[:space:]]|=|$)|-f([[:space:]]|$)|--force-with-lease) ]]; then
  echo '{ "permission": "deny", "user_message": "Blocked a force-push.", "agent_message": "A safety hook blocked git push --force. If history must be rewritten, ask the human to do it manually." }'
  exit 0
fi

# ---------------------------------------------------------------------------
# Ask: side-effecting / network — reversible but worth a human glance
# ---------------------------------------------------------------------------

# Outbound network.
if [[ "$command" =~ (^|[[:space:]])(curl|wget|nc|ncat|telnet)([[:space:]]|$) ]]; then
  echo '{ "permission": "ask", "user_message": "This command makes a network request. Review it before continuing." }'
  exit 0
fi

# Publishing a package.
if [[ "$command" =~ (npm|yarn|pnpm)[[:space:]]+publish ]]; then
  echo '{ "permission": "ask", "user_message": "This command publishes a package. Confirm before continuing." }'
  exit 0
fi

# GitHub CLI — can create/modify remote resources (PRs, issues, releases).
if [[ "$command" =~ (^|[[:space:]])gh[[:space:]] ]]; then
  echo '{ "permission": "ask", "user_message": "This runs the GitHub CLI, which can change remote resources. Review before continuing." }'
  exit 0
fi

# Push or history-affecting git.
if [[ "$command" =~ git[[:space:]]+push \
   || "$command" =~ git[[:space:]]+reset[[:space:]]+--hard \
   || "$command" =~ git[[:space:]]+clean[[:space:]]+-[a-zA-Z]*f ]]; then
  echo '{ "permission": "ask", "user_message": "This git command affects local or shared history. Review before continuing." }'
  exit 0
fi

# ---------------------------------------------------------------------------
# Default: allow
# ---------------------------------------------------------------------------
echo '{ "permission": "allow" }'
exit 0
