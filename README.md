# ウェビナー ラクラク

ウェビナーの企画・告知・運営タスクをAIで自動生成するツールです。

## 特徴

- 🚀 **簡単操作**: ウェビナーの基本情報を入力するだけで各種タスクを自動生成
- 🎯 **お試し機能**: 初めての方でもサンプルデータで動作確認可能
- 🤖 **AI生成**: OpenAI APIを使用して高品質な告知文、企画書、タスクリストを自動生成
- 🎨 **モダンなデザイン**: 親しみやすいUI/UX
- 📋 **ワンクリックコピー**: 生成されたコンテンツを簡単にコピー
- 🔄 **再生成機能**: 異なるニュアンスのコンテンツを生成可能
- ✨ **包括的なタスク管理**: 告知文、企画書、運営チェックリスト、SNS投稿文などを一括生成

## セットアップ

### ローカル開発

1. リポジトリをクローン
```bash
git clone https://github.com/k-mitsumori-cmd/rakuraku-webinar-man.git
cd rakuraku-webinar-man
```

2. 依存関係のインストール（Vercel CLIを使用する場合）
```bash
npm install
```

3. 環境変数の設定
`.env.local`ファイルを作成し、OpenAI APIキーを設定：
```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. フロントエンドの起動
`index.html`をブラウザで開くだけです！

- **ダブルクリック**: `index.html` をダブルクリックしてブラウザで開く
- **ドラッグ&ドロップ**: `index.html` をブラウザにドラッグ&ドロップ

**注意**: ローカル開発時は、VercelにデプロイしたAPIエンドポイントを使用するか、Vercel CLIでローカルサーバーを起動してください。

## 使い方

1. **お試しボタン**: 初めて使う方は「お試しボタン」をクリックしてサンプルデータを読み込み
3. **情報入力**: 
   - ウェビナータイトルを入力
   - 開催日時を入力
   - 開催形式（オンライン/オフライン）を選択
   - 主催者名・会社名を入力
   - ウェビナーの目的・内容を入力（簡潔でOK！AIが詳細を補完します）
   - 対象者を入力（任意）
   - 参加費を入力（任意）
4. **タスク生成**: 「タスクを生成する」ボタンをクリック
5. **生成されるコンテンツ**:
   - ウェビナー告知文（プレスリリース形式）
   - 企画書・概要資料
   - 運営チェックリスト
   - SNS投稿文（Twitter、Facebookなど）
   - 参加者向け案内メール文面
6. **再生成**: 「再生成」ボタンで異なるニュアンスのコンテンツを生成
7. **コピー**: 生成されたコンテンツをコピーして使用

## ファイル構成

```
rakuraku-webinar-man/
├── index.html          # メインHTMLファイル
├── app.js              # JavaScript機能
├── styles.css          # スタイルシート
├── api/                # Vercelサーバーレス関数
│   └── generate.js     # AI生成API
├── package.json        # 依存関係
├── vercel.json         # Vercel設定
├── README.md           # このファイル
└── .gitignore          # Git除外設定
```

## AI機能について

### Vercelサーバーレス関数

- **OpenAI API統合**: Vercelサーバーレス関数でOpenAI APIを呼び出します
- **APIキー管理**: Vercelの環境変数でAPIキーを管理（GitHubに公開されません）
- **フォールバック機能**: APIが利用できない場合は、テンプレートベースで生成します

### APIキーの設定

#### Vercelでの設定（推奨）

1. Vercelダッシュボードで「Settings」→「Environment Variables」を開く
2. 以下を追加：
   - **Key**: `OPENAI_API_KEY`
   - **Value**: `your_openai_api_key_here`
3. 「Save」をクリック

#### ローカル開発用

1. `.env.local`ファイルを作成（プロジェクトルート）
2. 以下の内容を記述：

```env
OPENAI_API_KEY=your_openai_api_key_here
```

3. OpenAI APIキーは https://platform.openai.com/api-keys で取得できます

## セキュリティについて

**GitHub公開時の注意事項**については、`SECURITY.md`を参照してください。

- ✅ APIキーは`.env`ファイルで管理（`.gitignore`に含まれています）
- ✅ バックエンドサーバーでAPIキーを保護
- ✅ GitHubに公開しても安全です

## GitHub公開方法

1. GitHubにリポジトリを作成
   - https://github.com/new にアクセス
   - リポジトリ名を `rakuraku-webinar-man` に設定

2. ローカルでGit初期化とプッシュ

```bash
git init
git add .
git commit -m "Initial commit: ウェビナータスク自動生成システム"
git branch -M main
git remote add origin https://github.com/k-mitsumori-cmd/rakuraku-webinar-man.git
git push -u origin main
```

## Vercel公開方法

### ステップ1: Vercelにアカウント作成

1. https://vercel.com にアクセス
2. 「Sign Up」→「Continue with GitHub」をクリック
3. GitHubアカウントでログイン

### ステップ2: プロジェクトをインポート

1. Vercelダッシュボードで「**Add New...**」→「**Project**」をクリック
2. 「**Import Git Repository**」をクリック
3. 「**rakuraku-webinar-man**」を選択
4. 「**Import**」をクリック

### ステップ3: 環境変数を設定（重要！）

1. 「**Environment Variables**」を開く
2. 以下を追加：
   - **名前**: `OPENAI_API_KEY`
   - **値**: `your_openai_api_key_here`（あなたのOpenAI APIキーを入力してください）
3. 「**Add**」をクリック

**注意**: APIキーは https://platform.openai.com/api-keys で取得できます。

### ステップ4: デプロイ

1. 「**Deploy**」ボタンをクリック
2. 数分待つ

### ステップ5: 完了！

デプロイが完了すると、URLが表示されます：

**https://rakuraku-webinar-man.vercel.app**

このURLでアクセスできます！

### 更新方法

ファイルを更新したら：

```bash
git add .
git commit -m "更新内容"
git push
```

Vercelが自動的に再デプロイします。

## カスタマイズ

### サンプルデータの変更

`app.js` の `SAMPLE_DATA_ARRAY` 配列を編集してください。

### フォーム項目の追加

`index.html` と `app.js`、`api/generate.js` を編集して、必要な入力項目を追加できます。

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
