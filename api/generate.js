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
            surveyFormUrl,
            targetAudience, 
            fee, 
            content, 
            speakers = [],
            variation = 0 
        } = req.body;

        // バリデーション
        if (!title || !eventDate || !organizerName || !content || !registrationUrl || !registrationFormUrl) {
            return res.status(400).json({ 
                error: 'タイトル、開催日時、主催者名、内容、セミナーに申し込むフォームのURL、ウェビナー参加Zoom URLは必須です' 
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

【セミナーに申し込むフォームのURL】
${registrationFormUrl}
【ウェビナー参加Zoom URL】
${registrationUrl}
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
  ■ セミナーに申し込むフォームのURL
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

【セミナーに申し込むフォームのURL】
${registrationFormUrl}
${speakersText}
【内容】
${content}

【要件】
- Twitter形式で魅力的に投稿文を作成
- 応募を促すCTAを含める
- セミナーに申し込むフォームのURLを記載する
- ${speakers && speakers.length > 0 ? '登壇者情報を含める' : ''}
- ハッシュタグを含める
- 絵文字を適切に使用
- ウェビナーの魅力を伝える表現を使用
- 文字数は280文字以内（2ツイートに分けても可）

SNS投稿文を作成してください：`;

        // プロンプトを作成（集客向けメール）
        const marketingPrompt = `あなたは集客向けメール（申し込み方法案内メール）を作成する専門家です。
以下の情報を元に、ウェビナーへの参加を促す案内メールを作成してください。

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

【応募者URL】
${registrationUrl}
${registrationFormUrl ? `\n申込フォームURL: ${registrationFormUrl}` : ''}
【内容】
${content}

【要件】
- 件名を含める
- ウェビナーの魅力を伝える
- 参加のメリットを明確に示す
- 以下の情報を含める：
  - 開催日時
  - 開催形式
  - 対象者
  - 参加費
  - 内容
  - 登壇者情報（登壇者がいる場合）
  - 参加方法（応募者URLを明確に記載）
- 応募を強く促すCTAを含める
- 文字数は400-600文字程度

集客向けメール（申し込み方法案内）を作成してください：`;

        // プロンプトを作成（申し込みありがとうメール）
        const thanksPrompt = `あなたは申し込みありがとうメールを作成する専門家です。
以下の情報を元に、申し込みフォーム入力後の返信メールを作成してください。

【ウェビナータイトル】
${title}

【開催日時】
${dateStr} ${timeStr}

【開催形式】
${formatLabel}

【主催者】
${organizerName}
【ウェビナー参加Zoom URL】
${registrationUrl}
【要件】
- 件名を含める（「【${title}】お申し込みありがとうございます」など）
- 「お申し込みありがとうございます」から始める
- 申し込みが完了したことを確認
- 開催日時・形式を再確認
- **重要**: ウェビナー参加Zoom URLを記載（申し込み後のみ見れるURL）
- 開催前の案内やリマインドについても触れる
- 丁寧で温かいトーン
- 文字数は300-500文字程度

申し込みありがとうメールを作成してください：`;

        // プロンプトを作成（リマインドメール）
        const reminderPrompt = `あなたはリマインドメールを作成する専門家です。
以下の情報を元に、応募してきた人へのリマインドメールを作成してください。

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
【ウェビナー参加Zoom URL】
${registrationUrl}
【内容】
${content}

【要件】
- 件名を含める（「【${title}】開催間近のお知らせ」など）
- 開催が間近であることを伝える
- 参加を楽しみにしていることを伝える
- 開催日時・形式を再確認
- **重要**: ウェビナー参加Zoom URLを記載（申し込み後のみ見れるURL）
- 登壇者情報を含める（登壇者がいる場合）
- 当日の流れや持ち物があれば記載
- 丁寧で温かいトーン
- 文字数は400-600文字程度

リマインドメールを作成してください：`;

        // プロンプトを作成（ウェビナー社内告知文）
        const internalPrompt = `あなたはウェビナー社内告知文を作成する専門家です。
以下の情報を元に、「ご視聴ありがとうございました」から始まる社内向けの告知文を作成してください。

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

【セミナーに申し込むフォームのURL】
${registrationFormUrl}

【ウェビナーの内容】
${content}

【要件】
- 「ご視聴ありがとうございました」から始める
- ウェビナーの概要を簡潔に説明
- 参加者への感謝を伝える
- 登壇者情報を含める（登壇者がいる場合）
- 社内メンバーに向けた告知文として作成
- セミナーに申し込むフォームのURLを記載
- ウェビナーの価値や成果を伝える
- 文字数は400-600文字程度

ウェビナー社内告知文を作成してください：`;

        // プロンプトを作成（参加者向けお礼メール）
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
${surveyFormUrl ? `\n【アンケートフォーム入力URL】\n${surveyFormUrl}` : ''}
【要件】
- 件名を含める
- 「ご視聴ありがとうございました」という感謝の言葉から始める
- ウェビナーの内容に言及
- 登壇者への感謝も含める（登壇者がいる場合）
- **重要**: 次回のウェビナーをより良くするために、アンケートへの回答をお願いする形で誘導してください
- ${surveyFormUrl ? `アンケートフォーム入力URL（${surveyFormUrl}）を記載し、` : ''}アンケートへの協力を丁寧にお願いする内容を含める
- 今後の連絡や次回開催の案内を含める
- 丁寧で温かいトーン
- 文字数は500-700文字程度

参加者向けお礼メールを作成してください：`;


        // すべてのコンテンツを並列生成
        const [planRes, checklistRes, snsRes, internalRes, marketingRes, thanksRes, reminderRes, thankyouRes] = await Promise.all([
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
                        content: 'あなたはウェビナー社内告知文を作成する専門家です。提供された情報から、「ご視聴ありがとうございました」から始まる社内向けの告知文を作成してください。'
                    },
                    {
                        role: 'user',
                        content: internalPrompt
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
                        content: 'あなたは集客向けメール（申し込み方法案内メール）を作成する専門家です。提供された情報から、ウェビナーへの参加を促す案内メールを作成してください。'
                    },
                    {
                        role: 'user',
                        content: marketingPrompt
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
                        content: 'あなたは申し込みありがとうメールを作成する専門家です。提供された情報から、申し込みフォーム入力後の返信メールを作成してください。'
                    },
                    {
                        role: 'user',
                        content: thanksPrompt
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
                        content: 'あなたはリマインドメールを作成する専門家です。提供された情報から、応募してきた人へのリマインドメールを作成してください。'
                    },
                    {
                        role: 'user',
                        content: reminderPrompt
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
            })
        ]);

        const plan = planRes.choices[0].message.content;
        const checklist = checklistRes.choices[0].message.content;
        const sns = snsRes.choices[0].message.content;
        const internal = internalRes.choices[0].message.content;
        const marketing = marketingRes.choices[0].message.content;
        const thanks = thanksRes.choices[0].message.content;
        const reminder = reminderRes.choices[0].message.content;
        const thankyou = thankyouRes.choices[0].message.content;

        res.json({
            plan,
            checklist,
            sns,
            internal,
            marketing,
            thanks,
            reminder,
            thankyou
        });

    } catch (error) {
        console.error('タスク生成エラー:', error);
        res.status(500).json({ 
            error: 'タスクの生成に失敗しました',
            message: error.message 
        });
    }
}
