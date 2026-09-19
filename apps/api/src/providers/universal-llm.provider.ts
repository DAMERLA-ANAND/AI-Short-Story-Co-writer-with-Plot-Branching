import {
  GeneratedSceneOutput,
  GeneratedSceneOutputSchema,
} from '@plotweaver/shared';
import {
  ContinuationSceneInput,
  OpeningSceneInput,
  StoryGenerationProvider,
} from './story-generation.provider.js';
import { env } from '../config/env.js';

export class UniversalLLMProvider implements StoryGenerationProvider {
  private baseUrl: string;
  private apiKey: string;
  private model: string;

  constructor() {
    this.baseUrl = (env.LLM_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai/').replace(/\/$/, '');
    this.apiKey = env.LLM_API_KEY || '';
    this.model = env.LLM_MODEL || 'gemini-2.0-flash';
  }

  private async callLLM(messages: Array<{ role: string; content: string }>): Promise<string> {
    const endpoint = `${this.baseUrl}/chat/completions`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: 0.8,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`LLM Provider HTTP ${res.status}: ${errBody}`);
    }

    const data: any = await res.json();
    return data.choices?.[0]?.message?.content || '{}';
  }

  private parseAndValidate(rawJson: string): GeneratedSceneOutput {
    const parsed = JSON.parse(rawJson);
    return GeneratedSceneOutputSchema.parse(parsed);
  }

  async generateOpening(input: OpeningSceneInput): Promise<GeneratedSceneOutput> {
    const systemPrompt = `You are the lead narrative co-writer engine for PlotWeaver.
Write an engaging, atmospheric opening scene for a short story.

LITERARY GUIDANCE (${input.genre.toUpperCase()}):
${input.aiGuidance}

STRICT JSON SCHEMA:
Return ONLY valid JSON matching this exact structure:
{
  "sceneText": "350-480 words of vivid opening prose establishing setting, character, conflict, and tension. High literary quality.",
  "sceneSummary": "40-75 words capturing the essential starting situation, introduced characters, and key discoveries.",
  "choices": [
    {
      "ordinal": 1,
      "archetype": "CONFRONTATION",
      "text": "Direct action, high stakes, physical or verbal confrontation.",
      "narrativeIntent": "Immediate conflict and escalation."
    },
    {
      "ordinal": 2,
      "archetype": "INVESTIGATION",
      "text": "Observant tactical move, searching for clues, uncovering secrets.",
      "narrativeIntent": "Pacing shift to deduction and lore discovery."
    },
    {
      "ordinal": 3,
      "archetype": "DIVERGENCE",
      "text": "Radical shift, unexpected moral dilemma, emotional pivot, or surprise route.",
      "narrativeIntent": "Unforeseen plot turn breaking routine assumptions."
    }
  ]
}
Do NOT provide choices that are mere phrasing variations of the same action.`;

    const userPrompt = `Title: ${input.title}
Genre: ${input.genre}
Tone: ${input.tone}
Premise: ${input.premise}

Begin the story.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const rawResponse = await this.callLLM(messages);

    try {
      return this.parseAndValidate(rawResponse);
    } catch (validationErr: any) {
      // 1-Shot Auto-Repair Loop
      console.warn('[LLM Provider] Validation failed on opening, triggering repair:', validationErr.message);
      const repairMessages = [
        ...messages,
        { role: 'assistant', content: rawResponse },
        {
          role: 'user',
          content: `Your previous JSON output failed validation: ${validationErr.message}. Correct the JSON immediately to match the strict schema. Return only valid JSON.`,
        },
      ];
      const repairedResponse = await this.callLLM(repairMessages);
      return this.parseAndValidate(repairedResponse);
    }
  }

  async generateContinuation(input: ContinuationSceneInput): Promise<GeneratedSceneOutput> {
    const historyText = input.ancestralHistory
      .map(
        (h) =>
          `[Scene Depth ${h.depth}${h.choiceTakenLeadingHere ? ` | Chosen: "${h.choiceTakenLeadingHere}"` : ''}]:\n${h.content}`
      )
      .join('\n\n');

    const systemPrompt = `You are the lead narrative co-writer engine for PlotWeaver.
Write the continuation scene based on the ancestral story lineage and the newly selected choice.

WORLD CONSISTENCY DIRECTIVE:
- Keep character names, physical traits, locations, and established facts strictly consistent with prior scenes.
- Do not introduce contradictory lore or alter established character knowledge arbitrarily.

LITERARY GUIDANCE (${input.genre.toUpperCase()}):
${input.aiGuidance}

STRICT JSON SCHEMA:
Return ONLY valid JSON matching this exact structure:
{
  "sceneText": "350-480 words of vivid continuation prose resolving the chosen action and presenting new complications.",
  "sceneSummary": "40-75 words summarizing irreversible events, consequences, and new stakes in this scene.",
  "choices": [
    {
      "ordinal": 1,
      "archetype": "CONFRONTATION",
      "text": "Direct action or high stakes clash.",
      "narrativeIntent": "Immediate conflict."
    },
    {
      "ordinal": 2,
      "archetype": "INVESTIGATION",
      "text": "Investigative or tactical move.",
      "narrativeIntent": "Clue gathering and deduction."
    },
    {
      "ordinal": 3,
      "archetype": "DIVERGENCE",
      "text": "Surprise tactical or emotional pivot.",
      "narrativeIntent": "Radical plot divergence."
    }
  ]
}
Choices MUST be sharply distinct from one another.`;

    const userPrompt = `Story Title: ${input.title}
Premise: ${input.premise}
Genre: ${input.genre} | Tone: ${input.tone}

=== ANCESTRAL STORY SO FAR ===
${historyText}

=== NEWLY CHOSEN ACTION ===
"${input.selectedChoice.text}" (Archetype: ${input.selectedChoice.archetype})
Direction: ${input.selectedChoice.narrativeIntent}

Write the next scene.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const rawResponse = await this.callLLM(messages);

    try {
      return this.parseAndValidate(rawResponse);
    } catch (validationErr: any) {
      console.warn('[LLM Provider] Validation failed on continuation, triggering repair:', validationErr.message);
      const repairMessages = [
        ...messages,
        { role: 'assistant', content: rawResponse },
        {
          role: 'user',
          content: `Your previous JSON output failed validation: ${validationErr.message}. Correct the JSON immediately to match the strict schema. Return only valid JSON.`,
        },
      ];
      const repairedResponse = await this.callLLM(repairMessages);
      return this.parseAndValidate(repairedResponse);
    }
  }
}
