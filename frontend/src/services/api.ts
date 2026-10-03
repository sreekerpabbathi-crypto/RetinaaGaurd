// API Base Client with safe error handling and mock data fallback

const API_BASE_URL = '/api/v1';

export async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as T;
  } catch (err) {
    console.warn(`[RetinaGuard API] Request to ${url} failed or backend offline. Fallback will be used if configured.`, err);
    throw err;
  }
}
