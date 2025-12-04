import React from 'react';
import { ArticleFormData } from '../types';
import { SAMPLE_DATA } from '../utils/sampleData';

interface TrySampleButtonProps {
  onLoadSample: (data: ArticleFormData) => void;
}

export const TrySampleButton: React.FC<TrySampleButtonProps> = ({ onLoadSample }) => {
  const handleClick = () => {
    onLoadSample(SAMPLE_DATA);
  };

  return (
    <button
      onClick={handleClick}
      className="btn-secondary text-sm"
      type="button"
    >
      🎯 お試しボタン
    </button>
  );
};

