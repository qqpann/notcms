# Dependency security

## English

The October 2026 refresh removes vulnerable dependency paths from the Sync Action and SDK CLI, and updates build tooling through `pnpm-lock.yaml`. The Action dependency change is reviewed separately.

- Upgrade Changesets CLI to 3.0.3: its new dependency graph removes the old js-yaml/argparse/sprintf-js path. Contributor tooling uses Node 24 and pnpm 11; the published SDK still supports Node >=18.17.
- Remove unused ts-node, eliminating its vulnerable diff dependency.
- Refresh compatible transitive versions, including brace-expansion, cross-spawn, glob, minimatch, picomatch and rollup. The SDK patch changeset covers rebuilt CLI dependencies.
- Override postcss-selector-parser to 7.1.6 for Tailwind 3/PostCSS, and tmp to 0.2.7 for legacy external-editor consumers. These cross-version overrides require demo build/visual checks and an actual external-editor temporary-file compatibility check. No install-hook permissions are expanded.

### Remaining upstream advisory

`pnpm audit` still reports one high advisory for braces 3.0.3: [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). npm reports >=3.0.4 as patched, but no such release is published; the GitHub advisory lists no patched version. [Upstream issue #70](https://github.com/micromatch/braces/issues/70) remains open and the maintainer disputes the reported threat model.

The installed paths are confined to the demo's Tailwind devDependency (chokidar and micromatch/fast-glob). They process repository-controlled glob patterns during builds and local file watching, rather than SDK or Action request data. Do not pass untrusted user-defined glob patterns to this toolchain. No advisory is suppressed or represented as fixed. Recheck the upstream release before removing this note; a Tailwind major migration is a separate decision.

For npm release approval, follow [staged publishing](./npm-staged-publishing.md). The changeset prepares a future SDK patch release; it does not republish 0.3.0 or approve publication automatically.

## 日本語

2026年10月の更新で Sync Action と SDK CLI の脆弱な依存経路を除去し、`pnpm-lock.yaml` の開発ツール依存を更新します。Action の依存変更は別 PR でレビューします。

- Changesets CLI を3.0.3へ更新し、旧 js-yaml/argparse/sprintf-js 経路を除去します。開発ツールはNode24・pnpm11を使い、公開SDKのNode >=18.17対応は維持します。
- 未使用のts-nodeを削除し、脆弱なdiff依存を除去します。
- brace-expansion、cross-spawn、glob、minimatch、picomatch、rollupなどを互換範囲で更新します。再ビルドするCLIの依存変更にSDKのpatch changesetを用意します。
- Tailwind3/PostCSSのpostcss-selector-parserを7.1.6、旧external-editorが使うtmpを0.2.7へoverrideします。メジャーを跨ぐ更新はデモのビルド・見た目と、実際のexternal-editorの一時ファイル互換性を検証します。インストールフックの許可は追加しません。

### 未解決の上流アドバイザリー

`pnpm audit` にはbraces3.0.3のhigh1件、[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)が残ります。npmは>=3.0.4を修正版と示しますが、その版は未公開で、GitHubのアドバイザリーも修正版なしと記載しています。[上流issue #70](https://github.com/micromatch/braces/issues/70)は未解決で、メンテナーは報告された脅威モデルに異議を示しています。

インストールされた経路はデモのTailwind devDependency（chokidar、micromatch/fast-glob）に限られます。SDKやActionへの入力ではなく、ビルドやローカル監視でリポジトリ管理下のglobを扱います。このツールチェーンへ信頼できないユーザー定義globを渡さないでください。アドバイザリーを抑制せず、修正済みとは扱いません。上流の公開を確認してからこの記録を更新し、Tailwindのメジャー移行は別途判断します。

npm公開の承認は[段階的公開](./npm-staged-publishing.md)に従います。changesetは次のSDKパッチ公開を準備するもので、0.3.0の再公開や公開の自動承認は行いません。
