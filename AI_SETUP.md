# AI統合ガイド

現在の実装は**テンプレートベース**で、実際のAI APIは使用していません。
実際のAI（OpenAI、Claude等）を使用する場合は、以下の手順で統合できます。

## 現在の実装について

- **テンプレートベース**: 事前に定義されたテンプレートとパターンから文章を生成
- **メリット**: 
  - APIキー不要
  - 無料で使用可能
  - 高速な生成
- **デメリット**:
  - 柔軟性が低い
  - 入力内容に完全に合わせた生成が難しい

## AI API統合の方法

### 方法1: OpenAI APIを使用

1. **APIキーの取得**
   - https://platform.openai.com/ でアカウント作成
   - APIキーを取得

2. **app.js の修正**

```javascript
// generateArticleFromForm 関数内を修正
async function generateArticleFromForm(variation = 0) {
    // ... 既存のコード ...
    
    // 記事生成（AI APIを使用）
    try {
        const article = await generateArticleWithOpenAI(formData, variation);
        displayArticle(article);
    } catch (error) {
        console.error('AI生成エラー:', error);
        alert('記事の生成に失敗しました。もう一度お試しください。');
    }
}

// 新しい関数を追加
async function generateArticleWithOpenAI(formData, variation = 0) {
    const API_KEY = localStorage.getItem('openai_api_key') || prompt('OpenAI APIキーを入力してください:');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-4', // または 'gpt-3.5-turbo'
            messages: [
                {
                    role: 'system',
                    content: 'あなたはPR TIMES向けのプレスリリース記事を書く専門家です。'
                },
                {
                    role: 'user',
                    content: `タイトル: ${formData.title}\n目的: ${formData.purpose}\n会社名: ${formData.companyName}\n内容: ${formData.content}\n\n上記の情報から、PR TIMESに投稿するプレスリリース記事を作成してください。`
                }
            ],
            temperature: 0.7 + (variation * 0.1)
        })
    });
    
    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    
    return {
        title: formData.title,
        body: generatedText,
        summary: generatedText.substring(0, 200),
        keywords: extractKeywords(formData.title + ' ' + formData.content)
    };
}
```

### 方法2: Claude API (Anthropic) を使用

同様の方法で、Claude APIを統合できます。詳細は `ai-integration.js` を参照してください。

## セキュリティに関する注意

⚠️ **重要**: クライアントサイド（ブラウザ）で直接APIキーを使用するのは**非推奨**です。

### 推奨される方法

1. **バックエンドサーバーを作成**
   - Node.js、Python等でAPIサーバーを構築
   - APIキーをサーバー側で管理
   - クライアントからサーバーにリクエスト

2. **プロキシサーバーを使用**
   - Vercel、Netlify Functions等のサーバーレス関数を使用
   - APIキーを環境変数で管理

3. **APIキー管理サービスを使用**
   - AWS Secrets Manager等

## 現在のテンプレートベース実装の改善

AI APIを使わずに、現在の実装を改善する方法：

1. **より多くのテンプレートパターンを追加**
2. **入力内容の解析を強化**
3. **キーワード抽出の精度向上**
4. **文脈に応じた文章生成の改善**

## どちらを選ぶべきか？

- **テンプレートベース**: 無料、高速、シンプルな用途
- **AI API**: 柔軟性、高品質、複雑な要件に対応

用途に応じて選択してください。

