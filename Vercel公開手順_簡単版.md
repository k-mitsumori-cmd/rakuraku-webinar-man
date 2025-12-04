# 🚀 Vercel公開手順（超簡単版）

## 📋 5ステップで公開完了！

### ステップ1: Vercelにアカウント作成

1. https://vercel.com にアクセス
2. 「Sign Up」→「Continue with GitHub」をクリック
3. GitHubアカウントでログイン

### ステップ2: プロジェクトをインポート

1. Vercelダッシュボードで「**Add New...**」→「**Project**」をクリック
2. 「**Import Git Repository**」をクリック
3. 「**prtimes-rakuraku**」を選択
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

**https://prtimes-rakuraku.vercel.app**

このURLでアクセスできます！

## 🎉 これで完了！

AI機能も使えるWebサイトが公開されました！

## 📝 更新方法

ファイルを更新したら：

```bash
git add .
git commit -m "更新内容"
git push
```

Vercelが自動的に再デプロイします。
