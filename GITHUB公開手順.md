# GitHub公開手順（初心者向け）

このガイドでは、プレスリリース ラクラクをGitHubに公開する方法を、初心者にも分かりやすく説明します。

## 📋 公開前の確認事項

### ✅ セキュリティチェック（重要！）

以下のファイルにAPIキーが含まれていないことを確認してください：

- ✅ `.env`ファイル → `.gitignore`に含まれているので安全
- ✅ `server/.env`ファイル → `.gitignore`に含まれているので安全
- ✅ コード内にAPIキーが直接書かれていない → 確認済み

**結論：セキュリティ上問題ありません！安全に公開できます。**

## 🚀 GitHub公開手順

### ステップ1: GitHubアカウントの準備

1. https://github.com にアクセス
2. アカウントを作成（まだの場合）
3. ログイン

### ステップ2: 新しいリポジトリを作成

1. GitHubにログイン後、右上の「+」ボタンをクリック
2. 「New repository」を選択
3. 以下の情報を入力：
   - **Repository name**: `prtimes-rakuraku`（好きな名前でOK）
   - **Description**: `AIでプレスリリース記事を自動生成するツール`
   - **Public** を選択（公開リポジトリ）
   - **Initialize this repository with a README** はチェックを外す
4. 「Create repository」をクリック

### ステップ3: ターミナルでコマンドを実行

#### 3-1. ターミナルを開く

- Mac: 「アプリケーション」→「ユーティリティ」→「ターミナル」
- または、Spotlight検索で「ターミナル」と検索

#### 3-2. プロジェクトフォルダに移動

ターミナルに以下のコマンドをコピー&ペーストして実行：

```bash
cd "/Users/mitsumori_katsuki/Library/CloudStorage/GoogleDrive-k-mitsumori@surisuta.jp/マイドライブ/01_事業管理/09_Cursol/PRtimes_ラクラク"
```

#### 3-3. Gitを初期化

```bash
git init
```

#### 3-4. ファイルを追加

```bash
git add .
```

#### 3-5. 最初のコミット（変更を記録）

```bash
git commit -m "Initial commit: プレスリリース ラクラク"
```

#### 3-6. GitHubリポジトリに接続

**重要**: `YOUR_USERNAME`をあなたのGitHubユーザー名に置き換えてください

```bash
git remote add origin https://github.com/YOUR_USERNAME/prtimes-rakuraku.git
```

例：ユーザー名が`tanaka`の場合
```bash
git remote add origin https://github.com/tanaka/prtimes-rakuraku.git
```

#### 3-7. GitHubにアップロード

```bash
git branch -M main
git push -u origin main
```

**注意**: 初回はGitHubのユーザー名とパスワード（またはトークン）の入力が求められます。

### ステップ4: 確認

1. GitHubのリポジトリページを開く
2. ファイルがアップロードされていることを確認

## 📁 アップロードされるファイル

以下のファイルがGitHubにアップロードされます：

### ✅ アップロードされるファイル

- `index.html` - メインHTMLファイル
- `app.js` - JavaScript機能
- `styles.css` - スタイルシート
- `README.md` - 説明書
- `SECURITY.md` - セキュリティガイド
- `server/` - バックエンドサーバー（`.env`は除く）
  - `server.js`
  - `package.json`
  - `README.md`
- `.gitignore` - Git除外設定

### ❌ アップロードされないファイル（安全のため）

- `.env` - APIキーを含む環境変数ファイル
- `server/.env` - サーバー用APIキー
- `node_modules/` - 依存関係（自動生成されるため不要）
- `.DS_Store` - Macのシステムファイル

## 🔒 セキュリティについて

### なぜ安全なのか？

1. **APIキーがコードに含まれていない**
   - APIキーは`.env`ファイルにのみ存在
   - `.env`ファイルは`.gitignore`で除外されている

2. **各ユーザーが自分のAPIキーを使用**
   - バックエンドサーバーを自分で起動する必要がある
   - 各ユーザーが自分の`.env`ファイルを作成

3. **公開リポジトリでも安全**
   - APIキーが漏洩する心配がない
   - コードを見られても問題なし

## 📝 公開後の使い方

### 他の人が使う場合

1. GitHubからコードをダウンロード（クローン）
2. `server/.env`ファイルを作成
3. 自分のOpenAI APIキーを設定
4. サーバーを起動

詳細は`README.md`を参照してください。

## ❓ よくある質問

### Q: エラーが出た場合は？

**A:** エラーメッセージを確認してください。よくあるエラー：

- `fatal: remote origin already exists` → 既に接続済み。スキップしてOK
- `Permission denied` → GitHubの認証情報を確認
- `Repository not found` → リポジトリ名とユーザー名を確認

### Q: ファイルを更新したい場合は？

```bash
git add .
git commit -m "更新内容の説明"
git push
```

### Q: 公開したくないファイルがある場合は？

`.gitignore`ファイルに追加してください。

## 🎉 完了！

これでGitHubに公開できました！

公開されたリポジトリのURLは：
`https://github.com/YOUR_USERNAME/prtimes-rakuraku`

このURLを他の人に共有できます。

