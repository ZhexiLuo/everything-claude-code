this is my custormer repo of everything-claude-code, to use it, you could:
```
# backup old project rule if .claude already exist
mv ~/.claude ~/.claude.backup.$(date +%Y%m%d-%H%M%S)
# git clone
git clone https://github.com/ZhexiLuo/everything-claude-code.git ~/.claude
# add permissions for hooks
chmod -R +x ~/.claude/ 2>/dev/null || true
# verify claude config are working 
claude /config
# update in the future
cd ~/.claude && git pull
```


