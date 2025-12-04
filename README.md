# プレスリリース ラクラク

PR TIMESに投稿するリリース記事をAIで簡単に作成できるツールです。

## 特徴

- 🚀 **簡単操作**: タイトル、目的、内容を入力するだけで記事を生成
- 🎯 **お試し機能**: 初めての方でもサンプルデータで動作確認可能
- 🤖 **AI生成**: OpenAI APIを使用して高品質な記事を自動生成
- 🎨 **プレスリリース風デザイン**: 親しみやすいUI/UX
- 📋 **ワンクリックコピー**: 生成された記事を簡単にコピー
- 🔄 **再生成機能**: 異なるニュアンスの記事を生成可能

## セットアップ

### 1. バックエンドサーバーの起動

```bash
cd server
npm install
npm start
```

サーバーが起動すると、`http://localhost:3000`でAPIが利用可能になります。

### 2. フロントエンドの起動

`index.html`をブラウザで開くだけです！

- **ダブルクリック**: `index.html` をダブルクリックしてブラウザで開く
- **ドラッグ&ドロップ**: `index.html` をブラウザにドラッグ&ドロップ

## 使い方

1. **バックエンドサーバーを起動**（上記参照）
2. **お試しボタン**: 初めて使う方は「お試しボタン」をクリックしてサンプルデータを読み込み
3. **情報入力**: 
   - タイトルを入力
   - 目的を選択（会社の発表、イベント告知、ツール発表など）
   - 会社名を入力
   - 会社URLを入力（任意）
   - 内容を入力（簡潔でOK！AIが詳細を補完します）
4. **記事生成**: 「記事を生成する」ボタンをクリック
5. **再生成**: 「再生成」ボタンで異なるニュアンスの記事を生成
6. **コピー**: 生成された記事をコピーしてPR TIMESに投稿

## ファイル構成

```
PRtimes_ラクラク/
├── index.html          # メインHTMLファイル
├── app.js              # JavaScript機能
├── styles.css          # スタイルシート
├── server/             # バックエンドサーバー
│   ├── server.js       # Expressサーバー
│   ├── package.json    # 依存関係
│   └── README.md       # サーバー説明書
├── README.md           # このファイル
├── SECURITY.md         # セキュリティガイド
└── GITHUB公開手順.md   # GitHub公開手順
```

## AI機能について

### バックエンドAPI

- **OpenAI API統合**: バックエンドサーバーでOpenAI APIを呼び出します
- **APIキー管理**: `server/.env`ファイルでAPIキーを管理（GitHubに公開されません）
- **フォールバック機能**: バックエンドが利用できない場合は、テンプレートベースで生成します

### APIキーの設定

1. `server/.env`ファイルを作成
2. 以下の内容を記述：

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000
NODE_ENV=development
```

3. OpenAI APIキーは https://platform.openai.com/api-keys で取得できます

## セキュリティについて

**GitHub公開時の注意事項**については、`SECURITY.md`を参照してください。

- ✅ APIキーは`.env`ファイルで管理（`.gitignore`に含まれています）
- ✅ バックエンドサーバーでAPIキーを保護
- ✅ GitHubに公開しても安全です

## GitHub公開方法

詳細な手順は`GITHUB公開手順.md`を参照してください。

簡単な手順：

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/prtimes-rakuraku.git
git push -u origin main
```

## カスタマイズ

### サンプルデータの変更

`app.js` の `SAMPLE_DATA` オブジェクトを編集してください。

### 目的の種類を追加

`app.js` の `PURPOSE_DESCRIPTIONS` と `PURPOSE_LABELS` オブジェクトを編集してください。

### デザインの変更

`styles.css` を編集してください。

## ブラウザ対応

以下のブラウザで動作確認済み：
- Chrome（推奨）
- Firefox
- Safari
- Edge

## ライセンス

MIT

## サポート

問題や質問がある場合は、Issueを作成してください。
