import { useState } from 'react';
import type { StoryWorkspaceDto } from '@plotweaver/shared';

export function useStoryStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState<string | null>(null);

  const streamChoice = async (
    storyId: string,
    choiceId: string,
    apiKey: string | null,
    onComplete: (workspace: StoryWorkspaceDto) => void,
    onError: (err: any) => void
  ) => {
    setIsStreaming(true);
    setStreamedText('');

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (apiKey) {
        headers['x-gemini-api-key'] = apiKey;
      }
      const token = localStorage.getItem('plotweaver_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/stories/${storyId}/continue/stream`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ choiceId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || 'Streaming failed');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('ReadableStream not supported');

      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedProse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const block of lines) {
          const trimmed = block.trim();
          if (trimmed.startsWith('event: token')) {
            const dataLine = trimmed.split('\n').find((l) => l.startsWith('data: '));
            if (dataLine) {
              const data = JSON.parse(dataLine.replace('data: ', ''));
              accumulatedProse += data.chunk;
              setStreamedText(accumulatedProse);
            }
          } else if (trimmed.startsWith('event: done')) {
            const dataLine = trimmed.split('\n').find((l) => l.startsWith('data: '));
            if (dataLine) {
              const finalWorkspace = JSON.parse(dataLine.replace('data: ', ''));
              setStreamedText(null);
              setIsStreaming(false);
              onComplete(finalWorkspace);
              return;
            }
          }
        }
      }
    } catch (err) {
      setStreamedText(null);
      setIsStreaming(false);
      onError(err);
    }
  };

  return { isStreaming, streamedText, streamChoice };
}
