# 🚀 Vercelで公開する手順（初心者向け）

Vercelを使用すると、フロントエンドとバックエンドの両方を公開でき、AI機能も使えるようになります！

## 📋 事前準備

### 1. Vercelアカウントの作成

1. https://vercel.com にアクセス
2. 「Sign Up」をクリック
3. 「Continue with GitHub」を選択（GitHubアカウントでログイン）
4. アカウントを作成

## 🚀 公開手順

### 方法1: GitHubから自動デプロイ（推奨・簡単）

#### ステップ1: Vercelにログイン

1. https://vercel.com にアクセス
2. GitHubアカウントでログイン

#### ステップ2: 新しいプロジェクトを作成

1. ダッシュボードで「**Add New...**」→「**Project**」をクリック
2. 「**Import Git Repository**」をクリック
3. GitHubリポジトリ一覧から「**prtimes-rakuraku**」を選択
4. 「**Import**」をクリック

#### ステップ3: プロジェクト設定

1. **Framework Preset**: 「Other」を選択
2. **Root Directory**: `./`（そのまま）
3. **Build Command**: （空欄のまま）
4. **Output Directory**: `./`（そのまま）

#### ステップ4: 環境変数の設定（重要！）

1. 「**Environment Variables**」セクションを開く
2. 以下の環境変数を追加：

   **変数名**: `OPENAI_API_KEY`
   **値**: `your_openai_api_key_here`（あなたのOpenAI APIキーを入力してください）

3. 「**Add**」をクリック

**注意**: APIキーは https://platform.openai.com/api-keys で取得できます。

#### ステップ5: デプロイ

1. 「**Deploy**」ボタンをクリック
2. 数分待つとデプロイが完了します

#### ステップ6: 公開URLを確認

デプロイが完了すると、以下のようなURLが表示されます：

**https://prtimes-rakuraku.vercel.app**

または、カスタムドメインを設定することもできます。

### 方法2: Vercel CLIを使用（上級者向け）

#### ステップ1: Vercel CLIをインストール

```bash
npm install -g vercel
```

#### ステップ2: ログイン

```bash
vercel login
```

#### ステップ3: プロジェクトフォルダでデプロイ

```bash
cd "/Users/mitsumori_katsuki/Library/CloudStorage/GoogleDrive-k-mitsumori@surisuta.jp/マイドライブ/01_事業管理/09_Cursol/PRtimes_ラクラク"
vercel
```

#### ステップ4: 環境変数を設定

```bash
vercel env add OPENAI_API_KEY
```

プロンプトが表示されたら、APIキーを入力してください。

#### ステップ5: 本番環境にデプロイ

```bash
vercel --prod
```

## ⚙️ Vercel設定ファイル

プロジェクトには以下の設定ファイルが含まれています：

- `vercel.json` - Vercelの設定ファイル

このファイルにより、フロントエンドとバックエンドが正しく動作します。

## 🔧 設定の確認

### 環境変数の確認

1. Vercelダッシュボードでプロジェクトを開く
2. 「**Settings**」→「**Environment Variables**」を開く
3. `OPENAI_API_KEY`が設定されているか確認

### デプロイログの確認

1. プロジェクトページで「**Deployments**」タブを開く
2. 最新のデプロイをクリック
3. 「**Build Logs**」でエラーがないか確認

## 🎉 公開完了

デプロイが完了すると、以下のURLでアクセスできます：

**https://prtimes-rakuraku.vercel.app**

## 📝 更新方法

### GitHub経由（自動デプロイ）

1. ファイルを更新
2. GitHubにプッシュ：
   ```bash
   git add .
   git commit -m "更新内容"
   git push
   ```
3. Vercelが自動的に再デプロイします

### Vercel CLI経由

```bash
vercel --prod
```

## 🔒 セキュリティ

- ✅ APIキーは環境変数として管理されます
- ✅ コードにAPIキーは含まれません
- ✅ 安全に公開できます

## ❓ よくある質問

### Q: デプロイに失敗する場合は？

**A:** 以下を確認してください：
1. 環境変数`OPENAI_API_KEY`が設定されているか
2. `vercel.json`ファイルが正しく配置されているか
3. デプロイログでエラーメッセージを確認

### Q: カスタムドメインを設定したい場合は？

**A:** 
1. Vercelダッシュボードでプロジェクトを開く
2. 「**Settings**」→「**Domains**」を開く
3. ドメイン名を入力して設定

### Q: バックエンドAPIが動作しない場合は？

**A:** 
1. `vercel.json`の設定を確認
2. 環境変数が正しく設定されているか確認
3. デプロイログでエラーを確認

## 🎯 次のステップ

1. ✅ Vercelで公開完了
2. ✅ AI機能が使えることを確認
3. ✅ カスタムドメインを設定（任意）
4. ✅ 他の人にURLを共有

## 📚 参考リンク

- Vercel公式ドキュメント: https://vercel.com/docs
- Vercelダッシュボード: https://vercel.com/dashboard
