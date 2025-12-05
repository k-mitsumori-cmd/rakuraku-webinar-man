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
            registrationUrl,
            registrationFormUrl,
            targetAudience, 
            fee, 
            content, 
            speakers = [],
            variation = 0 
        } = req.body;

        // バリデーション
        if (!title || !eventDate || !organizerName || !content || !registrationUrl) {
            return res.status(400).json({ 
                error: 'タイトル、開催日時、主催者名、内容、応募者URLは必須です' 
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

【応募者URL】
${registrationUrl}
${registrationFormUrl ? `\n申込フォームURL: ${registrationFormUrl}` : ''}
${speakersText}
【内容】
${content}

【要件】
- 記事の最初に「${organizerName}${organizerUrl ? `（${organizerUrl}）` : ''}は、」で始める
- 以下のセクションを含める：
  ■ 開催概要
  ■ 内容
  ■ 登壇者情報（登壇者がいる場合）
  ■ 参加方法（応募者URLを明確に記載し、応募を促す）
- ウェビナーの集客を促進するような魅力的な表現を使用
- 参加者のメリットや価値を明確に伝える
- 応募を促すCTA（Call to Action）を含める
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

【応募者URL】
${registrationUrl}
${registrationFormUrl ? `\n申込フォームURL: ${registrationFormUrl}` : ''}
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
  ■ 応募者URL
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

【応募者URL】
${registrationUrl}
${registrationFormUrl ? `\n申込フォームURL: ${registrationFormUrl}` : ''}
${speakersText}
【内容】
${content}

【要件】
- Twitter形式で魅力的に投稿文を作成
- 応募を促すCTAを含める
- 応募者URLを記載する
- ハッシュタグを含める
- 絵文字を適切に使用
- ウェビナーの魅力を伝える表現を使用
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

【応募者URL】
${registrationUrl}
${registrationFormUrl ? `\n申込フォームURL: ${registrationFormUrl}` : ''}
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
  - 参加方法（応募者URLを記載）
- 応募を促す表現を含める
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
- **重要**: 次回のウェビナーをより良くするために、アンケートへの回答をお願いする形で誘導してください
- アンケートへの協力を丁寧にお願いする内容を含める
- 今後の連絡や次回開催の案内を含める
- 丁寧で温かいトーン
- 文字数は500-700文字程度

参加者向けお礼メールを作成してください：`;

        // プロンプトを作成（社内告知文）
        const internalPrompt = `あなたはウェビナー完成後の社内告知文を作成する専門家です。
以下の情報を元に、社内向けの告知文を作成してください。

【ウェビナータイトル】
${title}

【開催日時】
${dateStr} ${timeStr}

【開催形式】
${formatLabel}

【主催者】
${organizerName}
${organizerUrl ? `URL: ${organizerUrl}` : ''}
${speakersText}
【対象者】
${targetAudience || '一般参加者'}

【参加費】
${fee || '無料'}

【ウェビナーの内容】
${content}

【応募者URL】
${registrationUrl}

【要件】
- 社内メンバーに向けた告知文として作成
- ウェビナーの概要を簡潔に説明
- 参加を促す内容にする
- 応募者URLを明確に記載
- ウェビナーの価値やメリットを伝える
- 文字数は400-600文字程度

社内向け告知文を作成してください：`;

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
                        content: 'あなたはウェビナー完成後の社内告知文を作成する専門家です。提供された情報から、社内向けの効果的な告知文を作成してください。'
                    },
                    {
                        role: 'user',
                        content: internalPrompt
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
        const internal = surveyRes.choices[0].message.content;

        res.json({
            announcement,
            plan,
            checklist,
            sns,
            email,
            thankyou,
            internal
        });

    } catch (error) {
        console.error('タスク生成エラー:', error);
        res.status(500).json({ 
            error: 'タスクの生成に失敗しました',
            message: error.message 
        });
    }
}
