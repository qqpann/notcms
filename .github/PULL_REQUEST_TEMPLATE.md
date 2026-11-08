<!--
Write the PR title in English, followed by Japanese: <type>: <English summary> / <日本語の要約>.
Complete both sections below, keeping the same facts, validation results and checklist states.
PR タイトルは英語、日本語の順に記載してください: <type>: <English summary> / <日本語の要約>。
以下の両言語の欄を記入し、事実・検証結果・チェック状態を一致させてください。
-->

## English

### Description of change

<!--
Explain what changes, why it is needed, and the resulting behavior.
List only validation you actually performed, including commands and results.
Link related issues; use Fixes #0000 only when merging should close that issue.
If another PR is a prerequisite, link it and state the base branch and merge order.
-->

### UI screenshots

<!--
For intentional UI changes or visual regression risk, include representative Before/After screenshots.
Otherwise write "N/A (reason)". Reuse the same images in the Japanese section.
-->

| Before | After |
| --- | --- |
| <!-- Before screenshot or N/A (reason) --> | <!-- After screenshot or N/A (reason) --> |

### Pull-Request Checklist

<!-- Keep every item. For unavailable commands or inapplicable items, leave unchecked and add N/A (reason). -->

- [ ] Code is up-to-date with the `main` branch
- [ ] `pnpm check` passes with this change
- [ ] `pnpm test` passes with this change
- [ ] This pull request links relevant issues as `Fixes #0000`
- [ ] There are new or updated unit tests validating the change
- [ ] Documentation has been updated to reflect this change
- [ ] The new commits follow conventions outlined in the [conventional commit spec](https://www.conventionalcommits.org/en/v1.0.0/)

---

## 日本語

### 変更内容

<!--
何を、なぜ変更し、変更後にどう動作するかを説明してください。
実際に行った検証のみ、コマンドと結果を記載してください。
関連 Issue をリンクし、マージ時に閉じる場合のみ Fixes #0000 を使用してください。
先行 PR が必要な場合はリンクし、base ブランチとマージ順を記載してください。
-->

### UI スクリーンショット

<!--
意図的な UI 変更または視覚回帰リスクがある場合、代表的な Before/After を掲載してください。
該当しない場合は「なし（理由）」と記載してください。英語の欄と同じ画像を使用してください。
-->

| 変更前 | 変更後 |
| --- | --- |
| <!-- 変更前の画像または「なし（理由）」 --> | <!-- 変更後の画像または「なし（理由）」 --> |

### PR チェックリスト

<!-- すべての項目を維持してください。実行できないコマンドや対象外の項目は未チェックのまま「なし（理由）」を添えてください。 -->

- [ ] コードが `main` ブランチの最新状態を取り込んでいる
- [ ] この変更に対する `pnpm check` が成功する
- [ ] この変更に対する `pnpm test` が成功する
- [ ] 関連 Issue を `Fixes #0000` としてリンクしている
- [ ] 変更を検証する単体テストを追加・更新している
- [ ] 変更に合わせてドキュメントを更新している
- [ ] 新しいコミットが [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) の規約に従っている
