# 🌐 GitHub PagesでWebサイト公開手順

GitHub Pagesを使用すると、GitHubリポジトリをWebサイトとして公開できます！

## 📋 公開手順

### ステップ1: GitHubリポジトリを開く

1. ブラウザで以下を開く：
   **https://github.com/k-mitsumori-cmd/prtimes-rakuraku**

### ステップ2: Settings（設定）を開く

1. リポジトリページの上部メニューで「**Settings**」をクリック
2. 左側のメニューから「**Pages**」をクリック

### ステップ3: GitHub Pagesを有効化

1. 「**Source**」セクションで：
   - 「**Deploy from a branch**」を選択
   - 「**Branch**」で「**main**」を選択
   - 「**/ (root)**」を選択
2. 「**Save**」ボタンをクリック

### ステップ4: 公開URLを確認

数分待つと、以下のようなURLでWebサイトが公開されます：

**https://k-mitsumori-cmd.github.io/prtimes-rakuraku**

## ⚠️ 重要な注意事項

### バックエンドサーバーについて

GitHub Pagesは静的サイト（HTML/CSS/JavaScript）のみをホストします。
**バックエンドサーバーはGitHub Pagesでは動作しません。**

### 解決方法

#### 方法1: テンプレートベースで動作（推奨）

現在の実装では、バックエンドサーバーが利用できない場合は自動的にテンプレートベースで記事を生成します。
そのため、GitHub Pagesでも動作しますが、AI生成機能は使えません。

#### 方法2: 外部ホスティングサービスを使用

バックエンドサーバーも含めて公開する場合：

- **Vercel**（推奨）: https://vercel.com
- **Netlify**: https://netlify.com
- **Railway**: https://railway.app
- **Render**: https://render.com

これらのサービスでは、フロントエンドとバックエンドの両方をホストできます。

## 🎉 公開完了

GitHub Pagesで公開すると、誰でも以下のURLでアクセスできます：

**https://k-mitsumori-cmd.github.io/prtimes-rakuraku**

## 📝 更新方法

ファイルを更新したら：

```bash
git add .
git commit -m "更新内容"
git push
```

数分後にGitHub Pagesに自動的に反映されます。

