# CLAUDE.md

URL saving and organization CLI with SQLite backend.

## For Agents

Read **AGENTS.md** for complete usage.

## Quick Commands

```bash
shelf add <url>                   # save (auto-detects type)
shelf add <url> --bookmark        # save as bookmark
shelf list                        # show unread items
shelf done <id>                   # mark complete
shelf search <query>              # find items
shelf tags                        # list all tags
shelf history --days 7            # recent completions
```

## Types

- 🎬 `video` — YouTube, Vimeo, TikTok, Instagram, Netflix, Twitch
- 📄 `article` — Default (blogs, news, etc.)
- 🔖 `bookmark` — Reference items (--bookmark flag)

## Key Points

- Use `--json` for programmatic access
- Data lives in `~/.shelf/shelf.db`
- You orchestrate; the CLI manages data
