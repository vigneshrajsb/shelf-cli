# read-it-later-cli 🦊

A simple CLI for saving and organizing URLs - articles, videos, and bookmarks. Read it later.

## Installation

```bash
git clone https://github.com/vigneshrajsb/read-it-later-cli.git
cd read-it-later-cli
bun install
bun link
```

## Usage

### Adding Items

```bash
# Auto-detects type from URL
later add "https://youtube.com/watch?v=abc"     # → video
later add "https://medium.com/some-article"     # → article

# Save as bookmark (reference, not to consume)
later add "https://turbotax.com" --bookmark --tags "tax,tools"

# With notes
later add "https://blog.example.com/post" --tags "ai" --notes "Great intro"
```

### Viewing Items

```bash
later list                        # unread items (default)
later list --status read          # completed items
later list --type video           # only videos
later list --tag ai               # filter by tag

later reading                     # articles + videos (to consume)
later bookmarks                   # reference bookmarks only
```

### Completing Items

```bash
later done 3                      # mark item #3 as read
later undone 3                    # mark back as unread
```

### Search & Discovery

```bash
later search "machine learning"   # search title, url, tags, notes
later tags                        # list all tags with counts
later recent                      # recently added (30 days)
later recent 7                    # recently added (7 days)
```

### History

```bash
later history                     # read in last 7 days
later history --days 14           # last 14 days
later history --weeks 4           # last 4 weeks
later history --month 0226        # February 2026
```

### Managing Items

```bash
later edit 3 --tags "ai,ml"       # update tags
later edit 3 --notes "Updated note"
later delete 3                    # remove item
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
later db                          # show path
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
