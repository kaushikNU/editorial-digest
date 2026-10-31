'use client';

import React, { useState } from 'react';
import { X, Key, Sparkles, Check, Info } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(inputKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center p-3 sm:p-4 items-center">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden flex flex-col font-sans-ui">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-sm">Settings & AI Configuration</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 text-stone-800">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Gemini API Key (Optional)</span>
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800 focus:bg-white text-stone-900"
            />
            <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">
              Without an API key, the system runs an intelligent local heuristic summarizer. Enter a Gemini API Key to enable deeper synthesis powered by Gemini 2.5 Flash.
            </p>
          </div>

          <div className="rounded-xl bg-stone-50 p-3.5 border border-stone-200 text-xs text-stone-600 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-stone-800">
              <Info className="w-3.5 h-3.5 text-stone-500" />
              <span>Included Major Newspapers</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              <strong>India:</strong> The Hindu (Editorials, Lead & Columns), The Indian Express (Editorials & Columns), Livemint, Hindustan Times.
            </p>
            <p className="text-[11px] leading-relaxed">
              <strong>Global:</strong> The Guardian (Editorials & Comment is Free), The New York Times (Opinion), Project Syndicate, The Atlantic (Ideas).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-sm"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Settings</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
