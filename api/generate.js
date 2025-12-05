import OpenAI from 'openai';

// Vercelサーバーレス関数
export default async function handler(req, res) {
    // CORS設定
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { 
            title, 
            eventDate, 
            eventFormat, 
            organizerName, 
            organizerUrl, 
            targetAudience, 
            fee, 
            content, 
            speakers = [],
            variation = 0 
        } = req.body;

        // バリデーション
        if (!title || !eventDate || !organizerName || !content) {
            return res.status(400).json({ 
                error: 'タイトル、開催日時、主催者名、内容は必須です' 
            });
        }

        // OpenAI APIキーの確認
        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({ 
                error: 'OpenAI APIキーが設定されていません' 
            });
        }

        const formatLabels = {
            'online': 'オンライン',
            'offline': 'オフライン（会場）',
            'hybrid': 'ハイブリッド（オンライン+オフライン）'
        };
        
        const formatLabel = formatLabels[eventFormat] || 'オンライン';
        const date = new Date(eventDate);
        const dateStr = date.toLocaleDateString('ja-JP', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        });
        const timeStr = date.toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        // 登壇者情報をフォーマット
        let speakersText = '';
        if (speakers && speakers.length > 0) {
            speakersText = '\n【登壇者】\n';
            speakers.forEach((speaker, index) => {
                speakersText += `${index + 1}. ${speaker.name || ''}`;
                if (speaker.position) {
                    speakersText += `（${speaker.position}`;
                    if (speaker.company) {
                        speakersText += `・${speaker.company}`;
                    }
                    speakersText += '）';
                } else if (speaker.company) {
                    speakersText += `（${speaker.company}）`;
                }
                speakersText += '\n';
            });
        }

        // OpenAIクライアントの初期化
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        // プロンプトを作成（告知文）
        const announcementPrompt = `あなたはウェビナー告知文を作成する専門家です。
以下の情報を元に、プロフェッショナルで魅力的なウェビナー告知文を作成してください。

【ウェビナータイトル】
${title}

【開催日時】
${dateStr} ${timeStr}

【開催形式】
${formatLabel}

【主催者】
${organizerName}
${organizerUrl ? `URL: ${organizerUrl}` : ''}

【対象者】
${targetAudience || '一般参加者'}

【参加費】
${fee || '無料'}
${speakersText}
【内容】
${content}

【要件】
- 記事の最初に「${organizerName}${organizerUrl ? `（${organizerUrl}）` : ''}は、」で始める
- 以下のセクションを含める：
  ■ 開催概要
  ■ 内容
  ■ 参加方法
- 各セクションを充実させ、具体的で魅力的な内容にする
- PR TIMESのフォーマットに最適化する
- 文字数は800-1200文字程度

ウェビナー告知文を作成してください：`;

        // プロンプトを作成（企画書）
        const planPrompt = `あなたはウェビナー企画書を作成する専門家です。
以下の情報を元に、プロフェッショナルなウェビナー企画書を作成してください。

【ウェビナータイトル】
${title}

【開催日時】
${dateStr} ${timeStr}

【開催形式】
${formatLabel}

【主催者】
${organizerName}
${organizerUrl ? `URL: ${organizerUrl}` : ''}

【対象者】
${targetAudience || '一般参加者'}

【参加費】
${fee || '無料'}
${speakersText}
【内容】
${content}

【要件】
- 以下のセクションを含める：
  ■ イベント名
  ■ 開催日時
  ■ 開催形式
  ■ 主催者
  ■ 対象者
  ■ 参加費
  ■ 目的
  ■ 期待される成果
- 各セクションを充実させ、具体的な内容にする
- 文字数は500-800文字程度

ウェビナー企画書を作成してください：`;

        // プロンプトを作成（チェックリスト）
        const checklistPrompt = `あなたはウェビナー運営チェックリストを作成する専門家です。
以下の情報を元に、実用的なウェビナー運営チェックリストを作成してください。

【ウェビナータイトル】
${title}

【開催日時】
${dateStr} ${timeStr}

【開催形式】
${formatLabel}

【要件】
- 以下のセクションを含める：
  ■ 事前準備（2週間前）
  ■ 1週間前
  ■ 当日
  ■ 事後
- 各セクションに具体的なチェック項目を箇条書きで記載
- 実用的で漏れがないようにする

ウェビナー運営チェックリストを作成してください：`;

        // プロンプトを作成（SNS投稿文）
        const snsPrompt = `あなたはSNS投稿文を作成する専門家です。
以下の情報を元に、魅力的なSNS投稿文（Twitter形式）を作成してください。

【ウェビナータイトル】
${title}

【開催日時】
${dateStr} ${timeStr}

【開催形式】
${formatLabel}

【対象者】
${targetAudience || '一般参加者'}

【参加費】
${fee || '無料'}
${speakersText}
【内容】
${content}

【要件】
- Twitter形式で魅力的に投稿文を作成
- ハッシュタグを含める
- 絵文字を適切に使用
- 文字数は280文字以内（2ツイートに分けても可）

SNS投稿文を作成してください：`;

        // プロンプトを作成（メール文面）
        const emailPrompt = `あなたは参加者向け案内メールを作成する専門家です。
以下の情報を元に、丁寧で分かりやすい案内メールを作成してください。

【ウェビナータイトル】
${title}

【開催日時】
${dateStr} ${timeStr}

【開催形式】
${formatLabel}

【主催者】
${organizerName}
${organizerUrl ? `URL: ${organizerUrl}` : ''}

【対象者】
${targetAudience || '一般参加者'}

【参加費】
${fee || '無料'}
${speakersText}
【内容】
${content}

【要件】
- 件名を含める
- 丁寧で分かりやすい文章
- 以下の情報を含める：
  - 開催日時
  - 開催形式
  - 対象者
  - 参加費
  - 内容
  - 参加方法（URL）
- 文字数は400-600文字程度

参加者向け案内メールを作成してください：`;

        // プロンプトを作成（お礼メール）
        const thankyouPrompt = `あなたは参加者向けお礼メールを作成する専門家です。
以下の情報を元に、丁寧で心のこもったお礼メールを作成してください。

【ウェビナータイトル】
${title}

【開催日時】
${dateStr} ${timeStr}

【主催者】
${organizerName}
${organizerUrl ? `URL: ${organizerUrl}` : ''}
${speakersText}
【要件】
- 件名を含める
- 「ご視聴ありがとうございました」という感謝の言葉から始める
- ウェビナーの内容に言及
- 登壇者への感謝も含める（登壇者がいる場合）
- 今後の連絡や次回開催の案内を含める
- 丁寧で温かいトーン
- 文字数は400-600文字程度

参加者向けお礼メールを作成してください：`;

        // プロンプトを作成（アンケート項目）
        const surveyPrompt = `あなたはウェビナー後のアンケート項目を作成する専門家です。
以下の情報を元に、効果的なアンケート項目を作成してください。

【ウェビナータイトル】
${title}

【ウェビナーの内容】
${content}
${speakersText}
【要件】
- 以下のカテゴリを含める：
  ■ 満足度に関する質問
  ■ 内容に関する質問
  ■ 登壇者に関する質問（登壇者がいる場合）
  ■ 次回参加意向
  ■ 自由記述欄
- 各カテゴリに3-5個の質問項目を含める
- 選択式と記述式のバランスを考慮
- 回答しやすい形式にする
- 文字数は500-800文字程度

アンケート項目を作成してください：`;

        // すべてのコンテンツを並列生成
        const [announcementRes, planRes, checklistRes, snsRes, emailRes, thankyouRes, surveyRes] = await Promise.all([
            openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'あなたはウェビナー告知文を作成する専門家です。提供された情報から、プロフェッショナルで魅力的な告知文を作成してください。'
                    },
                    {
                        role: 'user',
                        content: announcementPrompt
                    }
                ],
                temperature: 0.7 + (variation * 0.1),
                max_tokens: 1500
            }),
            openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'あなたはウェビナー企画書を作成する専門家です。提供された情報から、プロフェッショナルな企画書を作成してください。'
                    },
                    {
                        role: 'user',
                        content: planPrompt
                    }
                ],
                temperature: 0.7 + (variation * 0.1),
                max_tokens: 1200
            }),
            openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'あなたはウェビナー運営チェックリストを作成する専門家です。提供された情報から、実用的なチェックリストを作成してください。'
                    },
                    {
                        role: 'user',
                        content: checklistPrompt
                    }
                ],
                temperature: 0.7 + (variation * 0.1),
                max_tokens: 1000
            }),
            openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'あなたはSNS投稿文を作成する専門家です。提供された情報から、魅力的なSNS投稿文を作成してください。'
                    },
                    {
                        role: 'user',
                        content: snsPrompt
                    }
                ],
                temperature: 0.8 + (variation * 0.1),
                max_tokens: 500
            }),
            openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'あなたは参加者向け案内メールを作成する専門家です。提供された情報から、丁寧で分かりやすい案内メールを作成してください。'
                    },
                    {
                        role: 'user',
                        content: emailPrompt
                    }
                ],
                temperature: 0.7 + (variation * 0.1),
                max_tokens: 800
            }),
            openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'あなたは参加者向けお礼メールを作成する専門家です。提供された情報から、丁寧で心のこもったお礼メールを作成してください。'
                    },
                    {
                        role: 'user',
                        content: thankyouPrompt
                    }
                ],
                temperature: 0.7 + (variation * 0.1),
                max_tokens: 800
            }),
            openai.chat.completions.create({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'あなたはウェビナー後のアンケート項目を作成する専門家です。提供された情報から、効果的なアンケート項目を作成してください。'
                    },
                    {
                        role: 'user',
                        content: surveyPrompt
                    }
                ],
                temperature: 0.7 + (variation * 0.1),
                max_tokens: 1000
            })
        ]);

        const announcement = announcementRes.choices[0].message.content;
        const plan = planRes.choices[0].message.content;
        const checklist = checklistRes.choices[0].message.content;
        const sns = snsRes.choices[0].message.content;
        const email = emailRes.choices[0].message.content;
        const thankyou = thankyouRes.choices[0].message.content;
        const survey = surveyRes.choices[0].message.content;

        res.json({
            announcement,
            plan,
            checklist,
            sns,
            email,
            thankyou,
            survey
        });

    } catch (error) {
        console.error('タスク生成エラー:', error);
        res.status(500).json({ 
            error: 'タスクの生成に失敗しました',
            message: error.message 
        });
    }
}
