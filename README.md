# shelf-cli 🦊

A simple CLI for saving and organizing URLs - articles, videos, and bookmarks.

## Installation

```bash
git clone https://github.com/vigneshrajsb/shelf-cli.git
cd shelf-cli
bun install
bun link
```

## Usage

### Adding Items

```bash
# Auto-detects type from URL
shelf add "https://youtube.com/watch?v=abc"     # → video
shelf add "https://medium.com/some-article"     # → article

# Save as bookmark (reference, not to consume)
shelf add "https://turbotax.com" --bookmark --tags "tax,tools"

# With notes
shelf add "https://blog.example.com/post" --tags "ai" --notes "Great intro"
```

### Viewing Items

```bash
shelf list                        # unread items (default)
shelf list --status read          # completed items
shelf list --type video           # only videos
shelf list --tag ai               # filter by tag
```

### Completing Items

```bash
shelf done 3                      # mark item #3 as read
shelf undone 3                    # mark back as unread
```

### Search & Discovery

```bash
shelf search "machine learning"   # search title, url, tags, notes
shelf tags                        # list all tags with counts
shelf recent                      # recently added (30 days)
shelf recent 7                    # recently added (7 days)
```

### History

```bash
shelf history                     # read in last 7 days
shelf history --days 14           # last 14 days
shelf history --weeks 4           # last 4 weeks
shelf history --month 0226        # February 2026
```

### Managing Items

```bash
shelf edit 3 --tags "ai,ml"       # update tags
shelf edit 3 --notes "Updated note"
shelf delete 3                    # remove item
```

### Options

```bash
--json                            # JSON output
--bookmark, -b                    # save as bookmark
--tags, -t "tag1,tag2"           # add tags
--notes, -n "text"               # add notes
```

## Data Storage

Data stored in `~/.shelf/shelf.db` (SQLite).

```bash
shelf db                          # show path
```

## Type Detection

| Type | Detected From |
|------|---------------|
| 🎬 video | YouTube, Vimeo, TikTok, Instagram, Netflix, Twitch, Loom |
| 📄 article | Default (blogs, news, etc.) |
| 🔖 bookmark | `--bookmark` flag |

## AI Agent Integration

See **AGENTS.md** for detailed agent usage.

## License

MIT
