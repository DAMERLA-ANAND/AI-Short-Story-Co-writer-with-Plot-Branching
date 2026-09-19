import type {
  StorySnapshotSummaryDto,
  StorySnapshotWorkspaceDto,
} from '@plotweaver/shared';

const BASE_URL = '/api/snapshots';
const STORIES_URL = '/api/stories';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson?.error?.message) {
        errorMessage = errJson.error.message;
      }
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }
  return res.json() as Promise<T>;
}

export async function storeStorySnapshot(storyId: string): Promise<StorySnapshotSummaryDto> {
  const res = await fetch(`${STORIES_URL}/${encodeURIComponent(storyId)}/store`, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
  });
  return handleResponse<StorySnapshotSummaryDto>(res);
}

export async function listSnapshots(): Promise<StorySnapshotSummaryDto[]> {
  const res = await fetch(BASE_URL, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  return handleResponse<StorySnapshotSummaryDto[]>(res);
}

export async function getSnapshot(snapshotId: string): Promise<StorySnapshotWorkspaceDto> {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(snapshotId)}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  return handleResponse<StorySnapshotWorkspaceDto>(res);
}

export async function forkSnapshot(snapshotId: string): Promise<{ storyId: string }> {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(snapshotId)}/fork`, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
  });
  return handleResponse<{ storyId: string }>(res);
}

export async function deleteSnapshot(snapshotId: string): Promise<{ success: boolean; deletedSnapshotId: string }> {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(snapshotId)}`, {
    method: 'DELETE',
    headers: { 'Accept': 'application/json' },
  });
  return handleResponse<{ success: boolean; deletedSnapshotId: string }>(res);
}

export function getExportUrl(storyId: string, format: 'markdown' | 'pdf'): string {
  return `${STORIES_URL}/${encodeURIComponent(storyId)}/export?format=${format}`;
}
