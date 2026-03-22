---
name: server-env-setup
description: Use when setting up a new Linux server for Python/ML development with conda, uv, fish, claude code CLI, and China mirror sources. Triggers on new server setup, environment configuration, dev toolchain bootstrap.
---

# Server Environment Setup

## Overview

Bootstrap a fresh Linux server for Python/ML development: conda + uv + fish + claude code + China mirrors. Hardware-agnostic, works on any Ubuntu/Debian server with SSH access.

## When to Use

- Setting up a new dev server or cloud instance
- Migrating development environment to a new machine
- Onboarding a server for ML/robotics research

## Prerequisites

- SSH access to target server (`ssh <alias>`)

## ⚠️ Before Starting

### Step 0: User Account Setup (if SSH config uses root)

If the target server's SSH config has `User root`, create a `zhexi` user first:

1. SSH to server as root and create user with sudo privileges:
   ```bash
   useradd -m -s /bin/bash zhexi && echo 'zhexi:zhexi' | chpasswd && usermod -aG sudo zhexi
   ```
2. Deploy local SSH public key to the new user:
   ```bash
   # Run from local machine (as root on remote)
   ssh <server> "mkdir -p /home/zhexi/.ssh && cat >> /home/zhexi/.ssh/authorized_keys && chmod 700 /home/zhexi/.ssh && chmod 600 /home/zhexi/.ssh/authorized_keys && chown -R zhexi:zhexi /home/zhexi/.ssh" < ~/.ssh/id_rsa.pub
   ```
3. Update local `~/.ssh/config` to use `User zhexi` instead of `User root`
4. Verify: `ssh <server> whoami` should output `zhexi`

> ⚠️ **NFS shared home**: If multiple servers share the same NFS home directory, ensure `zhexi` has the same UID/GID across all servers. Mismatched UIDs cause SSH pubkey auth failures. Fix with `usermod -u <uid> zhexi` or edit `/etc/passwd` directly.

### Step 1: Run sudo commands (user must do this manually)

Claude Code cannot input sudo password via SSH. Give the user this one-liner to run on the target server:

```bash
sudo apt-get update && sudo apt-get install -y fish
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs
```

This installs fish shell and Node.js 22 (required for claude code CLI).

### Step 2: Provide Anthropic API keys

Ask the user for API keys and base URL. Multiple keys enable load balancing (random rotation per session):

```
Keys:    sk-xxx-key1, sk-xxx-key2, sk-xxx-key3, ...
BaseURL: https://your-api-endpoint.com/api
```

The more keys provided, the better the rate limit distribution.

## Quick Reference

| Tool | Install Method | Config Location |
|------|---------------|-----------------|
| conda | miniconda installer | `~/.condarc` |
| uv | `curl astral.sh/uv/install.sh` | `~/.config/uv/uv.toml` |
| fish | sudo apt install (see Before Starting) | `~/.config/fish/config.fish` |
| claude code | `npm install -g @anthropic-ai/claude-code` | env vars in shell rc |
| pip mirror | config file | `~/.config/pip/pip.conf` |
| HuggingFace mirror | env var | `HF_ENDPOINT` in shell rc |
| nvitop | `pip install nvitop` | — |

## Step-by-Step

### 1. Install Core Tools

```bash
# 🐍 Miniconda (skip if already installed)
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O /tmp/miniconda.sh
bash /tmp/miniconda.sh -b -p $HOME/miniconda3
~/miniconda3/bin/conda init bash

# 🦀 uv (Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# 🤖 Claude Code CLI (needs Node.js 18+, installed in Before Starting)
# If npm global install fails due to permissions:
mkdir -p ~/.npm-global && npm config set prefix ~/.npm-global
npm install -g @anthropic-ai/claude-code

# 📊 nvitop (GPU monitor)
pip install nvitop
```

### 2. Configure China Mirrors

```bash
# 📦 pip - aliyun + tsinghua
mkdir -p ~/.config/pip
cat > ~/.config/pip/pip.conf << 'EOF'
[global]
index-url = https://mirrors.aliyun.com/pypi/simple/
extra-index-url = https://pypi.tuna.tsinghua.edu.cn/simple/
trusted-host = mirrors.aliyun.com
    pypi.tuna.tsinghua.edu.cn
EOF

# 🐍 conda - tsinghua
cat > ~/.condarc << 'EOF'
channels:
  - defaults
show_channel_urls: true
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
  pytorch: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
EOF

# 🦀 uv - aliyun
mkdir -p ~/.config/uv
cat > ~/.config/uv/uv.toml << 'EOF'
[[index]]
url = "https://mirrors.aliyun.com/pypi/simple/"
default = true
EOF
```

### 3. Configure Shell Environment (Bash)

Append to `~/.bashrc`:

```bash
# 🔑 Anthropic API Configuration (random key rotation)
unset ANTHROPIC_AUTH_TOKEN
unset ANTHROPIC_BASE_URL
_ANTHROPIC_KEYS=(
    "<key1>"
    "<key2>"
)
export ANTHROPIC_AUTH_TOKEN="${_ANTHROPIC_KEYS[$((RANDOM % ${#_ANTHROPIC_KEYS[@]}))]}"
export ANTHROPIC_BASE_URL="<your-api-base-url>"

# 🛠️ PATH: npm global + uv
export PATH="$HOME/.npm-global/bin:$HOME/.local/bin:$PATH"

# 🤗 HuggingFace Mirror
export HF_ENDPOINT="https://hf-mirror.com"
```

### 4. Configure Shell Environment (Fish)

Write to `~/.config/fish/config.fish`:

```fish
# 🔑 Anthropic API Configuration (random key rotation)
set _anthropic_keys "<key1>" "<key2>"
set -gx ANTHROPIC_BASE_URL "<your-api-base-url>"
set -gx ANTHROPIC_AUTH_TOKEN $_anthropic_keys[(random 1 (count $_anthropic_keys))]
if set -q ANTHROPIC_API_KEY
    set -e ANTHROPIC_API_KEY
end

# 🤗 HuggingFace Mirror
set -gx HF_ENDPOINT "https://hf-mirror.com"

# 🛠️ PATH
fish_add_path -g $HOME/.npm-global/bin
fish_add_path -g $HOME/.local/bin

# 🛡️ Fix: conda OpenSSL conflicts with system ssh/scp
set -gx PATH /usr/bin $PATH

# 🐍 Conda init
if test -f $HOME/miniconda3/etc/fish/conf.d/conda.fish
    source $HOME/miniconda3/etc/fish/conf.d/conda.fish
end
```

### 5. Clone Claude Code Config Project

```bash
git clone https://github.com/ZhexiLuo/everything-claude-code.git ~/.claude
```

This clones directly as the Claude Code config directory, providing pre-configured agents, hooks, rules, skills, settings, and MCP configs.

### 6. Verify

```bash
export PATH="$HOME/.npm-global/bin:$HOME/.local/bin:$HOME/miniconda3/bin:$PATH"
conda --version   # conda 26.x
uv --version      # uv 0.x
claude --version   # Claude Code 2.x
fish --version     # fish 3.x (after sudo install)
pip config list    # should show aliyun mirror
conda config --show default_channels  # should show tsinghua
```

## Common Mistakes

- `npm install -g` fails without sudo → use `~/.npm-global` prefix
- `bash -l` in non-interactive SSH won't source `.bashrc` (guard clause) → use `source ~/.bashrc` or set PATH explicitly
- conda init only modifies `.bashrc`, fish needs separate `conda.fish` source
- Forgetting `trusted-host` in pip.conf for HTTPS mirrors → pip will reject them
