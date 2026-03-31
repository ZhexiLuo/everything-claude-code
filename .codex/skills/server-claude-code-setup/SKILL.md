---
name: server-claude-code-setup
description: Configure Claude Code on Linux servers with HTTP proxy routing, fix common issues like input disappearing, Node.js conflicts, API key pollution, and model errors. Use when deploying or troubleshooting Claude Code on remote servers.
---

# Server Claude Code Setup

## CRITICAL RULE — PROXY IS MANDATORY

**All Claude Code traffic MUST go through the HTTP proxy. Direct connections to claude.ai from servers are STRICTLY FORBIDDEN.**

Connecting without proxy causes **serious irreversible consequences** — account flagging, access revocation, and permanent restrictions that cannot be undone.

```
# MANDATORY in ~/.claude/settings.json on every server
{
  "env": {
    "HTTP_PROXY": "http://<proxy-host>:<port>",
    "HTTPS_PROXY": "http://<proxy-host>:<port>"
  }
}
```

## Before You Start — Ask the User

**You MUST collect this information before doing anything else.** Present the following prompt to the user and wait for answers:

```
Before configuring Claude Code on your server, I need the following information:

1. 🌐 Proxy address (REQUIRED)
   Your HTTP proxy for Claude Code traffic (e.g., http://1.2.3.4:8888)
   Without this I cannot proceed — direct connections are forbidden.

2. 🖥️ Target servers
   Which servers to configure? (e.g., ssh hostnames: rl-1, rl-2, rbs_4090)

3. 🔧 Scenario — pick one:
   A) Fresh install — new server, Claude Code not yet installed
   B) Fix existing — Claude Code installed but broken (describe symptoms)
   C) Cleanup only — remove stale API keys / third-party base_url pollution

4. 🔗 Can your servers reach the proxy directly?
   Run: curl -s -o /dev/null -w "%{http_code}" -x <your-proxy> https://api.anthropic.com/v1/messages
   - If returns 404 → direct proxy works (Option A)
   - If returns 000 or timeout → need SSH reverse tunnel (Option B)
```

**Do NOT proceed until the user provides at least items 1 and 2.**
If the user cannot provide a proxy, **STOP** — explain the risk and refuse to continue.

## When To Use

- Deploying Claude Code on a new remote server
- Claude Code not responding / input text disappearing
- `SyntaxError: Unexpected token` on startup
- `UserPromptSubmit operation blocked by hook`
- `There's an issue with the selected model`
- API key / base_url pollution blocking OAuth login
- Server cannot reach proxy directly

## Quick Diagnostic Script

Run this first to identify which problems exist:

```bash
echo "=== Node.js ==="
which node && node --version
conda list nodejs 2>/dev/null | grep node

echo "=== Claude Code ==="
which claude && claude --version

echo "=== Auth ==="
claude auth status 2>&1 || echo "auth check failed"

echo "=== Proxy ==="
curl -s -o /dev/null -w "HTTP %{http_code} in %{time_total}s" -x "${HTTP_PROXY:-none}" https://api.anthropic.com/v1/messages 2>&1

echo "=== Env Pollution ==="
env | grep -iE 'ANTHROPIC|CLAUDE_TOKEN|CLAUDE_API|SSS_API|CODEX_TOKEN|CODEX_API' || echo "clean"

echo "=== Bun / Worker ==="
which bun 2>/dev/null; ss -tlnp 2>/dev/null | grep 2424 || echo "no worker"
```

## Problem 1: conda Node.js Overrides System Node

**Symptom**: `SyntaxError: Unexpected token {` when starting `claude`

**Root cause**: conda base has nodejs v12 which shadows system nodejs v20+

**Fix**:

```bash
conda remove -y nodejs
hash -r
node --version   # must be >= 18
```

**Rule**: Never install Node.js via conda. Use system package manager or nvm.

## Problem 2: Plugin Hook Blocks Input (Text Disappears)

**Symptom**: Type text in Claude Code, text vanishes, no response

**Root cause**: `claude-mem` plugin's bun worker is not running or `bun` is not in PATH

**Fix A** — add bun to PATH in settings.json:

```json
{
  "env": {
    "PATH": "/home/<user>/.bun/bin:/usr/local/bin:/usr/bin:/bin"
  }
}
```

Then restart the worker with `at`:

```bash
echo "cd ~/.claude/plugins/... && bun run worker" | at now
```

**Fix B** (recommended) — disable the plugin:

```json
{
  "enabledPlugins": {
    "claude-mem@thedotmack": false
  }
}
```

## Problem 3: Proxy Routing

### Option A — Server Can Reach Proxy Directly

Test connectivity first:

```bash
curl -s -o /dev/null -w "%{http_code}" -x http://<proxy>:<port> https://api.anthropic.com/v1/messages
```

If returns `404` (not `000`), direct proxy works. Set in `~/.claude/settings.json`:

```json
{
  "env": {
    "HTTP_PROXY": "http://<proxy>:<port>",
    "HTTPS_PROXY": "http://<proxy>:<port>"
  }
}
```

### Option B — Server Cannot Reach Proxy (SSH Reverse Tunnel)

When the server has no route to the proxy VPS, build a tunnel chain:

```
Server:28888 → SSH reverse tunnel → Mac:18888 → SSH forward → VPS:8888 → Anthropic API
```

**Step 1**: Mac SSH config — add forwarding to the server entry:

```
Host <server>
    RemoteForward 28888 127.0.0.1:18888
```

**Step 2**: Mac local forward to VPS:

```bash
ssh -N -L 18888:<vps-ip>:8888 <vps-host> &
```

**Step 3**: Server settings.json:

```json
{
  "env": {
    "HTTP_PROXY": "http://127.0.0.1:28888",
    "HTTPS_PROXY": "http://127.0.0.1:28888"
  }
}
```

**Step 4**: One-liner alias (add to local shell rc):

```bash
alias ssh-server='ssh -N -L 18888:<vps-ip>:8888 <vps-host> & sleep 1 && ssh <server>; kill %1'
```

Note: tunnel is active only while SSH session is open — no persistent daemon needed.

## Problem 4: API Key Environment Variable Pollution

**Symptom**: Claude uses stale third-party API key or base_url, blocks OAuth login

**Cleanup checklist** — remove ALL of these from ALL locations:

| Variable | Locations to check |
|----------|-------------------|
| `ANTHROPIC_API_KEY` | `.bashrc`, `fish/config.fish`, `settings.json` |
| `ANTHROPIC_BASE_URL` | `.bashrc`, `fish/config.fish`, `settings.json` |
| `CLAUDE_TOKEN` | `.bashrc`, `fish/config.fish` |
| `CLAUDE_API_URL` | `.bashrc`, `fish/config.fish` |
| `SSS_API_KEY` | `.bashrc`, `fish/config.fish` |
| `CODEX_TOKEN` | `.codex/config.toml` |
| `CODEX_API_URL` | `.codex/config.toml` |

**After cleanup, MUST verify**:

```bash
source ~/.bashrc
env | grep -iE 'ANTHROPIC|CLAUDE_TOKEN|CLAUDE_API|SSS_API|CODEX_TOKEN' && echo "STILL POLLUTED" || echo "CLEAN"
```

Only hand off to user when output is `CLEAN`.

## Problem 5: Model Not Available Error

**Symptom**: `There's an issue with the selected model (claude-opus-4-6[1m])`

**Fix A** — check if `~/.claude/settings.json` has a `model` field with invalid value, remove or correct it

**Fix B** — downgrade Claude Code:

```bash
curl -fL https://claude.ai/install.sh | bash -s <known-good-version>
```

## Batch Deployment

For multiple servers, use parallel SSH:

```bash
# test connectivity first
for host in server1 server2 server3; do
    ssh -o ConnectTimeout=5 $host "echo OK" 2>/dev/null && echo "$host: reachable" || echo "$host: FAILED"
done

# deploy in parallel
for host in server1 server2 server3; do
    ssh $host 'bash -s' < setup-script.sh &
done
wait
```

## Acceptance Checklist

All must pass before handoff:

- [ ] `node --version` >= 18
- [ ] `claude --version` outputs normally
- [ ] `claude auth status` shows valid OAuth session
- [ ] Proxy reachable: `curl -x $HTTP_PROXY https://api.anthropic.com` returns HTTP 404 (not 000)
- [ ] No stale env vars: `env | grep -iE 'ANTHROPIC|CLAUDE_TOKEN'` returns empty
- [ ] Input text does not disappear — Claude responds normally
- [ ] `~/.claude/settings.json` contains `HTTP_PROXY` and `HTTPS_PROXY`

## Common Mistakes

- Connecting to claude.ai without proxy — **FORBIDDEN, causes irreversible consequences**
- Installing Node.js via conda — shadows system node, breaks Claude Code
- Leaving stale API keys in shell rc files after switching to OAuth
- Running `npm run worker:restart` in home directory instead of plugin directory
- Retrying GitHub downloads on servers with poor connectivity instead of using local `rsync`
- Forgetting to verify env var cleanup before declaring task complete
