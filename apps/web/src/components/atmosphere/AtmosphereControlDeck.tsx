import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Eye, Moon, Sliders } from 'lucide-react';
import { GenreId } from '@plotweaver/shared';
import { ambientAudio } from './AmbientAudioEngine';
import { GENRE_ATMOSPHERES } from '../../data/genreAtmospheres';

interface AtmosphereControlDeckProps {
  genreId: GenreId;
  dimmerOpacity: number;
  onDimmerChange: (val: number) => void;
  isZenMode: boolean;
  onToggleZenMode: () => void;
}

export const AtmosphereControlDeck: React.FC<AtmosphereControlDeckProps> = ({
  genreId,
  dimmerOpacity,
  onDimmerChange,
  isZenMode,
  onToggleZenMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [volume, setVolume] = useState(0.35);

  const atmosphere = GENRE_ATMOSPHERES[genreId] || GENRE_ATMOSPHERES.detective;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      ambientAudio.stop();
    };
  }, []);

  // Switch soundscape when genre changes if already playing
  useEffect(() => {
    if (isPlayingAudio) {
      ambientAudio.play(genreId);
    }
  }, [genreId, isPlayingAudio]);

  const toggleAudio = () => {
    if (isPlayingAudio) {
      ambientAudio.stop();
      setIsPlayingAudio(false);
    } else {
      ambientAudio.setVolume(volume);
      ambientAudio.play(genreId);
      setIsPlayingAudio(true);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    ambientAudio.setVolume(newVol);
    if (!isPlayingAudio && newVol > 0) {
      ambientAudio.play(genreId);
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="relative z-40">
      {/* Trigger Button Pill */}
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#12151e]/80 border border-white/10 backdrop-blur-md shadow-lg shadow-black/40">
        <button
          onClick={toggleAudio}
          title={isPlayingAudio ? 'Mute Atmosphere Soundscape' : 'Play Ambient Soundscape'}
          className={`p-1.5 rounded-full transition-all duration-200 ${
            isPlayingAudio
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {isPlayingAudio ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={onToggleZenMode}
          title={isZenMode ? 'Exit Zen Mode (Esc)' : 'Enter Zen Immersion Mode (F11)'}
          className={`p-1.5 rounded-full transition-all duration-200 ${
            isZenMode
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          title="Atmospheric Cinema Controls"
          className={`p-1.5 rounded-full transition-all duration-200 ${
            isOpen
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Control Popover Drawer */}
      {isOpen && (
        <div className="absolute right-0 top-11 w-72 p-4 rounded-2xl bg-[#0c0e14]/95 border border-white/15 backdrop-blur-2xl shadow-2xl shadow-black/80 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div>
              <div className="text-xs font-semibold text-white tracking-wide uppercase">Atmosphere Engine</div>
              <div className="text-[11px] text-zinc-400 truncate">{atmosphere.soundscape.description}</div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              PRO
            </span>
          </div>

          {/* Dimmer Control */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-zinc-300">
              <span className="flex items-center gap-1.5">
                <Moon className="w-3 h-3 text-zinc-400" /> Cinema Dimmer
              </span>
              <span className="font-mono text-[10px] text-zinc-400">
                {Math.round(dimmerOpacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.25"
              max="0.95"
              step="0.05"
              value={dimmerOpacity}
              onChange={(e) => onDimmerChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Soundscape Volume */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-zinc-300">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3 h-3 text-zinc-400" /> Soundscape Volume
              </span>
              <span className="font-mono text-[10px] text-zinc-400">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          <div className="pt-1 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500">
            <span>Hardware Accelerated</span>
            <span>Zero-Latency WebAudio</span>
          </div>
        </div>
      )}
    </div>
  );
};
