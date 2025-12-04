export type PurposeType = 
  | 'company-announcement'  // 会社の発表
  | 'event-announcement'     // イベント告知
  | 'tool-announcement'      // ツール発表
  | 'conversion'             // コンバージョン目的
  | 'product-launch'         // 製品リリース
  | 'partnership'            // パートナーシップ
  | 'other';                 // その他

export interface ArticleFormData {
  title: string;
  purpose: PurposeType;
  content: string;
}

export interface GeneratedArticle {
  title: string;
  body: string;
  summary: string;
  keywords: string[];
}

export const PURPOSE_OPTIONS: { value: PurposeType; label: string; description: string }[] = [
  { 
    value: 'company-announcement', 
    label: '会社の発表', 
    description: '新規事業、組織変更、経営方針などの会社発表' 
  },
  { 
    value: 'event-announcement', 
    label: 'イベント告知', 
    description: 'セミナー、展示会、ウェビナーなどのイベント告知' 
  },
  { 
    value: 'tool-announcement', 
    label: 'ツール発表', 
    description: '新サービス、アプリ、ソフトウェアのリリース' 
  },
  { 
    value: 'conversion', 
    label: 'コンバージョン目的', 
    description: '商品・サービスの購入・登録を促進する記事' 
  },
  { 
    value: 'product-launch', 
    label: '製品リリース', 
    description: '新製品の発売・リリース告知' 
  },
  { 
    value: 'partnership', 
    label: 'パートナーシップ', 
    description: '他社との提携・協業の発表' 
  },
  { 
    value: 'other', 
    label: 'その他', 
    description: '上記以外の目的' 
  },
];

