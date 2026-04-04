---
name: server-claude-code-setup
description: Configure Claude Code on Linux servers with HTTP proxy, fix startup issues. Use when deploying or troubleshooting Claude Code on remote servers.
---

# Server Claude Code Setup

## CRITICAL — PROXY MANDATORY, DIRECT CONNECTION FORBIDDEN

Direct connection from China IP → account ban. **Every server MUST have proxy configured.**

```json
// ~/.claude/settings.json — standard template
{
  "env": {
    "HTTP_PROXY": "http://<proxy-host>:<port>",
    "HTTPS_PROXY": "http://<proxy-host>:<port>",
    "NO_PROXY": "localhost,127.0.0.1",
    "no_proxy": "localhost,127.0.0.1"
  }
}
```

## Before You Start

Ask user for: **1) proxy address** (required), **2) target servers**, **3) scenario** (fresh install / fix existing / cleanup).

Test proxy: `curl -s -o /dev/null -w "%{http_code}" -x <proxy> https://api.anthropic.com/v1/messages` → 404 = OK, 000 = need SSH tunnel.

## Quick Diagnostic

```bash
which node && node --version                    # must >= 18
conda list nodejs 2>/dev/null | grep node       # must be empty
which -a claude && claude --version             # check for duplicates
claude auth status 2>&1
curl -s -o /dev/null -w "%{http_code} %{time_total}s" -x "${HTTP_PROXY:-none}" https://api.anthropic.com/v1/messages
env | grep -iE 'ANTHROPIC|CLAUDE_TOKEN|CLAUDE_API|SSS_API|CODEX' || echo "clean"
```

## Problem → Fix

### P1: `SyntaxError: Unexpected token` — conda Node.js conflict

conda's node v12 shadows system node. Fix: `conda remove -y nodejs && hash -r`. Never install Node via conda.

### P2: Input text disappears — plugin hook broken

`claude-mem` plugin's bun worker not running. Fix: disable it in settings.json:
```json
{ "enabledPlugins": { "claude-mem@thedotmack": false } }
```

### P3: Startup takes 1-2 minutes — NO_PROXY missing

Claude CLI health-checks `localhost:37777` on startup. Without `NO_PROXY`, these requests route through the remote proxy → proxy can't reach server's localhost → retry loop ~100s.

Confirm: `strace -e trace=connect,sendto -f -tt timeout 30 claude -p 'hello' 2>&1 | grep "127.0.0.1:37777"`

Fix: add `"NO_PROXY": "localhost,127.0.0.1"` and `"no_proxy": "localhost,127.0.0.1"` to settings.json env.

### P4: Multiple claude binaries — wrong version

`which -a claude` shows multiple paths (bun, npm-global, system). Login shell may pick the wrong one.

Fix: remove all except one: `rm ~/.bun/bin/claude ~/.npm-global/bin/claude` etc. Keep only `/usr/bin/claude` or the npm global install.

### P5: API key / base_url pollution

Stale env vars block OAuth login. Remove `ANTHROPIC_API_KEY`, `ANTHROPIC_BASE_URL`, `CLAUDE_TOKEN`, `CLAUDE_API_URL`, `SSS_API_KEY` from `.bashrc`, `fish/config.fish`, `settings.json`.

Verify: `env | grep -iE 'ANTHROPIC|CLAUDE_TOKEN|SSS_API' && echo "POLLUTED" || echo "CLEAN"`

### P6: Model not available

Bad `model` field in settings.json. Fix: remove or correct it. Or downgrade: `curl -fL https://claude.ai/install.sh | bash -s <version>`.

### P7: Server can't reach proxy — SSH reverse tunnel

```
Server:28888 → SSH tunnel → Mac:18888 → SSH forward → VPS:8888 → Anthropic API
```

Mac SSH config: `RemoteForward 28888 127.0.0.1:18888`
Mac local forward: `ssh -N -L 18888:<vps-ip>:8888 <vps-host> &`
Server settings.json: `"HTTP_PROXY": "http://127.0.0.1:28888"`

## Acceptance Checklist

- [ ] `node --version` >= 18, not from conda
- [ ] `which -a claude` shows single path
- [ ] `claude --version` >= 2.1.92
- [ ] `claude auth status` shows valid session
- [ ] Proxy works: curl returns HTTP 404
- [ ] `env | grep -iE 'ANTHROPIC|CLAUDE_TOKEN'` returns empty
- [ ] settings.json has `HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY`
- [ ] `claude -p "hello"` responds in < 30s
