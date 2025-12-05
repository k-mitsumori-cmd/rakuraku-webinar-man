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
- ${speakers && speakers.length > 0 ? '登壇者情報を含める（ただし自然な表現で）' : ''}
- ハッシュタグを含める
- 絵文字を適切に使用
- ウェビナーの魅力を伝える表現を使用（ただし自然な日本語で）
- **重要**: 以下の不自然な表現は絶対に使用しない：
  - 「〜をもたらすことを期待しています」
  - 「新たな視点をもたらす」
  - 「〜から直接お話を伺うことができます」
  - 英語を日本語に直訳したような表現全般
- 日本語として自然な表現のみを使用
- 文字数は280文字以内（2ツイートに分けても可）

SNS投稿文を作成してください：`;

        // プロンプトを作成（集客向けメール）
        const marketingPrompt = `あなたはB2Bマーケティングの専門家です。
以下の情報を元に、B2B企業向けのセミナー集客メールを作成してください。
他社のB2Bセミナー集客メールを参考に、自然な日本語で作成してください。

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
【内容】
${content}

【要件】
- 件名を含める
- **重要**: 自然な日本語で作成。以下の不自然な表現は絶対に使用しない：
  - 「〜をもたらすことを期待しています」
  - 「新たな視点をもたらす」
  - 「〜に貢献できることを願っています」
  - 「〜していただけます」
  - 英語を日本語に直訳したような表現全般
- B2Bマーケティングのセオリーに沿う：
  - 直接的な参加URLは記載しない
  - 申し込みフォームのURLのみを記載
  - 参加者にとっての価値やメリットを明確に（ただし自然な日本語で）
  - 丁寧だが堅苦しくないトーン
- 以下の情報を含める：
  - 開催日時
  - 開催形式
  - 対象者
  - 参加費
  - 内容（簡潔に）
  - 登壇者情報（登壇者がいる場合、ただし自然な表現で）
  - 申し込みフォームのURLのみ
- 応募を促すCTAを含める（ただし押し付けがましくない表現）
- 余計な装飾や「素晴らしい機会」などの大げさな表現は避ける
- 「敬具」などの改まった結語は不要
- 「一日をお過ごしください」「良い一日を」などの不要な締めの文章は含めない
- 日本語として自然で、ビジネスメールとして適切な表現を使用
- 文字数は400-600文字程度

集客向けメール（申し込み方法案内）を作成してください：`;

        // プロンプトを作成（申し込みありがとうメール）
        const thanksPrompt = `あなたはB2Bマーケティングの専門家です。
以下の情報を元に、B2B企業向けの申し込みありがとうメールを自然な日本語で作成してください。

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
- 件名を含める
- 自然な日本語で作成（英語を日本語に訳したような表現は避ける）
- 「お申し込みありがとうございます」から始める
- 申し込みが完了したことを確認
- 開催日時・形式を再確認
- **重要**: ウェビナー参加Zoom URLを記載（申し込み後のみ見れるURL）
- 開催前の案内やリマインドについても触れる（簡潔に）
- 「敬具」などの改まった結語は不要
- 「一日をお過ごしください」「良い一日を」などの不要な締めの文章は含めない
- 簡潔で実用的な内容
- 文字数は300-500文字程度

申し込みありがとうメールを作成してください：`;

        // プロンプトを作成（リマインドメール）
        const reminderPrompt = `あなたはB2Bマーケティングの専門家です。
以下の情報を元に、B2B企業向けのセミナーリマインドメールを作成してください。
他社のB2Bセミナーリマインドメールを参考に、自然な日本語で作成してください。

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
- 件名を含める
- **重要**: 自然な日本語で作成。以下の不自然な表現は絶対に使用しない：
  - 「この機会に、〜から直接お話を伺うことができます」
  - 「〜をもたらすことを期待しています」
  - 「〜に貢献できることを願っています」
  - 「〜していただけます」
  - 英語を日本語に直訳したような表現全般
- 開催が間近であることを伝える
- 開催日時・形式を再確認
- **重要**: ウェビナー参加Zoom URLを記載（申し込み後のみ見れるURL）
- 登壇者情報を含める場合（登壇者がいる場合）：
  - 「登壇者は〇〇です」など自然な表現
  - 「〜から直接お話を伺うことができます」のような不自然な表現は避ける
- 当日の流れや準備事項があれば記載（簡潔に）
- 丁寧だが堅苦しくないトーン
- 「素晴らしい機会を提供してくださった」などの大げさな感謝表現は不要
- 「敬具」などの改まった結語は不要
- 「心からの感謝を込めて」などの装飾的な表現は避ける
- 「一日をお過ごしください」「良い一日を」などの不要な締めの文章は含めない
- 日本語として自然で、ビジネスメールとして適切な表現を使用
- 簡潔で実用的な内容
- 文字数は300-500文字程度

リマインドメールを作成してください：`;

        // プロンプトを作成（ウェビナー社内告知文）
        const internalPrompt = `あなたはウェビナー社内告知文を作成する専門家です。
以下の情報を元に、これから開催するウェビナーを社内メンバーに告知する文章を作成してください。

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
- 社内メンバーに向けた告知文として作成
- 「これから開催するウェビナー」の報告・告知であることを明確に
- ウェビナーの概要を簡潔に説明
- 登壇者情報を含める場合（登壇者がいる場合）：
  - 「登壇者は〇〇です」など自然な表現
  - 「〜から直接お話を伺うことができます」のような不自然な表現は避ける
- セミナーに申し込むフォームのURLを記載
- ウェビナーの価値や参加メリットを伝える（ただし自然な日本語で）
- 社内での共有・拡散を促す内容
- **重要**: 自然な日本語で作成。以下の不自然な表現は絶対に使用しない：
  - 「〜をもたらすことを期待しています」
  - 「新たな視点をもたらす」
  - 「〜に貢献できることを願っています」
  - 英語を日本語に直訳したような表現全般
- 日本語として自然で、社内メールとして適切な表現を使用
- 文字数は400-600文字程度

ウェビナー社内告知文を作成してください：`;

        // プロンプトを作成（参加者向けお礼メール）
        const thankyouPrompt = `あなたはB2Bマーケティングの専門家です。
以下の情報を元に、B2B企業向けのセミナー参加者向けお礼メールを作成してください。
他社のB2Bセミナーお礼メールを参考に、自然な日本語で作成してください。

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
- **重要**: 自然な日本語で作成。以下の不自然な表現は絶対に使用しない：
  - 「〜をもたらすことを期待しています」
  - 「新たな視点をもたらす」
  - 「〜に貢献できることを願っています」
  - 「〜していただけます」
  - 「心からの感謝を込めて」
  - 「この機会に、〜から直接お話を伺うことができます」
  - 英語を日本語に直訳したような表現全般
- 「ご視聴ありがとうございました」から始める（ただし簡潔に）
- ウェビナーの内容に軽く言及（簡潔に）
- **重要**: 次回のウェビナーをより良くするために、アンケートへの回答をお願いする形で誘導
- ${surveyFormUrl ? `アンケートフォーム入力URL（${surveyFormUrl}）を記載し、` : ''}アンケートへの協力を丁寧にお願い（ただし押し付けがましくない、自然な表現で）
- 今後の連絡や次回開催の案内を含める（簡潔に）
- 「素晴らしい機会を提供してくださった」などの大げさな感謝表現は不要
- 「敬具」などの改まった結語は不要
- 「一日をお過ごしください」「良い一日を」などの不要な締めの文章は含めない
- 日本語として自然で、ビジネスメールとして適切な表現を使用
- 簡潔で実用的な内容
- 文字数は400-600文字程度

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
                        content: 'あなたはSNS投稿文を作成する専門家です。提供された情報から、魅力的なSNS投稿文を自然な日本語で作成してください。英語を日本語に訳したような表現は絶対に避け、「〜をもたらすことを期待しています」「新たな視点をもたらす」「〜から直接お話を伺うことができます」などの不自然な表現は使用しないでください。日本語として自然な表現のみを使用してください。'
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
                        content: 'あなたはウェビナー社内告知文を作成する専門家です。提供された情報から、これから開催するウェビナーを社内メンバーに告知する文章を自然な日本語で作成してください。英語を日本語に訳したような表現は絶対に避け、「〜をもたらすことを期待しています」「新たな視点をもたらす」などの不自然な表現は使用しないでください。日本語として自然で、社内メールとして適切な表現のみを使用してください。'
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
                        content: 'あなたはB2Bマーケティングの専門家です。提供された情報から、B2B企業向けのセミナー集客メールを自然な日本語で作成してください。他社のB2Bセミナー集客メールを参考に、英語を日本語に訳したような表現は絶対に避けてください。特に「〜をもたらすことを期待しています」「新たな視点をもたらす」などの不自然な表現は使用しないでください。日本語として自然で、ビジネスメールとして適切な表現のみを使用してください。'
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
                        content: 'あなたはB2Bマーケティングの専門家です。提供された情報から、B2B企業向けの申し込みありがとうメールを自然な日本語で作成してください。'
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
                        content: 'あなたはB2Bマーケティングの専門家です。提供された情報から、B2B企業向けのセミナーリマインドメールを自然な日本語で作成してください。他社のB2Bセミナーリマインドメールを参考に、英語を日本語に訳したような表現は絶対に避けてください。特に「この機会に、〜から直接お話を伺うことができます」「〜をもたらすことを期待しています」などの不自然な表現は使用しないでください。日本語として自然で、ビジネスメールとして適切な表現のみを使用してください。'
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
                        content: 'あなたはB2Bマーケティングの専門家です。提供された情報から、B2B企業向けのセミナー参加者向けお礼メールを自然な日本語で作成してください。他社のB2Bセミナーお礼メールを参考に、英語を日本語に訳したような表現は絶対に避けてください。特に「〜をもたらすことを期待しています」「新たな視点をもたらす」「心からの感謝を込めて」などの不自然な表現は使用しないでください。日本語として自然で、ビジネスメールとして適切な表現のみを使用してください。'
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
