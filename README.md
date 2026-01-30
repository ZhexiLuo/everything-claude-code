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

### 🧠 install plugin (recommended)
`claude-mem` provides persistent memory across Claude Code sessions:
```bash
# in Claude Code terminal
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
# restart Claude Code to activate
```
## ⭕️bug-fix
- TypeScript check hook failed because tsc was not globally installed; fixed by running npm install -g typescript.
- Node.js v24+ hook escape error: `if(!process.env.TMUX)` causes `SyntaxError: Invalid or unexpected token` due to stricter escape handling. Fix: change `!` to `=== undefined`, e.g., `if(process.env.TMUX === undefined)`.         
## 📋 Todo
- 🔬 support more research skills.
