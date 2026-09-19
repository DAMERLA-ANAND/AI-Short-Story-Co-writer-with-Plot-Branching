import { GenreId } from '@plotweaver/shared';
import { GENRE_ATMOSPHERES } from '../../data/genreAtmospheres';

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: { stop?: () => void; disconnect: () => void }[] = [];
  private isPlaying = false;
  private currentVolume = 0.3;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(volume: number) {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.currentVolume, this.ctx.currentTime, 0.1);
    }
  }

  public stop() {
    this.activeNodes.forEach((n) => {
      try {
        if (n.stop) n.stop();
        n.disconnect();
      } catch {}
    });
    this.activeNodes = [];
    this.isPlaying = false;
  }

  public play(genreId: GenreId) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stop();
    this.isPlaying = true;

    const atmosphere = GENRE_ATMOSPHERES[genreId] || GENRE_ATMOSPHERES.detective;
    const { type, baseFrequency } = atmosphere.soundscape;

    const ctx = this.ctx;
    const now = ctx.currentTime;

    if (type === 'rain') {
      // Pink noise generator with bandpass filter for realistic rain
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.03;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(baseFrequency * 3, now);

      whiteNoise.connect(filter);
      filter.connect(this.masterGain);
      whiteNoise.start();

      this.activeNodes.push(whiteNoise, filter);
    } else {
      // Cinematic Multi-Oscillator Drone with LFO pulse
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      osc1.type = type === 'eerie' ? 'sawtooth' : 'sine';
      osc1.frequency.setValueAtTime(baseFrequency, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(baseFrequency * 1.5, now); // perfect fifth

      lfo.frequency.setValueAtTime(0.2, now); // slow breathing sweep
      lfoGain.gain.setValueAtTime(15, now);

      lfo.connect(osc1.frequency);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(baseFrequency * 4, now);

      const droneGain = ctx.createGain();
      droneGain.gain.setValueAtTime(0.18, now);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(this.masterGain);

      osc1.start();
      osc2.start();
      lfo.start();

      this.activeNodes.push(osc1, osc2, lfo, lfoGain, filter, droneGain);
    }
  }

  public getStatus() {
    return {
      isPlaying: this.isPlaying,
      volume: this.currentVolume,
    };
  }
}

export const ambientAudio = new AmbientSoundEngine();
