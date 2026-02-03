# CLAUDE.md

URL saving and organization CLI with SQLite backend.

## For Agents

Read **AGENTS.md** for complete usage.

## Quick Commands

```bash
later add <url>                   # save (auto-detects type)
later add <url> --bookmark        # save as bookmark
later reading                     # articles + videos to consume
later reading --videos            # videos only
later bookmarks                   # saved references
later done <id>                   # mark complete
later search <query>              # find items
later history --days 7            # recent completions
```

## Types

- 🎬 `video` — YouTube, Vimeo, TikTok, Instagram, Netflix, Twitch
- 📄 `article` — Default (blogs, news, etc.)
- 🔖 `bookmark` — Reference items (--bookmark flag)

## Key Points

- Use `--json` for programmatic access
- Data lives in `~/.shelf/shelf.db`
- You orchestrate; the CLI manages data
