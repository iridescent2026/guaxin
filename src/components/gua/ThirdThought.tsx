'use client';

import { useState } from 'react';
import type { ThoughtSession } from '@/types';
import { getCategory } from '@/data/categories';

interface ThirdThoughtProps {
  session: ThoughtSession;
  onSave: (reflection: string) => void;
}

export function ThirdThought({ session, onSave }: ThirdThoughtProps) {
  const [reflection, setReflection] = useState('');
  const [saved, setSaved] = useState(false);

  const category = session.category ? getCategory(session.category) : null;
  const subCategory = category?.subCategories.find(
    (s) => s.value === session.subCategory
  );

  const handleSave = () => {
    if (!reflection.trim()) return;
    onSave(reflection);
    setSaved(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-800 mb-1">变成自己的</h2>
        <p className="text-sm text-gray-500">
          前面是古人的智慧，现在轮到你给自己写点什么
        </p>
      </div>

      {/* Journey summary */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
        <p className="text-xs text-gray-400 font-medium">你的思考路径</p>
        <p className="text-sm text-gray-700">
          {category?.emoji} {category?.label}
          {subCategory && ' · '}
        </p>
        {session.quote && (
          <div className="border-t border-gray-200 pt-1.5 mt-1.5">
            <p className="text-xs text-amber-600">触动你的那句话</p>
            <p className="text-sm text-gray-600 italic">
              &ldquo;{session.quote.original}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Reflection prompt */}
      {session.quote && (
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
          <p className="text-sm text-purple-700 font-medium mb-1">
            💭 试着问问自己
          </p>
          <p className="text-sm text-purple-600">
            这段智慧，跟你现在的处境有什么联系？你从中学到了什么？
          </p>
        </div>
      )}

      {!saved ? (
        <>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="写给自己看的一段话……不需要完美，写下真实的感受就好。"
            rows={5}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none text-gray-700 text-sm"
            maxLength={500}
          />
          <p className="text-right text-xs text-gray-400 -mt-4">
            {reflection.length} / 500
          </p>

          <button
            onClick={handleSave}
            disabled={!reflection.trim()}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✨ 保存到我的记录
          </button>
        </>
      ) : (
        <div className="text-center py-8 space-y-4 animate-fade-in">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">✓</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800">记录已保存</h3>
          <p className="text-sm text-gray-500">
            你的每一次思考，都是对自己的认真对待。
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-block py-3 px-8 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all"
          >
            再来一次
          </button>
        </div>
      )}
    </div>
  );
}
