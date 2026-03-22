#!/usr/bin/env bash
set -euo pipefail

SOURCE_CODEX_DIR="${1:-$HOME/.codex}"
SOURCE_SKILLS_DIR="${SOURCE_CODEX_DIR%/}/skills"
TARGET_AGENTS_DIR="${2:-$HOME/.agents}"
TARGET_SKILLS_DIR="${TARGET_AGENTS_DIR%/}/skills"

if [[ ! -d "$SOURCE_SKILLS_DIR" ]]; then
  echo "source skills directory not found: $SOURCE_SKILLS_DIR" >&2
  exit 1
fi

mkdir -p "$TARGET_AGENTS_DIR"

if [[ -L "$TARGET_SKILLS_DIR" ]]; then
  CURRENT_TARGET="$(readlink "$TARGET_SKILLS_DIR")"
  if [[ "$CURRENT_TARGET" == "$SOURCE_SKILLS_DIR" ]]; then
    echo "skills link already configured: $TARGET_SKILLS_DIR -> $CURRENT_TARGET"
    exit 0
  fi
  echo "target already exists as a different symlink: $TARGET_SKILLS_DIR -> $CURRENT_TARGET" >&2
  exit 1
fi

if [[ -e "$TARGET_SKILLS_DIR" ]]; then
  echo "target already exists and is not a symlink: $TARGET_SKILLS_DIR" >&2
  exit 1
fi

ln -s "$SOURCE_SKILLS_DIR" "$TARGET_SKILLS_DIR"

echo "linked Codex skills:"
echo "  source: $SOURCE_SKILLS_DIR"
echo "  target: $TARGET_SKILLS_DIR"
