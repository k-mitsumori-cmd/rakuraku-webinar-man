import React, { useState, useEffect } from 'react';
import { ArticleFormData, PurposeType, PURPOSE_OPTIONS } from '../types';
import { TrySampleButton } from './TrySampleButton';

interface ArticleFormProps {
  onSubmit: (data: ArticleFormData) => void;
  onLoadSample: (data: ArticleFormData) => void;
  initialData?: ArticleFormData;
}

export const ArticleForm: React.FC<ArticleFormProps> = ({ 
  onSubmit, 
  onLoadSample,
  initialData 
}) => {
  const [formData, setFormData] = useState<ArticleFormData>(
    initialData || {
      title: '',
      purpose: 'company-announcement',
      content: ''
    }
  );

  // initialDataが変更されたときにフォームを更新
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.content.trim()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof ArticleFormData, value: string | PurposeType) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-prtimes-dark">記事情報を入力</h2>
        <TrySampleButton onLoadSample={onLoadSample} />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
          タイトル <span className="text-prtimes-red">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="例: 新サービス「○○」をリリース"
          className="input-field"
          required
        />
      </div>

      <div>
        <label htmlFor="purpose" className="block text-sm font-semibold text-gray-700 mb-2">
          目的 <span className="text-prtimes-red">*</span>
        </label>
        <select
          id="purpose"
          value={formData.purpose}
          onChange={(e) => handleChange('purpose', e.target.value as PurposeType)}
          className="input-field"
          required
        >
          {PURPOSE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label} - {option.description}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {PURPOSE_OPTIONS.find(p => p.value === formData.purpose)?.description}
        </p>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
          内容 <span className="text-prtimes-red">*</span>
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder="リリース記事の内容を入力してください。会社名、日付、詳細情報などを含めてください。"
          rows={10}
          className="input-field resize-none"
          required
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.content.length} 文字
        </p>
      </div>

      <button
        type="submit"
        className="btn-primary w-full"
        disabled={!formData.title.trim() || !formData.content.trim()}
      >
        ✨ 記事を生成する
      </button>
    </form>
  );
};

