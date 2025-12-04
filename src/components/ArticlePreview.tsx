import React, { useState } from 'react';
import { GeneratedArticle } from '../types';

interface ArticlePreviewProps {
  article: GeneratedArticle;
  onReset: () => void;
}

export const ArticlePreview: React.FC<ArticlePreviewProps> = ({ article, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(article.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('コピーに失敗しました:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-prtimes-dark">生成された記事</h2>
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="btn-secondary text-sm"
          >
            {copied ? '✓ コピーしました' : '📋 コピー'}
          </button>
          <button
            onClick={onReset}
            className="btn-secondary text-sm"
          >
            🔄 新規作成
          </button>
        </div>
      </div>

      <div className="card">
        <div className="border-l-4 border-prtimes-red pl-4 mb-4">
          <h3 className="text-xl font-bold text-prtimes-dark mb-2">{article.title}</h3>
          <p className="text-sm text-gray-600">{article.summary}</p>
        </div>

        <div className="prose max-w-none">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {article.body}
          </div>
        </div>

        {article.keywords.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-600 mb-2">キーワード:</p>
            <div className="flex flex-wrap gap-2">
              {article.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-prtimes-gray text-prtimes-dark rounded-full text-sm"
                >
                  #{keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>次のステップ:</strong> 生成された記事をコピーして、PR TIMESの投稿画面に貼り付けてください。
          必要に応じて、内容を調整してから投稿してください。
        </p>
      </div>
    </div>
  );
};

