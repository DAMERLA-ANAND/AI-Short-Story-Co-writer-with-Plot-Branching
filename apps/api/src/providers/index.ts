import { StoryGenerationProvider } from './story-generation.provider.js';
import { MockStoryProvider } from './mock.provider.js';
import { UniversalLLMProvider } from './universal-llm.provider.js';
import { GeminiStoryProvider } from './gemini.provider.js';
import { env } from '../config/env.js';

export * from './story-generation.provider.js';
export * from './mock.provider.js';
export * from './universal-llm.provider.js';
export * from './gemini.provider.js';

export class FailSafeStoryProvider implements StoryGenerationProvider {
  private primary: StoryGenerationProvider;
  private fallback: StoryGenerationProvider;

  constructor(primary: StoryGenerationProvider, fallback: StoryGenerationProvider) {
    this.primary = primary;
    this.fallback = fallback;
  }

  async generateOpening(params: Parameters<StoryGenerationProvider['generateOpening']>[0]) {
    try {
      return await this.primary.generateOpening(params);
    } catch (err: any) {
      console.warn(
        `[Demo Safety Switch] Primary AI encountered an issue: "${err?.message || err}". Seamlessly falling back to Mock Story Engine for zero-interruption demo!`
      );
      return await this.fallback.generateOpening(params);
    }
  }

  async generateContinuation(params: Parameters<StoryGenerationProvider['generateContinuation']>[0]) {
    try {
      return await this.primary.generateContinuation(params);
    } catch (err: any) {
      console.warn(
        `[Demo Safety Switch] Primary AI encountered an issue: "${err?.message || err}". Seamlessly falling back to Mock Story Engine for zero-interruption demo!`
      );
      return await this.fallback.generateContinuation(params);
    }
  }
}

export function getStoryProvider(customApiKey?: string | null): StoryGenerationProvider {
  const mock = new MockStoryProvider();

  // 1. If custom API key or server Gemini key exists, prioritize native Gemini 1.5
  const geminiKey = customApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (geminiKey) {
    const gemini = new GeminiStoryProvider({ apiKey: geminiKey });
    return new FailSafeStoryProvider(gemini, mock);
  }

  // 2. If OpenAI/Universal provider is requested
  if (env.LLM_PROVIDER === 'universal' && env.LLM_API_KEY) {
    const universal = new UniversalLLMProvider();
    return new FailSafeStoryProvider(universal, mock);
  }

  // 3. High quality local mock fallback
  return mock;
}

