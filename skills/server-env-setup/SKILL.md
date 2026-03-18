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
- Node.js 18+ (for claude code)

## ⚠️ Before Starting

**Ask the user to complete these steps first:**

1. **Run sudo commands on the target server** (Claude Code cannot input sudo password via SSH):
   ```bash
   ssh <server>
   sudo apt-get update && sudo apt-get install -y fish
   ```

2. **Provide Anthropic API keys and base URL.** User can provide multiple keys for load balancing (random rotation per session):
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
| fish | `sudo apt install fish` | `~/.config/fish/config.fish` |
| claude code | `npm install -g @anthropic-ai/claude-code` | env vars in shell rc |
| pip mirror | config file | `~/.config/pip/pip.conf` |
| HuggingFace mirror | env var | `HF_ENDPOINT` in shell rc |

## Step-by-Step

### 1. Install Core Tools

```bash
# 🐍 Miniconda (skip if already installed)
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O /tmp/miniconda.sh
bash /tmp/miniconda.sh -b -p $HOME/miniconda3
~/miniconda3/bin/conda init bash

# 🦀 uv (Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# 🐟 Fish shell
sudo apt-get install -y fish
# Alternative without sudo: conda install -c conda-forge fish

# 🤖 Claude Code CLI (needs Node.js 18+)
# If npm global install fails due to permissions:
mkdir -p ~/.npm-global && npm config set prefix ~/.npm-global
npm install -g @anthropic-ai/claude-code
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
# 🔑 Anthropic API Configuration
_ANTHROPIC_KEYS=(
    "<key1>"
    "<key2>"
)
export ANTHROPIC_BASE_URL="<your-api-base-url>"
export ANTHROPIC_AUTH_TOKEN="${_ANTHROPIC_KEYS[$((RANDOM % 2))]}"
unset ANTHROPIC_API_KEY

# 🛠️ PATH: npm global + uv
export PATH="$HOME/.npm-global/bin:$HOME/.local/bin:$PATH"

# 🤗 HuggingFace Mirror
export HF_ENDPOINT="https://hf-mirror.com"
```

### 4. Configure Shell Environment (Fish)

Write to `~/.config/fish/config.fish`:

```fish
# 🔑 Anthropic API Configuration
set _anthropic_keys "<key1>" "<key2>"
set -gx ANTHROPIC_BASE_URL "<your-api-base-url>"
set -gx ANTHROPIC_AUTH_TOKEN $_anthropic_keys[(random 1 2)]
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
git clone https://github.com/ZhexiLuo/everything-claude-code.git ~/everything-claude-code
```

This provides pre-configured agents, hooks, rules, skills, settings, and MCP configs for Claude Code.

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
