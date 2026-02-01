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
claude plugin marketplace add https://github.com/anthropics/claude-plugins-official

# 🔍 Enhanced search plugin
claude plugin marketplace add https://github.com/mixedbread-ai/mgrep

# 🧠 Memory persistence plugin
claude plugin marketplace add https://github.com/thedotmack/claude-mem

# 📚 Context7 documentation lookup
claude plugin marketplace add https://github.com/context7/context7
```

### 🔌 Install Recommended Plugins
```bash
# Open plugins browser
/plugins

# Or install directly
claude plugin install code-review@claude-plugins-official
claude plugin install feature-dev@claude-plugins-official
claude plugin install context7@claude-plugins-official
claude plugin install claude-mem@thedotmack
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
## ⭕️bug-fix
- TypeScript check hook failed because tsc was not globally installed; fixed by running npm install -g typescript.
- Node.js v24+ hook escape error: `if(!process.env.TMUX)` causes `SyntaxError: Invalid or unexpected token` due to stricter escape handling. Fix: change `!` to `=== undefined`, e.g., `if(process.env.TMUX === undefined)`.         
## 📋 Todo
- 🔬 support more research skills.
