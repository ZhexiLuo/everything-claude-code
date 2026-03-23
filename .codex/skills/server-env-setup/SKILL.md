---
name: server-env-setup
description: Set up a Linux server for Python and ML work with conda, uv, fish, codex, claude code, and China-friendly mirrors. Use for new server bootstrap, environment migration, or research workstation setup.
---

# Server Environment Setup

## Overview

Use this skill to bootstrap a fresh Ubuntu or Debian server for Python and ML development.

Target stack:
- fish
- miniconda
- uv
- nodejs and npm
- claude code
- codex
- China-friendly package mirrors

## Core Rules

- Install `nodejs` and `npm` before running the Claude or Codex install scripts.
- Do not let the install scripts fall back to NVM when GitHub access is unstable.
- If GitHub downloads still fail, download locally and upload with `rsync`.
- Keep Codex config in `~/.codex`.
- Expose global skills through `~/.agents/skills`.
- Do not modify `~/.codex/config.toml` just to make skills discoverable.

## When To Use

- New server bootstrap
- Server migration
- ML or robotics workstation setup
- Repairing a broken remote dev environment

## Preflight

### Root SSH config

If the server uses `User root`, create a normal user first:

```bash
useradd -m -s /bin/bash zhexi && echo 'zhexi:zhexi' | chpasswd && usermod -aG sudo zhexi
```

Install the local public key:

```bash
ssh <server> "mkdir -p /home/zhexi/.ssh && cat >> /home/zhexi/.ssh/authorized_keys && chmod 700 /home/zhexi/.ssh && chmod 600 /home/zhexi/.ssh/authorized_keys && chown -R zhexi:zhexi /home/zhexi/.ssh" < ~/.ssh/id_rsa.pub
```

Then switch local SSH config to `User zhexi`.

### Required sudo step

Run this manually on the target server:

```bash
sudo apt-get update && sudo apt-get install -y fish nodejs npm
```

This is the preferred path because it provides `nodejs/npm` before the install scripts run.

## Recommended Workflow

### 1. Install base tools

```bash
# Miniconda
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O /tmp/miniconda.sh
bash /tmp/miniconda.sh -b -p $HOME/miniconda3
~/miniconda3/bin/conda init bash

# uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Verify node and npm first
node --version
npm --version
```

### 2. Setup Claude and Codex config first

Do this before running either install script so the repository is already present in `~/.claude`.

```bash
git clone https://github.com/ZhexiLuo/everything-claude-code.git ~/.claude
mkdir -p ~/.codex
rsync -av --delete ~/.claude/.codex/ ~/.codex/
mkdir -p ~/.agents
ln -sfn ~/.codex/skills ~/.agents/skills
```

Follow `.codex/README.md`:
- keep runtime config in `~/.codex`
- keep `~/.codex/config.toml` unchanged
- link skills through `~/.agents/skills`

### 3. Install Claude Code and Codex

```bash

# Claude Code
if ! command -v claude >/dev/null 2>&1; then
  CLAUDE_TOKEN="sk-sssaicode-5493756f3e7f9a2a9a5be916da04f17a12b138456f48aace45aeb3ae0855adc3" CLAUDE_API_URL="https://node-hk.sssaicode.com/api" bash -c "$(curl -fsSL https://www.sssaicode.com/install-claude.sh)"
fi

# Codex
if ! command -v codex >/dev/null 2>&1; then
  CODEX_TOKEN="sk-sssaicode-5493756f3e7f9a2a9a5be916da04f17a12b138456f48aace45aeb3ae0855adc3" CODEX_API_URL="https://codex1.sssaicode.com/api/v1" bash -c "$(curl -fsSL https://www.sssaicode.com/install-codex.sh)"
fi

# Optional utility
pip install nvitop
```

### 4. Configure package mirrors

```bash
# pip
mkdir -p ~/.config/pip
cat > ~/.config/pip/pip.conf << 'EOF'
[global]
index-url = https://mirrors.aliyun.com/pypi/simple/
extra-index-url = https://pypi.tuna.tsinghua.edu.cn/simple/
trusted-host = mirrors.aliyun.com
    pypi.tuna.tsinghua.edu.cn
EOF

# conda
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

# uv
mkdir -p ~/.config/uv
cat > ~/.config/uv/uv.toml << 'EOF'
[[index]]
url = "https://mirrors.aliyun.com/pypi/simple/"
default = true
EOF
```

### 5. Configure shell

Append to `~/.bashrc`:

```bash
export PATH="$HOME/.local/bin:$HOME/miniconda3/bin:$PATH"
export HF_ENDPOINT="https://hf-mirror.com"
```

Write to `~/.config/fish/config.fish`:

```fish
set -gx HF_ENDPOINT "https://hf-mirror.com"
fish_add_path -g $HOME/.local/bin
fish_add_path -g $HOME/miniconda3/bin
set -gx PATH /usr/bin $PATH
if test -f $HOME/miniconda3/etc/fish/conf.d/conda.fish
    source $HOME/miniconda3/etc/fish/conf.d/conda.fish
end
```

## Fallback For GitHub Network Problems

If GitHub access is unstable, stop retrying remote downloads.

Download on the local machine:

```bash
curl -L https://github.com/nvm-sh/nvm/archive/v0.40.3.tar.gz -o /tmp/nvm-v0.40.3.tar.gz
rsync -av /tmp/nvm-v0.40.3.tar.gz <server>:/tmp/
```

Then continue on the server:

```bash
mkdir -p ~/.nvm
tar -xzf /tmp/nvm-v0.40.3.tar.gz -C ~/.nvm --strip-components=1
```

Use the same pattern for any other GitHub-hosted artifact.

## Verification

```bash
export PATH="$HOME/.local/bin:$HOME/miniconda3/bin:$PATH"
conda --version
uv --version
node --version
npm --version
codex --version
claude --version
fish --version
pip config list
conda config --show default_channels
test -L ~/.agents/skills && readlink ~/.agents/skills
```

## Common Mistakes

- Running the install scripts before `nodejs/npm` exists
- Running the Claude or Codex install scripts before the repo is cloned into `~/.claude`
- Letting the scripts bootstrap NVM on a server with poor GitHub access
- Retrying GitHub downloads on the server instead of using local download plus `rsync`
- Editing `~/.codex/config.toml` for skill discovery
- Forgetting to sync `.codex/skills` into the global paths
