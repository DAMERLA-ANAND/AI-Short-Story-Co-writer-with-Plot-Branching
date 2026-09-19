import {
  ChoiceArchetype,
  GeneratedSceneOutput,
} from '@plotweaver/shared';

export interface OpeningSceneInput {
  title: string;
  genre: string;
  tone: string;
  premise: string;
  aiGuidance: string;
}

export interface ContinuationSceneInput {
  title: string;
  genre: string;
  tone: string;
  premise: string;
  aiGuidance: string;
  selectedChoice: {
    text: string;
    archetype: ChoiceArchetype;
    narrativeIntent: string;
  };
  ancestralHistory: Array<{
    depth: number;
    choiceTakenLeadingHere?: string;
    content: string;
  }>;
}

export interface StoryGenerationProvider {
  generateOpening(input: OpeningSceneInput): Promise<GeneratedSceneOutput>;
  generateContinuation(input: ContinuationSceneInput): Promise<GeneratedSceneOutput>;
}
