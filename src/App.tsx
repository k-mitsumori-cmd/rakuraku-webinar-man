import React, { useState } from 'react';
import { ArticleForm } from './components/ArticleForm';
import { ArticlePreview } from './components/ArticlePreview';
import { ArticleFormData, GeneratedArticle } from './types';
import { generateArticle } from './utils/ai';
import { SAMPLE_DATA } from './utils/sampleData';

function App() {
  const [generatedArticle, setGeneratedArticle] = useState<GeneratedArticle | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<ArticleFormData | null>(null);

  const handleSubmit = async (data: ArticleFormData) => {
    setIsGenerating(true);
    setFormData(data);
    
    try {
      const article = await generateArticle(data);
      setGeneratedArticle(article);
    } catch (error) {
      console.error('記事生成エラー:', error);
      alert('記事の生成に失敗しました。もう一度お試しください。');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLoadSample = (data: ArticleFormData) => {
    setFormData(data);
    // フォームにサンプルデータを反映（ユーザーが確認してから生成できる）
  };

  const handleReset = () => {
    setGeneratedArticle(null);
    setFormData(null);
  };

  return (
    <div className="min-h-screen bg-prtimes-gray">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-prtimes-red rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">PR</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-prtimes-dark">PR TIMES ラクラク</h1>
              <p className="text-sm text-gray-600">AIでリリース記事を一瞬で作成</p>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {!generatedArticle ? (
          <div className="card">
            <ArticleForm 
              onSubmit={handleSubmit}
              onLoadSample={handleLoadSample}
              initialData={formData || undefined}
            />
            {isGenerating && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-prtimes-red"></div>
                <p className="mt-2 text-gray-600">記事を生成中...</p>
              </div>
            )}
          </div>
        ) : (
          <ArticlePreview article={generatedArticle} onReset={handleReset} />
        )}

        {/* 使い方ガイド */}
        {!generatedArticle && (
          <div className="mt-8 card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <h3 className="text-lg font-bold text-gray-800 mb-3">📖 使い方</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>「お試しボタン」をクリックして、サンプルデータで動作を確認できます</li>
              <li>タイトル、目的、内容を入力してください</li>
              <li>「記事を生成する」ボタンをクリックすると、AIが最適な記事を作成します</li>
              <li>生成された記事をコピーして、PR TIMESに投稿してください</li>
            </ol>
          </div>
        )}
      </main>

      {/* フッター */}
      <footer className="mt-16 bg-white border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>PR TIMES ラクラク - AIでリリース記事を簡単作成</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

