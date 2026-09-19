import type {
  CreateStoryRequest,
  StoryWorkspaceDto,
  ContinueStoryRequest,
  SetActiveSceneRequest,
} from '@plotweaver/shared';

const BASE_URL = '/api/stories';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  try {
    const token = localStorage.getItem('plotweaver_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const geminiKey = localStorage.getItem('plotweaver_gemini_key');
    if (geminiKey) {
      headers['x-gemini-api-key'] = geminiKey;
    }
  } catch {}
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson?.error?.message) {
        errorMessage = errJson.error.message;
      }
    } catch {}
    throw new Error(errorMessage);
  }
  return res.json() as Promise<T>;
}

export async function listStories(publicOnly?: boolean): Promise<{ stories: any[] }> {
  const url = publicOnly ? `${BASE_URL}?public=true` : BASE_URL;
  const res = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse<{ stories: any[] }>(res);
}

export async function createStory(payload: CreateStoryRequest): Promise<StoryWorkspaceDto> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<StoryWorkspaceDto>(res);
}

export async function getStoryWorkspace(storyId: string): Promise<StoryWorkspaceDto> {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(storyId)}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse<StoryWorkspaceDto>(res);
}

export async function continueStory(storyId: string, choiceId: string): Promise<StoryWorkspaceDto> {
  const payload: ContinueStoryRequest = { choiceId };
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(storyId)}/continue`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<StoryWorkspaceDto>(res);
}

export async function setActiveScene(storyId: string, sceneId: string): Promise<StoryWorkspaceDto> {
  const payload: SetActiveSceneRequest = { sceneId };
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(storyId)}/active-scene`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse<StoryWorkspaceDto>(res);
}

export async function deleteStory(storyId: string): Promise<{ success: boolean; deletedStoryId: string }> {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(storyId)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse<{ success: boolean; deletedStoryId: string }>(res);
}

