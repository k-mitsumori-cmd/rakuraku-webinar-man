# バックエンドサーバー

プレスリリース ラクラクのバックエンドサーバーです。
OpenAI APIを使用して記事を生成します。

## セットアップ

### 1. 依存関係のインストール

```bash
cd server
npm install
```

### 2. 環境変数の設定

`.env`ファイルを作成し、以下の内容を設定してください：

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
NODE_ENV=development
```

**注意**: `.env`ファイルは既に作成済みで、APIキーが設定されています。

### 3. サーバーの起動

```bash
npm start
```

開発モード（自動リロード）で起動する場合：

```bash
npm run dev
```

サーバーが起動すると、以下のメッセージが表示されます：

```
🚀 サーバーが起動しました: http://localhost:3000
📝 記事生成API: http://localhost:3000/api/generate
```

## API エンドポイント

### GET /health

サーバーの状態を確認します。

**レスポンス:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### POST /api/generate

記事を生成します。

**リクエストボディ:**
```json
{
  "title": "記事のタイトル",
  "purpose": "tool-announcement",
  "companyName": "株式会社サンプル",
  "companyUrl": "https://example.com",
  "content": "記事の内容",
  "variation": 0
}
```

**レスポンス:**
```json
{
  "title": "記事のタイトル",
  "body": "生成された記事本文",
  "summary": "記事のサマリー",
  "keywords": ["キーワード1", "キーワード2"]
}
```

## セキュリティ

- APIキーは`.env`ファイルで管理されています
- `.env`ファイルは`.gitignore`に含まれているため、GitHubに公開されません
- CORSが有効になっているため、フロントエンドからのアクセスが可能です

## トラブルシューティング

### ポートが既に使用されている場合

`.env`ファイルの`PORT`を変更してください：

```env
PORT=3001
```

### APIキーエラーが発生する場合

`.env`ファイルの`OPENAI_API_KEY`が正しく設定されているか確認してください。

### CORSエラーが発生する場合

`server.js`のCORS設定を確認してください。必要に応じて、特定のオリジンのみを許可するように設定できます。

