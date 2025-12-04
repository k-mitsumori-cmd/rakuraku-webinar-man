import { ArticleFormData, GeneratedArticle, PURPOSE_OPTIONS } from '../types';

/**
 * AIを使ってPR TIMES風のリリース記事を生成
 * 実際の実装では、OpenAI APIや他のAIサービスを使用します
 */
export async function generateArticle(formData: ArticleFormData): Promise<GeneratedArticle> {
  // 目的の説明を取得
  const purposeInfo = PURPOSE_OPTIONS.find(p => p.value === formData.purpose);
  const purposeLabel = purposeInfo?.label || 'リリース';

  // 実際の実装では、ここでOpenAI APIを呼び出します
  // 今回は、フォーマットされたテンプレートベースの生成を実装
  const article = formatArticle(formData, purposeLabel);

  return article;
}

function formatArticle(formData: ArticleFormData, purposeLabel: string): GeneratedArticle {
  // PR TIMES風の記事フォーマット
  const lines = formData.content.split('\n').filter(line => line.trim());
  
  // リード文を生成
  const leadParagraph = lines[0] || formData.title;
  
  // 本文を構築
  let body = `【${purposeLabel}】\n\n`;
  body += `${formData.title}\n\n`;
  body += `${leadParagraph}\n\n`;
  
  // 内容を整形
  if (lines.length > 1) {
    body += lines.slice(1).join('\n\n');
  } else {
    body += formData.content;
  }
  
  // キーワードを抽出（簡易版）
  const keywords = extractKeywords(formData.title + ' ' + formData.content);
  
  // サマリーを生成
  const summary = leadParagraph.length > 150 
    ? leadParagraph.substring(0, 150) + '...'
    : leadParagraph;

  return {
    title: formData.title,
    body: body,
    summary: summary,
    keywords: keywords
  };
}

function extractKeywords(text: string): string[] {
  // 簡易的なキーワード抽出
  // 実際の実装では、より高度な自然言語処理を使用
  const commonWords = ['の', 'を', 'に', 'は', 'が', 'と', 'で', 'も', 'から', 'まで', 'など', 'ため', 'こと', 'よう'];
  const words = text
    .replace(/[^\w\s\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1 && !commonWords.includes(word));
  
  // 重複を除去し、上位5つを返す
  const uniqueWords = Array.from(new Set(words));
  return uniqueWords.slice(0, 5);
}

/**
 * OpenAI APIを使用する場合の実装例（コメントアウト）
 * 
 * export async function generateArticleWithOpenAI(formData: ArticleFormData): Promise<GeneratedArticle> {
 *   const response = await fetch('https://api.openai.com/v1/chat/completions', {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
 *     },
 *     body: JSON.stringify({
 *       model: 'gpt-4',
 *       messages: [
 *         {
 *           role: 'system',
 *           content: 'あなたはPR TIMES向けのリリース記事を書く専門家です。提供された情報から、プロフェッショナルで魅力的なリリース記事を作成してください。'
 *         },
 *         {
 *           role: 'user',
 *           content: `タイトル: ${formData.title}\n目的: ${formData.purpose}\n内容: ${formData.content}\n\n上記の情報から、PR TIMESに投稿するリリース記事を作成してください。`
 *         }
 *       ]
 *     })
 *   });
 *   
 *   const data = await response.json();
 *   // レスポンスをパースしてGeneratedArticleに変換
 *   return parseAIResponse(data);
 * }
 */

