import React, { useState } from 'react';
import { X, Key, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { apiKey, setCustomApiKey } = useAuth();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomApiKey(inputKey.trim() || null);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setInputKey('');
    setCustomApiKey(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#0e111a]/95 border border-white/10 shadow-2xl shadow-cyan-950/30 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Gemini 1.5 API Key
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h2>
            <p className="text-xs text-zinc-400">
              Direct high-speed streaming prose generation
            </p>
          </div>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed mb-4">
          PlotWeaver uses <strong>Google Gemini 1.5 Flash & Pro</strong> for ultra-dynamic branching prose.
          You can provide your personal API key below, or leave it blank to utilize the server environment key / demo safety engine.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
              Google AI Studio API Key
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 placeholder:text-zinc-600 transition"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-cyan-400 hover:underline"
            >
              Get a free Gemini API key <ExternalLink className="w-3 h-3" />
            </a>
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="text-red-400 hover:underline text-[11px]"
              >
                Clear Key
              </button>
            )}
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-medium text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20"
            >
              {saved ? (
                <>
                  <CheckCircle className="w-4 h-4" /> Saved!
                </>
              ) : (
                'Save Key'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
