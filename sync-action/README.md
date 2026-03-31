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

jobs:
  pull:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: qqpann/notcms/sync-action@v1
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
| `content_dir` | No | `content` | Root directory for Markdown files |
| `databases` | No | All databases | Custom `dbName:dirPath` mapping (newline-separated) |
| `path_property` | No | — | Notion property name for subdirectory path |
| `filename_property` | No | — | Notion property name for filename |
| `on_change` | No | `pr` | `commit` / `pr` / `pr-auto-merge` |
| `api_host` | No | `https://api.notcms.com/v1` | API host URL |
| `github_token` | No | `${{ github.token }}` | GitHub token for PR creation |

## Outputs

| Output | Description |
|--------|-------------|
| `files_changed` | Number of files written |
| `pull_request_url` | URL of the created PR (if `on_change` is `pr` or `pr-auto-merge`) |

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
- File names are derived from page titles (CJK characters preserved)

## File Path Structure

```
${content_dir}/${db_dir}/${path_property}/${filename}.md
```

- **`content_dir`** — Root directory (default: `content`)
- **`db_dir`** — Database name, or custom mapping via `databases` input
- **`path_property`** — Optional subdirectory from a Notion property
- **`filename`** — From `filename_property`, or sanitized page title

## Examples

### Custom Database Mapping

```yaml
- uses: qqpann/notcms/sync-action@v1
  with:
    direction: pull
    workspace_id: ${{ secrets.NOTCMS_WORKSPACE_ID }}
    secret_key: ${{ secrets.NOTCMS_SECRET_KEY }}
    databases: |
      legal:docs/legal
      blog:content/posts
```

### Multilingual Content with Path Property

Use a Notion property (e.g., `path`) to create locale subdirectories:

```yaml
- uses: qqpann/notcms/sync-action@v1
  with:
    direction: pull
    workspace_id: ${{ secrets.NOTCMS_WORKSPACE_ID }}
    secret_key: ${{ secrets.NOTCMS_SECRET_KEY }}
    path_property: path
```

This generates paths like `content/legal/en/Privacy-Policy.md`.

### Direct Commit (No PR)

```yaml
- uses: qqpann/notcms/sync-action@v1
  with:
    direction: pull
    workspace_id: ${{ secrets.NOTCMS_WORKSPACE_ID }}
    secret_key: ${{ secrets.NOTCMS_SECRET_KEY }}
    on_change: commit
```

### PR with Auto-Merge

```yaml
- uses: qqpann/notcms/sync-action@v1
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

## License

MIT
