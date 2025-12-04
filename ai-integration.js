// AI統合用のファイル（参考実装）
// このファイルを app.js に統合することで、実際のAI APIを使用できます

/**
 * OpenAI APIを使用した記事生成
 * 使用方法: app.js の generateArticle 関数をこの関数に置き換える
 */
async function generateArticleWithOpenAI(formData, variation = 0) {
    const API_KEY = 'YOUR_OPENAI_API_KEY'; // 環境変数や設定から取得
    
    const prompt = `あなたはPR TIMES向けのプレスリリース記事を書く専門家です。
以下の情報を元に、プロフェッショナルで魅力的なプレスリリース記事を作成してください。

【タイトル】
${formData.title}

【目的】
${PURPOSE_LABELS[formData.purpose] || 'リリース'}

【会社名】
${formData.companyName}
${formData.companyUrl ? `URL: ${formData.companyUrl}` : ''}

【内容】
${formData.content}

【要件】
- 記事の最初に「${formData.companyName}${formData.companyUrl ? `（${formData.companyUrl}）` : ''}は、」で始める
- PR TIMESのフォーマットに最適化する
- 以下のセクションを含める：
  ■ 概要
  ■ 背景・課題
  ■ 詳細
  ■ 主な特徴・メリット
  ■ 今後の展開・展望
- 各セクションを充実させ、具体的で魅力的な内容にする
- 箇条書きは「・」を使用
- 文字数は800-1200文字程度

プレスリリース記事を作成してください：`;

    try {
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
                        content: 'あなたはPR TIMES向けのプレスリリース記事を書く専門家です。提供された情報から、プロフェッショナルで魅力的なリリース記事を作成してください。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7 + (variation * 0.1), // バリエーションに応じて温度を調整
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const generatedText = data.choices[0].message.content;

        // 生成されたテキストを整形
        const lines = generatedText.split('\n').filter(line => line.trim());
        const title = formData.title;
        const body = generatedText;
        const summary = lines.find(line => line.length > 50) || generatedText.substring(0, 200);
        const keywords = extractKeywords(formData.title + ' ' + formData.content);

        return {
            title: title,
            body: body,
            summary: summary.length > 200 ? summary.substring(0, 200) + '...' : summary,
            keywords: keywords
        };
    } catch (error) {
        console.error('AI生成エラー:', error);
        // エラー時はテンプレートベースにフォールバック
        return generateArticleTemplate(formData, variation);
    }
}

/**
 * Claude API (Anthropic) を使用した記事生成
 */
async function generateArticleWithClaude(formData, variation = 0) {
    const API_KEY = 'YOUR_ANTHROPIC_API_KEY';
    
    const prompt = `あなたはPR TIMES向けのプレスリリース記事を書く専門家です。

【タイトル】${formData.title}
【目的】${PURPOSE_LABELS[formData.purpose]}
【会社名】${formData.companyName}
【内容】${formData.content}

上記の情報から、PR TIMESに投稿するプレスリリース記事を作成してください。
記事は「${formData.companyName}${formData.companyUrl ? `（${formData.companyUrl}）` : ''}は、」で始めてください。`;

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-opus-20240229', // または 'claude-3-sonnet-20240229'
                max_tokens: 2000,
                temperature: 0.7 + (variation * 0.1),
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const generatedText = data.content[0].text;

        const keywords = extractKeywords(formData.title + ' ' + formData.content);
        const summary = generatedText.substring(0, 200);

        return {
            title: formData.title,
            body: generatedText,
            summary: summary.length > 200 ? summary + '...' : summary,
            keywords: keywords
        };
    } catch (error) {
        console.error('AI生成エラー:', error);
        return generateArticleTemplate(formData, variation);
    }
}

/**
 * 環境変数からAPIキーを取得する例
 * 実際の実装では、.envファイルや設定画面から取得
 */
function getAPIKey() {
    // 方法1: 環境変数（サーバーサイドが必要）
    // return process.env.OPENAI_API_KEY;
    
    // 方法2: ローカルストレージ（クライアントサイド）
    return localStorage.getItem('openai_api_key') || '';
    
    // 方法3: 設定画面で入力
    // const apiKey = prompt('OpenAI APIキーを入力してください:');
    // return apiKey;
}

