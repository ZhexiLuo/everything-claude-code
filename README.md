## 🚀 Install
### ⚡ Install my claude code everything
This is my custom repo of everything-claude-code, to use it, you could:
```
# 💾 backup old project rule if .claude already exist
mv ~/.claude ~/.claude.backup.$(date +%Y%m%d-%H%M%S)
# 📥 git clone
git clone https://github.com/ZhexiLuo/everything-claude-code.git ~/.claude
# 🔐 add permissions for hooks
chmod -R +x ~/.claude/ 2>/dev/null || true
# ✅ verify claude config are working
claude /config
# 🔄 update in the future
cd ~/.claude && git pull
# 📱 if you need notification
npm install -g happy-coder
# 🔔 then run happy, and claude code could send message to your phone
happy
# 🔄 future update
git pull origin
```

### 🛒 Add Plugin Marketplaces
```bash
# 📦 Official Anthropic marketplace (recommended)
/plugin marketplace add anthropics/claude-plugins-official

# 🔍 Enhanced search plugin
/plugin marketplace add mixedbread-ai/mgrep

# 🧠 Memory persistence plugin (standalone plugin repo)
/plugin marketplace add thedotmack/claude-mem

# 📝 Planning with files plugin
/plugin marketplace add OthmanAdi/planning-with-files
```

### 更新 claude code 最新版
`npm install -g @anthropic-ai/claude-code@latest `

### 🔌 Install Recommended Plugins
> ⚠️ **Note:** You must add the marketplace FIRST before installing plugins from it.

```bash
# Open plugins browser (recommended)
/plugins

# Or install directly (after adding marketplace above)
/plugin install code-review@claude-plugins-official
/plugin install feature-dev@claude-plugins-official
/plugin install context7@claude-plugins-official
/plugin install claude-mem@thedotmack
/plugin install planning-with-files@planning-with-files
```

| Category | Plugin | Description |
|----------|--------|-------------|
| 🛠️ Dev | `typescript-lsp` | TypeScript intelligence |
| 🛠️ Dev | `pyright-lsp` | Python type checking |
| 🔍 Search | `mgrep` | Enhanced search (better than ripgrep) |
| 🔍 Search | `context7` | Live documentation lookup |
| ✅ Quality | `code-review` | Code review |
| ✅ Quality | `security-guidance` | Security checks |
| 🔄 Workflow | `feature-dev` | Feature development |
| 🧠 Memory | `claude-mem` | Persistent memory across sessions |
| 📝 Planning | `planning-with-files` | File-based planning ([OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files)) |
## ⭕️bug-fix
- TypeScript check hook failed because tsc was not globally installed; fixed by running npm install -g typescript.
- Node.js v24+ hook escape error: `if(!process.env.TMUX)` causes `SyntaxError: Invalid or unexpected token` due to stricter escape handling. Fix: change `!` to `=== undefined`, e.g., `if(process.env.TMUX === undefined)`.         
## 📋 Todo
- 🔬 support more research skills.
