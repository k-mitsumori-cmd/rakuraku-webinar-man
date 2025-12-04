# セキュリティガイド - GitHub公開時の注意事項

## ⚠️ 重要な注意事項

このアプリケーションは**クライアントサイド（ブラウザ）で動作**します。
APIキーをコードに直接書くことは**絶対に避けてください**。

## 現在の実装

### ✅ 安全な実装

- APIキーは**ローカルストレージ**に保存されます
- APIキーはコードに含まれていません
- `.gitignore`に`.env`ファイルが含まれています
- ユーザーが自分でAPIキーを入力する方式です

### 🔒 GitHub公開時の安全性

現在の実装では、以下の理由で**GitHubに公開しても安全**です：

1. **APIキーがコードに含まれていない**
   - APIキーはユーザーがブラウザで入力
   - ローカルストレージに保存（各ユーザーのブラウザ内のみ）

2. **`.gitignore`で保護**
   - `.env`ファイルはGitに含まれません
   - 機密情報を含むファイルは除外されています

3. **ユーザーごとに異なるAPIキー**
   - 各ユーザーが自分のAPIキーを使用
   - 共有されることはありません

## GitHub公開手順

### 1. 公開前の確認

```bash
# 以下のファイルにAPIキーが含まれていないか確認
grep -r "sk-" . --exclude-dir=.git
grep -r "YOUR_API_KEY" . --exclude-dir=.git
```

### 2. コミット前の確認

```bash
# ステージングされているファイルを確認
git status

# コミット内容を確認
git diff --cached
```

### 3. 公開リポジトリとして公開

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/prtimes-rakuraku.git
git push -u origin main
```

## より安全な実装方法（推奨）

### 方法1: バックエンドサーバーを使用

**最も安全な方法**です。APIキーをサーバー側で管理します。

```
[ブラウザ] → [バックエンドサーバー] → [OpenAI API]
```

**メリット:**
- APIキーがクライアントに露出しない
- 使用量の制限や監視が可能
- より高度なセキュリティ対策が可能

**実装例:**
- Node.js + Express
- Python + Flask/FastAPI
- Vercel Functions
- Netlify Functions

### 方法2: 環境変数を使用（サーバーレス）

Vercel、Netlify等のサーバーレス関数を使用します。

```javascript
// vercel.json または netlify.toml で環境変数を設定
// APIキーは環境変数として管理
const apiKey = process.env.OPENAI_API_KEY;
```

### 方法3: APIキープロキシサービス

専用のプロキシサービスを使用してAPIキーを保護します。

## 現在の実装の制限事項

### ⚠️ 注意点

1. **APIキーがブラウザに保存される**
   - ローカルストレージはXSS攻撃のリスクがある
   - 開発者ツールで確認可能

2. **CORS制限**
   - ブラウザから直接OpenAI APIを呼び出す場合、CORSの問題が発生する可能性がある
   - 現在の実装では動作しますが、将来的に制限される可能性があります

3. **使用量の管理**
   - 各ユーザーが自分のAPIキーを使用するため、使用量の管理ができない

## 推奨される改善

### 短期対応

1. ✅ 現在の実装（ユーザーがAPIキーを入力）は安全
2. ✅ GitHubに公開しても問題なし

### 長期対応（本格運用時）

1. バックエンドサーバーを構築
2. APIキーをサーバー側で管理
3. 使用量の制限と監視を実装
4. 認証機能を追加

## チェックリスト

GitHub公開前に確認：

- [ ] APIキーがコードに含まれていない
- [ ] `.env`ファイルが`.gitignore`に含まれている
- [ ] サンプルAPIキーやテスト用キーが含まれていない
- [ ] `SECURITY.md`を読んで理解した
- [ ] READMEにセキュリティに関する注意事項を記載した

## トラブルシューティング

### Q: APIキーを誤ってコミットしてしまった

**A: すぐに対応してください**

1. GitHubでAPIキーを無効化
2. 新しいAPIキーを発行
3. Git履歴から削除（`git filter-branch`または`BFG Repo-Cleaner`を使用）

### Q: 公開リポジトリでAPIキーを管理したい

**A: バックエンドサーバーを使用してください**

クライアントサイドでは安全にAPIキーを管理できません。

## 参考リンク

- [OpenAI API セキュリティガイド](https://platform.openai.com/docs/guides/safety-best-practices)
- [GitHub セキュリティガイド](https://docs.github.com/ja/code-security)
- [OWASP API Security](https://owasp.org/www-project-api-security/)

