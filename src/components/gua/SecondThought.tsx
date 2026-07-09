'use client';

import { useState, useMemo } from 'react';
import { getQuotesForCategory } from '@/data/iching-quotes';
import type { Category, IChingQuote } from '@/types';
import { RefreshCw } from 'lucide-react';

interface SecondThoughtProps {
  category: Category;
  onComplete: (quote: IChingQuote) => void;
}

export function SecondThought({ category, onComplete }: SecondThoughtProps) {
  const quotes = useMemo(() => getQuotesForCategory(category), [category]);
  const [currentIndex, setCurrentIndex] = useState(
    () => Math.floor(Math.random() * quotes.length)
  );

  const quote = quotes[currentIndex];

  const handleRotate = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  if (!quote) {
    return (
      <div className="text-center py-10 text-gray-500">
        暂未找到相关智慧内容
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-800 mb-1">翻开智慧</h2>
        <p className="text-sm text-gray-500">
          来自古籍的一段话，也许能给你一个新的视角
        </p>
      </div>

      {/* Quote Card */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
        <p className="text-xs text-amber-600 font-medium mb-3">
          📜 来自《{quote.guaName}》
        </p>

        <blockquote className="text-xl font-bold text-amber-900 leading-relaxed mb-4 text-center">
          &ldquo;{quote.original}&rdquo;
        </blockquote>

        <div className="space-y-3 text-sm">
          <p className="text-amber-800 leading-relaxed">{quote.translation}</p>
          <div className="border-t border-amber-200 pt-3">
            <p className="text-amber-700 leading-relaxed italic">
              —— {quote.insight}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {quotes.length > 1 && (
          <button
            onClick={handleRotate}
            className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            换个角度
          </button>
        )}
        <button
          onClick={() => onComplete(quote)}
          className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
        >
          进入第三思：变成自己的 →
        </button>
      </div>

      {quotes.length > 1 && (
        <p className="text-center text-xs text-gray-400">
          {currentIndex + 1} / {quotes.length} —— 没有一个&quot;唯一答案&quot;，选你最有感觉的
        </p>
      )}
    </div>
  );
}
