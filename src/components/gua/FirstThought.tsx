'use client';

import { useState } from 'react';
import { CATEGORIES } from '@/data/categories';
import { MOODS } from '@/constants';
import type { Category, Duration, Mood } from '@/types';

interface FirstThoughtProps {
  onComplete: (data: {
    category: Category;
    subCategory: string;
    duration: Duration;
    mood: Mood;
  }) => void;
}

export function FirstThought({ onComplete }: FirstThoughtProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<Duration | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  const category = CATEGORIES.find((c) => c.value === selectedCategory);
  const canProceed =
    selectedCategory && selectedSub && selectedDuration && selectedMood;

  const handleProceed = () => {
    if (!canProceed) return;
    onComplete({
      category: selectedCategory,
      subCategory: selectedSub,
      duration: selectedDuration,
      mood: selectedMood,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Step 1 */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">
          你现在最想聊聊哪个方面？
        </h2>
        <p className="text-sm text-gray-500 mb-4">选一个，没有对错</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setSelectedCategory(cat.value);
                setSelectedSub(null);
              }}
              className="p-4 rounded-xl text-center transition-all"
            >
              <span className="text-2xl block mb-1">{cat.emoji}</span>
              <span className="font-medium text-sm">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 */}
      {selectedCategory && category && (
        <div className="animate-fade-in">
          <h3 className="text-base font-bold text-gray-800 mb-1">
            具体是哪种情况？
          </h3>
          <p className="text-sm text-gray-500 mb-3">{category.guide}</p>
          <div className="space-y-2">
            {category.subCategories.map((sub) => (
              <button
                key={sub.value}
                onClick={() => {
                  setSelectedSub(sub.value);
                  setSelectedDuration(null);
                }}
                className="w-full text-left p-3 rounded-lg border transition-all"
              >
                <span className="font-medium text-sm">{sub.label}</span>
                {selectedSub === sub.value && (
                  <p className="text-xs text-purple-500 mt-1">{sub.prompt}</p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 */}
      {selectedSub && (
        <div className="animate-fade-in">
          <h3 className="text-base font-bold text-gray-800 mb-3">
            这种感觉持续多久了？
          </h3>
          <div className="flex gap-3">
            {[
              { value: 'recent' as Duration, label: '就这几天', desc: '即时情绪' },
              { value: 'ongoing' as Duration, label: '有一阵子了', desc: '持续困扰' },
              { value: 'recurring' as Duration, label: '反复出现', desc: '深层课题' },
            ].map((d) => (
              <button
                key={d.value}
                onClick={() => setSelectedDuration(d.value)}
                className="flex-1 p-3 rounded-xl text-center transition-all"
              >
                <span className="block font-medium text-sm">{d.label}</span>
                <span className="block text-xs mt-0.5 opacity-70">{d.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4 */}
      {selectedDuration && (
        <div className="animate-fade-in">
          <h3 className="text-base font-bold text-gray-800 mb-3">
            你现在的心情？
          </h3>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m.value}
                onClick={() => setSelectedMood(m.value)}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm transition-all"
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {canProceed && (
        <div className="animate-fade-in pt-2">
          <button
            onClick={handleProceed}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
          >
            进入第二思：翻开智慧 →
          </button>
        </div>
      )}
    </div>
  );
}
