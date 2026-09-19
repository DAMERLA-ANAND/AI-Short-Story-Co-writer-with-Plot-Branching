import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import {
  GeneratedSceneOutput,
  GeneratedSceneOutputSchema,
} from '@plotweaver/shared';
import {
  StoryGenerationProvider,
  OpeningSceneInput,
  ContinuationSceneInput,
} from './story-generation.provider.js';

export interface GeminiProviderOptions {
  apiKey?: string;
  modelName?: string; // default: 'gemini-3.5-flash'
}

const CANDIDATE_MODELS = ['gemini-3.5-flash', 'gemini-3.6-flash', 'gemini-2.5-flash'];

export class GeminiStoryProvider implements StoryGenerationProvider {
  private defaultApiKey: string;
  private modelName: string;

  constructor(options?: GeminiProviderOptions) {
    this.defaultApiKey =
      options?.apiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.LLM_API_KEY ||
      '';
    this.modelName =
      options?.modelName ||
      process.env.GEMINI_MODEL ||
      process.env.LLM_MODEL ||
      'gemini-3.5-flash';
  }

  private getClient(customKey?: string): GoogleGenerativeAI {
    const key = customKey || this.defaultApiKey;
    if (!key) {
      throw new Error(
        'Gemini API key is not configured. Please set GEMINI_API_KEY in the server environment.'
      );
    }
    return new GoogleGenerativeAI(key);
  }

  private getModel(client: GoogleGenerativeAI, modelName = this.modelName) {
    return client.getGenerativeModel({
      model: modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            sceneText: {
              type: SchemaType.STRING,
              description:
                'Rich, atmospheric, cinematic narrative prose for the current scene (3-5 evocative paragraphs, 250-450 words). Maintain deep genre ambiance.',
            },
            sceneSummary: {
              type: SchemaType.STRING,
              description: 'A 1-2 sentence concise summary of key events and dramatic tension.',
            },
            choices: {
              type: SchemaType.ARRAY,
              description: 'Exactly 3 distinct narrative choices leading down divergent paths.',
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  ordinal: {
                    type: SchemaType.INTEGER,
                    description: '1, 2, or 3',
                  },
                  archetype: {
                    type: SchemaType.STRING,
                    description: 'Must be exactly one of: CONFRONTATION, INVESTIGATION, DIVERGENCE',
                  },
                  text: {
                    type: SchemaType.STRING,
                    description: 'The proactive decision text for the protagonist.',
                  },
                  narrativeIntent: {
                    type: SchemaType.STRING,
                    description: 'Underlying dramatic stakes and consequences of this decision.',
                  },
                },
                required: ['ordinal', 'archetype', 'text', 'narrativeIntent'],
              },
            },
          },
          required: ['sceneText', 'sceneSummary', 'choices'],
        },
      },
    });
  }

  private async executeWithModelFallback<T>(
    client: GoogleGenerativeAI,
    action: (model: ReturnType<typeof this.getModel>, mName: string) => Promise<T>
  ): Promise<T> {
    const modelsToTry = [this.modelName, ...CANDIDATE_MODELS.filter((m) => m !== this.modelName)];
    let lastError: any = null;

    for (const mName of modelsToTry) {
      try {
        const model = this.getModel(client, mName);
        return await action(model, mName);
      } catch (err: any) {
        lastError = err;
        const msg = err?.message || String(err);
        console.warn(`[Gemini] Model ${mName} error: ${msg}. Attempting next candidate...`);
        // Continue to try next candidate
      }
    }
    throw lastError;
  }

  async generateOpening(
    input: OpeningSceneInput,
    apiKeyOverride?: string
  ): Promise<GeneratedSceneOutput> {
    const client = this.getClient(apiKeyOverride);

    const prompt = `You are a world-class literary fiction author and cinematic master novelist.
Generate the captivating opening chapter for this interactive branching narrative:

[STORY SPECIFICATION]
Title: "${input.title}"
Genre: ${input.genre.toUpperCase()}
Tone & Atmosphere: ${input.tone}
Core Premise: ${input.premise}
Genre Directives: ${input.aiGuidance}

[INSTRUCTIONS]
1. Open *in media res* or at a compelling inciting incident.
2. Establish vivid sensory atmosphere, authentic world details, and visceral tension.
3. Craft 3 radically different archetypal paths forward:
   - Option 1 (CONFRONTATION): Direct, bold, high-stakes action or facing tension head-on.
   - Option 2 (INVESTIGATION): Analytical, observant, unearthing clues, exploring secrecy.
   - Option 3 (DIVERGENCE): Unconventional, radical pivot, stealth, or unexpected shift in priority.
`;

    return this.executeWithModelFallback(client, async (model) => {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const rawJson = JSON.parse(text);
      return GeneratedSceneOutputSchema.parse(rawJson);
    });
  }

  async generateContinuation(
    input: ContinuationSceneInput,
    apiKeyOverride?: string
  ): Promise<GeneratedSceneOutput> {
    const client = this.getClient(apiKeyOverride);

    const historyFormatted = input.ancestralHistory
      .map(
        (h) =>
          `[Chapter Depth ${h.depth}${h.choiceTakenLeadingHere ? ` | Chosen: "${h.choiceTakenLeadingHere}"` : ''}]\n${h.content}`
      )
      .join('\n\n---\n\n');

    const prompt = `You are a world-class literary fiction author and cinematic master novelist.
Continue this interactive branching narrative seamlessly based on the user's explicit decision:

[STORY CONTEXT]
Story Title: "${input.title}"
Genre: ${input.genre.toUpperCase()}
Tone & Atmosphere: ${input.tone}
Premise: ${input.premise}
Genre Directives: ${input.aiGuidance}

[CHRONOLOGICAL ANCESTRAL TIMELINE LEADING HERE]
${historyFormatted}

[CURRENT DECISION TAKEN BY PROTAGONIST]
Choice: "${input.selectedChoice.text}"
Archetype: ${input.selectedChoice.archetype}
Narrative Intent: ${input.selectedChoice.narrativeIntent}

[INSTRUCTIONS]
1. Directly realize the immediate, high-stakes consequences of this specific choice.
2. NEVER repeat the previous scene; advance the narrative momentum with intense sensory immersion.
3. Keep strict narrative continuity with previous choices in this branch.
4. Conclude the scene at a new dilemma with exactly 3 new divergent choices (CONFRONTATION, INVESTIGATION, DIVERGENCE).
`;

    return this.executeWithModelFallback(client, async (model) => {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const rawJson = JSON.parse(text);
      return GeneratedSceneOutputSchema.parse(rawJson);
    });
  }

  async generateContinuationStream(
    input: ContinuationSceneInput,
    onChunk: (chunk: string) => void,
    apiKeyOverride?: string
  ): Promise<GeneratedSceneOutput> {
    const client = this.getClient(apiKeyOverride);

    const historyFormatted = input.ancestralHistory
      .map(
        (h) =>
          `[Chapter Depth ${h.depth}${h.choiceTakenLeadingHere ? ` | Chosen: "${h.choiceTakenLeadingHere}"` : ''}]\n${h.content}`
      )
      .join('\n\n---\n\n');

    const prompt = `You are a world-class literary fiction author and cinematic master novelist.
Continue this interactive branching narrative seamlessly based on the user's explicit decision:

[STORY CONTEXT]
Story Title: "${input.title}"
Genre: ${input.genre.toUpperCase()}
Tone & Atmosphere: ${input.tone}
Premise: ${input.premise}
Genre Directives: ${input.aiGuidance}

[CHRONOLOGICAL ANCESTRAL TIMELINE LEADING HERE]
${historyFormatted}

[CURRENT DECISION TAKEN BY PROTAGONIST]
Choice: "${input.selectedChoice.text}"
Archetype: ${input.selectedChoice.archetype}
Narrative Intent: ${input.selectedChoice.narrativeIntent}

[INSTRUCTIONS]
1. Directly realize the immediate consequences of this specific choice.
2. Advance the plot with vivid atmospheric prose.
3. Conclude with exactly 3 new divergent choices (CONFRONTATION, INVESTIGATION, DIVERGENCE).
`;

    return this.executeWithModelFallback(client, async (model) => {
      const result = await model.generateContentStream(prompt);

      let accumulated = '';
      let inSceneText = false;
      let hasFinishedSceneText = false;
      let sceneTextEmittedIndex = 0;

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (!chunkText) continue;
        accumulated += chunkText;

        if (!inSceneText && !hasFinishedSceneText) {
          const match = accumulated.match(/"sceneText"\s*:\s*"/);
          if (match && match.index !== undefined) {
            inSceneText = true;
            sceneTextEmittedIndex = match.index + match[0].length;
          }
        }

        if (inSceneText) {
          let endQuoteIndex = -1;
          for (let i = sceneTextEmittedIndex; i < accumulated.length; i++) {
            if (accumulated[i] === '"' && accumulated[i - 1] !== '\\') {
              endQuoteIndex = i;
              break;
            }
          }

          const endIndex = endQuoteIndex !== -1 ? endQuoteIndex : accumulated.length;
          if (endIndex > sceneTextEmittedIndex) {
            const rawSlice = accumulated.slice(sceneTextEmittedIndex, endIndex);
            const cleaned = rawSlice
              .replace(/\\n/g, '\n')
              .replace(/\\"/g, '"')
              .replace(/\\\\/g, '\\');
            onChunk(cleaned);
            sceneTextEmittedIndex = endIndex;
          }

          if (endQuoteIndex !== -1) {
            inSceneText = false;
            hasFinishedSceneText = true;
          }
        }
      }

      const response = await result.response;
      const text = response.text();
      const rawJson = JSON.parse(text);
      return GeneratedSceneOutputSchema.parse(rawJson);
    });
  }
}
