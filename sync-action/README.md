# NotCMS Sync Action

Sync content between [NotCMS](https://notcms.com) (Notion) and your repository as Markdown files.

> **v0.1** — Pull only (Notion → Repository). Push support coming in future releases.

## Quick Start

```yaml
name: Sync from NotCMS
on:
  schedule:
    - cron: "0 */6 * * *"
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

jobs:
  pull:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: qqpann/notcms/sync-action@v0
        with:
          direction: pull
          workspace_id: ${{ secrets.NOTCMS_WORKSPACE_ID }}
          secret_key: ${{ secrets.NOTCMS_SECRET_KEY }}
```

This will:
1. Fetch all databases and pages from your NotCMS workspace
2. Generate Markdown files with YAML frontmatter under `content/`
3. Create a Pull Request with the changes

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `direction` | Yes | — | Sync direction: `pull` |
| `workspace_id` | Yes | — | NotCMS workspace ID |
| `secret_key` | Yes | — | NotCMS API key (Bearer token) |
| `file_path` | No | `content/{db}/{title}.md` | File path template (see below) |
| `on_change` | No | `pr` | `commit` / `pr` / `pr-auto-merge` |
| `api_host` | No | `https://api.notcms.com/v1` | API host URL |
| `github_token` | No | `${{ github.token }}` | GitHub token for PR creation |

## Outputs

| Output | Description |
|--------|-------------|
| `files_changed` | Number of files written |
| `pull_request_url` | URL of the created PR (if `on_change` is `pr` or `pr-auto-merge`) |

## File Path Template

The `file_path` input is a template string that defines where each page is written. Use `{var}` placeholders that get substituted with page data.

### Placeholder Resolution

Each `{var}` is resolved in this order:

1. **Notion property** — If the page has a property matching the name, its value is used
2. **Built-in fallback** — If no property matches, these built-in values apply:

| Variable | Fallback |
|----------|----------|
| `{title}` | Page title |
| `{db}` | Database name in NotCMS |
| `{id}` | NotCMS page ID |

This means if your database has a property named `title`, the property value is used (not the built-in page title). In practice, these are usually identical.

### Examples

```yaml
# Default — organize by database name
file_path: "content/{db}/{title}.md"
# → content/blog/Hello-World.md

# Multilingual site with category and locale properties
file_path: "content/{category}/{locale}/{filename}.md"
# → content/legal/en/privacy.md

# Simple blog with slug property
file_path: "posts/{slug}.md"
# → posts/hello-world.md

# Flat structure with page ID for uniqueness
file_path: "docs/{title}-{id}.md"
# → docs/Privacy-Policy-abc123.md
```

### Behavior

- Each `{var}` value is sanitized for filesystem safety (CJK characters preserved)
- If any placeholder resolves to an empty value, the page is skipped with a warning
- Files are only written when content has actually changed

## Generated File Format

Each page becomes a Markdown file with YAML frontmatter:

```markdown
---
title: Privacy Policy
description: Acme Privacy Policy
last_edited_time: "2026-03-24T12:00:00.000Z"
notcms_id: "abc123-def456"
notcms_db: "legal"
notcms_last_synced_at: "2026-03-24T15:00:00.000Z"
---

# Privacy Policy

We respect your privacy...
```

- All Notion properties are included in frontmatter
- `notcms_id` and `notcms_db` are added for sync tracking

## Examples

### Multilingual Content

```yaml
- uses: qqpann/notcms/sync-action@v0
  with:
    direction: pull
    workspace_id: ${{ secrets.NOTCMS_WORKSPACE_ID }}
    secret_key: ${{ secrets.NOTCMS_SECRET_KEY }}
    file_path: "content/{category}/{locale}/{filename}.md"
```

### Direct Commit (No PR)

```yaml
- uses: qqpann/notcms/sync-action@v0
  with:
    direction: pull
    workspace_id: ${{ secrets.NOTCMS_WORKSPACE_ID }}
    secret_key: ${{ secrets.NOTCMS_SECRET_KEY }}
    on_change: commit
```

### PR with Auto-Merge

```yaml
- uses: qqpann/notcms/sync-action@v0
  with:
    direction: pull
    workspace_id: ${{ secrets.NOTCMS_WORKSPACE_ID }}
    secret_key: ${{ secrets.NOTCMS_SECRET_KEY }}
    on_change: pr-auto-merge
```

> Auto-merge must be enabled in your repository settings.

## Setup

1. Get your workspace ID and secret key from the [NotCMS Dashboard](https://dash.notcms.com/)
2. Add them as [GitHub repository secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions):
   - `NOTCMS_WORKSPACE_ID`
   - `NOTCMS_SECRET_KEY`
3. Create a workflow file (see Quick Start above)
4. Ensure the workflow has the required permissions:
   - `contents: write` — to push branches and commits
   - `pull-requests: write` — to create PRs (when `on_change` is `pr` or `pr-auto-merge`)
5. Enable "Allow GitHub Actions to create and approve pull requests" in **Settings → Actions → General** (required for PR creation)

## License

MIT
