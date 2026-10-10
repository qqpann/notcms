# Sync Action releases

## English

`Sync Action Release` runs after every push to `main`, or a manual run on `main`. Preparation and publication runs test and build the Action; unchanged runs and alias-only repairs skip these steps. It prepares `release/sync-action` with the patch version and rebuilt `sync-action/dist`, then opens or updates a bilingual PR. The branch is reserved for the workflow; do not add manual edits to it. Repository settings must allow GitHub Actions to create pull requests.

Review and merge that PR normally. On its merge, a reproducible build creates the immutable `sync-action@X.Y.Z` tag and updates `vX` atomically at the reviewed main commit. The workflow never commits or pushes to main and does not merge PRs. Repeated runs with unchanged release inputs do nothing, except repairing a missing or outdated major alias at the original version-tag commit. Each run publishes its reviewed trigger commit; main may advance while the run executes. Downgrades and overwriting an existing version tag are rejected, and the major alias uses a lease to prevent overwriting a concurrent update.

PRs created with `GITHUB_TOKEN` do not automatically trigger other workflows. The preparation run tests the release script and Action, typechecks it, and builds dist. If the repository requires PR checks, a maintainer must close and reopen the generated PR to trigger those checks before merging. Failures are retained as failures; release summaries appear only after tags are successfully pushed.

Local validation: `pnpm test:sync-release`, `pnpm --filter notcms-sync-action test`, `pnpm --filter notcms-sync-action typecheck`, `pnpm --filter notcms-sync-action build`.

## 日本語

`Sync Action Release` は main の各 push、または main に対する手動実行で起動します。準備・公開時に Action を検証・ビルドし、変更のない実行とエイリアスのみの修復ではこれらを省略します。パッチバージョンと再生成した `sync-action/dist` を `release/sync-action` に用意し、英日2言語の PR を作成・更新します。このブランチはワークフロー専用で、手動変更を追加しません。リポジトリ設定で GitHub Actions の PR 作成を許可する必要があります。

PR を通常どおりレビューしてマージすると、再現可能なビルドを確認したうえで、レビュー済み main コミットに不変の `sync-action@X.Y.Z` タグを作成し、`vX` を同時更新します。ワークフローは main への commit・push や PR のマージを行いません。公開対象が同じ再実行は何もしませんが、メジャーエイリアスが欠落・不一致の場合は元のバージョンタグのコミットへ修復します。各実行はレビュー済みの起動元コミットを公開し、実行中に main が進む場合もあります。バージョンの後退や既存バージョンタグの上書きは拒否し、メジャーエイリアスには lease を使って並行更新の上書きを防ぎます。

`GITHUB_TOKEN` で作成した PR は他のワークフローを自動起動しません。準備実行でリリーススクリプトと Action のテスト、型検査、dist ビルドを行います。PR チェックを必須にしている場合は、管理者が生成 PR を一度閉じて再度開き、マージ前にチェックを起動してください。失敗は失敗のまま残し、公開完了のサマリーはタグの push が成功した場合だけ出します。

ローカル検証: `pnpm test:sync-release`、`pnpm --filter notcms-sync-action test`、`pnpm --filter notcms-sync-action typecheck`、`pnpm --filter notcms-sync-action build`。
