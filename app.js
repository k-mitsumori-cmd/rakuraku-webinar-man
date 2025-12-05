// サンプルデータ（複数パターン）
const SAMPLE_DATA_ARRAY = [
    {
        title: 'AIを活用したマーケティング戦略セミナー',
        eventDate: '2025-02-15T14:00',
        eventFormat: 'online',
        organizerName: '株式会社マーケティングテック',
        organizerUrl: 'https://marketing-tech.co.jp',
        registrationFormUrl: 'https://marketing-tech.co.jp/webinar/form',
        registrationUrl: 'https://zoom.us/j/123456789',
        surveyFormUrl: 'https://marketing-tech.co.jp/webinar/survey',
        targetAudience: 'マーケティング担当者、経営者、起業家',
        fee: '無料',
        content: `AIを活用したマーケティング戦略について解説するウェビナーを開催します。最新のデジタルマーケティング手法と実践的なノウハウをお伝えします。`
    },
    {
        title: 'スタートアップの資金調達戦略ウェビナー',
        eventDate: '2025-02-20T19:00',
        eventFormat: 'online',
        organizerName: 'スタートアップ支援機構',
        organizerUrl: 'https://startup-support.org',
        registrationFormUrl: 'https://startup-support.org/webinar/form',
        registrationUrl: 'https://zoom.us/j/987654321',
        surveyFormUrl: 'https://startup-support.org/webinar/survey',
        targetAudience: '起業家、スタートアップ経営者',
        fee: '5,000円（早期割引あり）',
        content: `スタートアップ企業向けに資金調達戦略を解説するウェビナーを開催します。ベンチャーキャピタルの専門家が実践的なアドバイスを提供します。`
    },
    {
        title: 'デジタルトランスフォーメーション実践セミナー',
        eventDate: '2025-02-25T10:00',
        eventFormat: 'hybrid',
        organizerName: '株式会社DXコンサルティング',
        organizerUrl: 'https://dx-consulting.jp',
        registrationFormUrl: 'https://dx-consulting.jp/webinar/form',
        registrationUrl: 'https://zoom.us/j/555555555',
        surveyFormUrl: 'https://dx-consulting.jp/webinar/survey',
        targetAudience: '経営者、DX推進担当者、IT部門',
        fee: '10,000円',
        content: `企業のデジタルトランスフォーメーションを実践的に進めるためのノウハウを解説します。成功事例と失敗例から学ぶ実践的な内容です。`
    }
];

// ランダムにサンプルデータを取得する関数
function getRandomSampleData() {
    const randomIndex = Math.floor(Math.random() * SAMPLE_DATA_ARRAY.length);
    return SAMPLE_DATA_ARRAY[randomIndex];
}

// DOM要素の取得
const formSection = document.getElementById('form-section');
const previewSection = document.getElementById('preview-section');
const guideSection = document.getElementById('guide-section');
const webinarForm = document.getElementById('webinar-form');
const trySampleBtn = document.getElementById('try-sample-btn');
const titleInput = document.getElementById('title');
const eventDateInput = document.getElementById('event-date');
const eventFormatSelect = document.getElementById('event-format');
const organizerNameInput = document.getElementById('organizer-name');
const organizerUrlInput = document.getElementById('organizer-url');
const registrationUrlInput = document.getElementById('registration-url');
const registrationFormUrlInput = document.getElementById('registration-form-url');
const surveyFormUrlInput = document.getElementById('survey-form-url');
const targetAudienceInput = document.getElementById('target-audience');
const feeTypeInputs = document.querySelectorAll('input[name="fee-type"]');
const feeAmountGroup = document.getElementById('fee-amount-group');
const feeAmountInput = document.getElementById('fee-amount');
const contentTextarea = document.getElementById('content');
const contentLength = document.getElementById('content-length');
const generateBtn = document.getElementById('generate-btn');
const loadingDiv = document.getElementById('loading');
const previewLoadingDiv = document.getElementById('preview-loading');
const regenerateBtn = document.getElementById('regenerate-btn');
const resetBtn = document.getElementById('reset-btn');

// プレビュー要素
const previewPlan = document.getElementById('preview-plan');
const previewChecklist = document.getElementById('preview-checklist');
const previewSns = document.getElementById('preview-sns');
const previewInternal = document.getElementById('preview-internal');
const previewMarketing = document.getElementById('preview-marketing');
const previewThanks = document.getElementById('preview-thanks');
const previewReminder = document.getElementById('preview-reminder');
const previewThankyou = document.getElementById('preview-thankyou');

// 登壇者情報管理
const speakersContainer = document.getElementById('speakers-container');
const addSpeakerBtn = document.getElementById('add-speaker-btn');

// 文字数カウント
contentTextarea.addEventListener('input', () => {
    contentLength.textContent = contentTextarea.value.length;
});

// 参加費タイプ変更時の処理
feeTypeInputs.forEach(input => {
    input.addEventListener('change', () => {
        if (input.value === 'paid') {
            feeAmountGroup.style.display = 'block';
            feeAmountInput.focus();
        } else {
            feeAmountGroup.style.display = 'none';
            feeAmountInput.value = '';
        }
    });
});

// 登壇者追加機能
function addSpeakerItem(speakerData = { name: '', position: '', company: '' }) {
    const speakerItem = document.createElement('div');
    speakerItem.className = 'speaker-item';
    speakerItem.innerHTML = `
        <div class="speaker-row">
            <input 
                type="text" 
                class="speaker-name" 
                placeholder="登壇者名"
                value="${speakerData.name || ''}"
            >
            <input 
                type="text" 
                class="speaker-position" 
                placeholder="役職（例: 代表取締役）"
                value="${speakerData.position || ''}"
            >
            <input 
                type="text" 
                class="speaker-company" 
                placeholder="会社名"
                value="${speakerData.company || ''}"
            >
            <button type="button" class="btn-remove-speaker">削除</button>
        </div>
    `;
    
    const removeBtn = speakerItem.querySelector('.btn-remove-speaker');
    removeBtn.addEventListener('click', () => {
        speakerItem.remove();
        updateRemoveButtons();
    });
    
    speakersContainer.appendChild(speakerItem);
    updateRemoveButtons();
}

// 削除ボタンの表示/非表示を更新
function updateRemoveButtons() {
    const speakerItems = speakersContainer.querySelectorAll('.speaker-item');
    speakerItems.forEach((item, index) => {
        const removeBtn = item.querySelector('.btn-remove-speaker');
        if (speakerItems.length > 1) {
            removeBtn.style.display = 'block';
        } else {
            removeBtn.style.display = 'none';
        }
    });
}

// 登壇者情報を取得
function getSpeakersData() {
    const speakers = [];
    const speakerItems = speakersContainer.querySelectorAll('.speaker-item');
    speakerItems.forEach(item => {
        const name = item.querySelector('.speaker-name').value.trim();
        const position = item.querySelector('.speaker-position').value.trim();
        const company = item.querySelector('.speaker-company').value.trim();
        
        if (name || position || company) {
            speakers.push({ name, position, company });
        }
    });
    return speakers;
}

// 登壇者追加ボタン
addSpeakerBtn.addEventListener('click', () => {
    addSpeakerItem();
});

// 初期化：削除ボタンの表示を更新
updateRemoveButtons();

// タブ切り替え機能
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        
        // すべてのタブを非アクティブに
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // 選択されたタブをアクティブに
        btn.classList.add('active');
        document.getElementById(`tab-${tabName}`).classList.add('active');
    });
});

// コピーボタン機能
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const contentType = btn.getAttribute('data-copy');
        const contentElement = document.getElementById(`preview-${contentType}`);
        
        if (!contentElement || !contentElement.textContent) {
            alert('コピーするコンテンツがありません');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(contentElement.textContent);
            btn.textContent = '✓ コピーしました';
            btn.style.backgroundColor = '#4caf50';
            
            setTimeout(() => {
                btn.textContent = '📋 コピー';
                btn.style.backgroundColor = '';
            }, 2000);
        } catch (err) {
            console.error('コピーに失敗しました:', err);
            alert('コピーに失敗しました。手動でコピーしてください。');
        }
    });
});

// お試しボタン
trySampleBtn.addEventListener('click', () => {
    const sampleData = getRandomSampleData();
    
    titleInput.value = sampleData.title;
    eventDateInput.value = sampleData.eventDate;
    eventFormatSelect.value = sampleData.eventFormat;
    organizerNameInput.value = sampleData.organizerName;
    organizerUrlInput.value = sampleData.organizerUrl || '';
    registrationFormUrlInput.value = sampleData.registrationFormUrl || 'https://example.com/webinar/form';
    registrationUrlInput.value = sampleData.registrationUrl || 'https://zoom.us/j/123456789';
    surveyFormUrlInput.value = sampleData.surveyFormUrl || '';
    targetAudienceInput.value = sampleData.targetAudience || '';
    
    // 参加費の設定
    if (sampleData.fee && sampleData.fee !== '無料' && !sampleData.fee.includes('無料')) {
        document.querySelector('input[name="fee-type"][value="paid"]').checked = true;
        feeAmountGroup.style.display = 'block';
        feeAmountInput.value = sampleData.fee;
    } else {
        document.querySelector('input[name="fee-type"][value="free"]').checked = true;
        feeAmountGroup.style.display = 'none';
        feeAmountInput.value = '';
    }
    
    contentTextarea.value = sampleData.content;
    contentLength.textContent = sampleData.content.length;
    
    // 登壇者情報をクリアしてサンプルデータを追加
    speakersContainer.innerHTML = '';
    if (sampleData.speakers && sampleData.speakers.length > 0) {
        sampleData.speakers.forEach(speaker => {
            addSpeakerItem(speaker);
        });
    } else {
        addSpeakerItem({ name: 'サンプル 太郎', position: '代表取締役', company: '株式会社サンプル' });
    }
    
    titleInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    titleInput.focus();
});

// プログレスバーを初期化する関数
function initializeProgress(isRegenerating = false) {
    const progressCircle = document.querySelector(isRegenerating 
        ? '#preview-loading .progress-ring-circle' 
        : '#loading .progress-ring-circle');
    
    if (progressCircle) {
        const circumference = 2 * Math.PI * 54;
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;
    }
}

// プログレスバーを更新する関数
function updateProgress(percent, isRegenerating = false) {
    const progressCircle = document.querySelector(isRegenerating 
        ? '#preview-loading .progress-ring-circle' 
        : '#loading .progress-ring-circle');
    const progressPercent = document.querySelector(isRegenerating 
        ? '#preview-loading .progress-percent' 
        : '#loading .progress-percent');
    
    if (progressCircle && progressPercent) {
        const circumference = 2 * Math.PI * 54;
        const offset = circumference - (percent / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
        progressPercent.textContent = Math.min(Math.floor(percent), 100);
    }
}

// プログレスアニメーションを開始
function startProgressAnimation(isRegenerating = false) {
    initializeProgress(isRegenerating);
    updateProgress(0, isRegenerating);
    
    let progress = 0;
    const targetProgress = 95;
    const duration = 25000;
    const interval = 50;
    const increment = (targetProgress / duration) * interval;
    
    const progressInterval = setInterval(() => {
        progress += increment;
        if (progress < targetProgress) {
            updateProgress(progress, isRegenerating);
        } else {
            updateProgress(targetProgress, isRegenerating);
            clearInterval(progressInterval);
        }
    }, interval);
    
    return progressInterval;
}

// ウェビナータスク生成（共通関数）
async function generateWebinarTasks(variation = 0, isRegenerating = false) {
    // 参加費を取得
    const selectedFeeType = document.querySelector('input[name="fee-type"]:checked').value;
    const fee = selectedFeeType === 'free' ? '無料' : feeAmountInput.value.trim() || '無料';
    
    const formData = {
        title: titleInput.value.trim(),
        eventDate: eventDateInput.value,
        eventFormat: eventFormatSelect.value,
        organizerName: organizerNameInput.value.trim(),
        organizerUrl: organizerUrlInput.value.trim(),
        registrationUrl: registrationUrlInput.value.trim(),
        registrationFormUrl: registrationFormUrlInput.value.trim(),
        surveyFormUrl: surveyFormUrlInput.value.trim(),
        targetAudience: targetAudienceInput.value.trim(),
        fee: fee,
        content: contentTextarea.value.trim(),
        speakers: getSpeakersData()
    };
    
    if (!formData.title || !formData.content || !formData.organizerName || !formData.eventDate || !formData.registrationUrl || !formData.registrationFormUrl) {
        alert('タイトル、開催日時、主催者名、内容、セミナーに申し込むフォームのURL、ウェビナー参加Zoom URLを入力してください。');
        return null;
    }
    
    // ローディング表示
    let progressInterval;
    if (isRegenerating) {
        if (previewLoadingDiv) {
            previewLoadingDiv.classList.add('active');
            setTimeout(() => {
                progressInterval = startProgressAnimation(true);
            }, 100);
        }
        if (regenerateBtn) {
            regenerateBtn.disabled = true;
            regenerateBtn.textContent = '🔄 再生成中...';
        }
    } else {
        generateBtn.disabled = true;
        generateBtn.textContent = '✨ 生成中...';
        if (regenerateBtn) regenerateBtn.disabled = true;
        if (loadingDiv) {
            loadingDiv.style.display = 'block';
            setTimeout(() => {
                progressInterval = startProgressAnimation(false);
            }, 100);
        }
    }
    
    try {
        let tasks;
        try {
            tasks = await generateTasksWithAI(formData, variation);
            if (progressInterval) clearInterval(progressInterval);
            updateProgress(100, isRegenerating);
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (apiError) {
            console.warn('バックエンドAPIエラー、テンプレートベースにフォールバック:', apiError);
            if (progressInterval) clearInterval(progressInterval);
            updateProgress(100, isRegenerating);
            await new Promise(resolve => setTimeout(resolve, 500));
            tasks = generateTasksTemplate(formData, variation);
        }
        
        displayTasks(tasks);
        window.lastFormData = formData;
        
        if (!isRegenerating) {
            previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } catch (error) {
        console.error('タスク生成エラー:', error);
        if (progressInterval) clearInterval(progressInterval);
        alert('タスクの生成に失敗しました。APIキーが正しいか確認してください。\n\nエラー: ' + error.message);
        
        const tasks = generateTasksTemplate(formData, variation);
        displayTasks(tasks);
    } finally {
        if (isRegenerating) {
            if (previewLoadingDiv) {
                previewLoadingDiv.classList.remove('active');
            }
            if (regenerateBtn) {
                regenerateBtn.disabled = false;
                regenerateBtn.textContent = '🔄 再生成';
            }
        } else {
            if (loadingDiv) loadingDiv.style.display = 'none';
            generateBtn.disabled = false;
            generateBtn.textContent = '✨ タスクを生成する';
            if (regenerateBtn) regenerateBtn.disabled = false;
        }
    }
}

// バックエンドAPIを使用したタスク生成
async function generateTasksWithAI(formData, variation = 0) {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_URL = isLocalhost 
        ? 'http://localhost:3000/api/generate'
        : '/api/generate';
    
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...formData,
            variation: variation
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

// テンプレートベースのタスク生成（フォールバック）
function generateTasksTemplate(formData, variation = 0) {
    const formatLabels = {
        'online': 'オンライン',
        'offline': 'オフライン（会場）',
        'hybrid': 'ハイブリッド（オンライン+オフライン）'
    };
    
    const formatLabel = formatLabels[formData.eventFormat] || 'オンライン';
    const date = new Date(formData.eventDate);
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
    
    return {
        plan: `【企画書】

■ イベント名
${formData.title}

■ 開催日時
${dateStr} ${timeStr}

■ 開催形式
${formatLabel}

■ 主催者
${formData.organizerName}
${formData.organizerUrl ? `URL: ${formData.organizerUrl}` : ''}

■ 対象者
${formData.targetAudience || '一般参加者'}

■ 参加費
${formData.fee || '無料'}

■ 目的
${formData.content}

■ 期待される成果
・参加者の知識・スキル向上
・ネットワーキング機会の提供
・主催者のブランド認知向上`,

        checklist: `【ウェビナー運営チェックリスト】

■ 事前準備（2週間前）
□ 開催日時・形式の決定
□ 主催者・講師の確定
□ コンテンツの準備
□ 告知文の作成
□ SNS投稿の準備
□ 参加者向け案内メールの準備

■ 1週間前
□ 参加者へのリマインドメール送信
□ 資料の最終確認
□ 配信ツールの動作確認
□ 講師とのリハーサル

■ 当日
□ 配信環境の最終確認
□ 資料・スライドの準備
□ 参加者の受付
□ 記録・録画の準備
□ 質疑応答の準備

■ 事後
□ 参加者へのアンケート送信
□ フォローアップメールの送信
□ 録画の共有（該当する場合）
□ 次回開催の検討`,

        sns: `【Twitter投稿例】

🎉 ウェビナー開催のお知らせ 🎉

「${formData.title}」を開催します！

📅 ${dateStr} ${timeStr}
💻 ${formatLabel}
${formData.fee ? `💰 ${formData.fee}` : '💰 無料'}

${formData.content.substring(0, 100)}...

参加申し込みはこちら 👇
${formData.registrationFormUrl || formData.registrationUrl}

#ウェビナー #セミナー`,

        internal: `【ウェビナー社内告知】

社内メンバーの皆様

この度、${formData.organizerName}${formData.organizerUrl ? `（${formData.organizerUrl}）` : ''}では、以下のウェビナーを開催いたします。

【開催概要】
■ タイトル：${formData.title}
■ 開催日時：${dateStr} ${timeStr}
■ 開催形式：${formatLabel}
${formData.targetAudience ? `■ 対象者：${formData.targetAudience}` : ''}
${formData.fee ? `■ 参加費：${formData.fee}` : '■ 参加費：無料'}

【内容】
${formData.content}

【参加申し込み】
${formData.registrationFormUrl ? `以下のフォームからお申し込みください：\n${formData.registrationFormUrl}` : 'お申し込みフォームをご利用ください'}

社内での共有・拡散にご協力をお願いいたします。`,

        marketing: `件名：【${formData.title}】開催のご案内

${formData.organizerName}でございます。

下記のウェビナーを開催いたします。

【${formData.title}】
開催日時：${dateStr} ${timeStr}
開催形式：${formatLabel}
${formData.targetAudience ? `対象者：${formData.targetAudience}` : ''}
${formData.fee ? `参加費：${formData.fee}` : '参加費：無料'}

【内容】
${formData.content}

【お申し込み】
以下のフォームからお申し込みください。
${formData.registrationFormUrl}

${formData.organizerName}`,

        thanks: `件名：【${formData.title}】お申し込みありがとうございます

${formData.organizerName}でございます。

この度は、ウェビナー「${formData.title}」にお申し込みいただき、誠にありがとうございます。

【開催情報】
■ 開催日時：${dateStr} ${timeStr}
■ 開催形式：${formatLabel}

【ウェビナー参加Zoom URL】
${formData.registrationUrl}

上記URLからウェビナーにご参加いただけます。
当日は開始時刻の5分前までにアクセスしてください。

${formData.organizerName}`,

        reminder: `件名：【${formData.title}】開催間近のお知らせ

${formData.organizerName}でございます。

ウェビナー「${formData.title}」の開催まで間もなくとなりました。

【開催情報】
■ 開催日時：${dateStr} ${timeStr}
■ 開催形式：${formatLabel}

【ウェビナー参加Zoom URL】
${formData.registrationUrl}

当日は開始時刻の5分前までに上記URLからアクセスしてください。
皆様にお会いできることを楽しみにしております。

${formData.organizerName}`,

        thankyou: `件名：【${formData.title}】ご視聴ありがとうございました

${formData.organizerName}でございます。

本日は、ウェビナー「${formData.title}」にご参加いただき、ありがとうございました。
${formData.surveyFormUrl ? `\n次回のウェビナーをより良くするために、アンケートへのご協力をお願いいたします。\n\n【アンケートURL】\n${formData.surveyFormUrl}\n` : ''}

${formData.organizerName}`
    };
}

// タスクを表示
function displayTasks(tasks) {
    previewPlan.textContent = tasks.plan || '';
    previewChecklist.textContent = tasks.checklist || '';
    previewSns.textContent = tasks.sns || '';
    previewInternal.textContent = tasks.internal || '';
    previewMarketing.textContent = tasks.marketing || '';
    previewThanks.textContent = tasks.thanks || '';
    previewReminder.textContent = tasks.reminder || '';
    previewThankyou.textContent = tasks.thankyou || '';
    
    formSection.style.display = 'none';
    guideSection.style.display = 'none';
    previewSection.style.display = 'block';
    
    window.currentTasks = tasks;
}

// フォーム送信
webinarForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    generateWebinarTasks(0);
});

// 再生成ボタン
if (regenerateBtn) {
    regenerateBtn.addEventListener('click', async () => {
        regenerateBtn.disabled = true;
        regenerateBtn.textContent = '🔄 再生成中...';
        
        if (previewSection && previewSection.style.display === 'none') {
            previewSection.style.display = 'block';
        }
        
        if (previewLoadingDiv) {
            previewLoadingDiv.classList.add('active');
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (window.lastFormData) {
            const variation = Math.floor(Math.random() * 3) + 1;
            generateWebinarTasks(variation, true);
        } else {
            generateWebinarTasks(Math.floor(Math.random() * 3) + 1, true);
        }
    });
}

// リセットボタン
resetBtn.addEventListener('click', () => {
    webinarForm.reset();
    contentLength.textContent = '0';
    
    // 登壇者情報をリセット
    speakersContainer.innerHTML = '';
    addSpeakerItem();
    
    formSection.style.display = 'block';
    guideSection.style.display = 'block';
    previewSection.style.display = 'none';
    
    window.currentTasks = null;
    window.lastFormData = null;
    
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ページ読み込み時の初期化
window.addEventListener('DOMContentLoaded', () => {
    initializeProgress(false);
    initializeProgress(true);
});
