# Codex Migration Bundle

This folder is the Codex-only migration bundle for this repository.

What is directly supported by Codex and included here:
- `AGENTS.md`
- `config.toml`
- `agents/*.toml`

What is migrated here as portable reference material:
- `rules-md/*.md`

What is bundled here for portability, even though Codex does not directly auto-discover it from `.codex/`:
- `skills/`

Why `skills/` is still here:
- You asked for all Codex migration artifacts to live under `.codex/`.
- This keeps the migration self-contained and easy to sync into `~/.codex`.
- Official Codex skill discovery is not based on `~/.codex/skills`; it uses `~/.agents/skills`.

Recommended global usage:
1. Sync this folder to `~/.codex`.
2. Codex will directly use:
   - `~/.codex/AGENTS.md`
   - `~/.codex/config.toml`
   - `~/.codex/agents/*.toml`
3. If you want Codex to auto-discover the migrated skills globally, also copy or symlink:
   - `~/.codex/skills` -> `~/.agents/skills`

What was intentionally not migrated as a first-class Codex config:
- The repository `rules/*.md` files were copied into `rules-md/`, not converted into `.rules` files.
- Codex `.rules` are execution-policy files, not a direct equivalent of Claude prose rule docs.

Filtered skills:
- Excluded from this bundle:
  - `hook-development`
  - `continuous-learning`
  - `eval-harness`
- Kept from the previously identified CC-specific set:
  - `strategic-compact`
  - `server-env-setup`
  - `skill-writer`
  - `get-available-resources`
  - `clean-code`
  - `verify-debug`
  - `project-guidelines-example`
