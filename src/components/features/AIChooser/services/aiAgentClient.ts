import { AIChooserRequestPayload, AIChooserResponsePayload } from '../types';

/**
 * Communicates with the AI Chooser API endpoint
 */
export async function fetchAIRecommendations(
  payload: AIChooserRequestPayload
): Promise<AIChooserResponsePayload> {
  const response = await fetch('/api/ai-chooser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorDetails = '';
    try {
      const errJson = await response.json();
      errorDetails = errJson.error || errJson.message || '';
    } catch {
      // ignore
    }
    throw new Error(errorDetails || `Failed to fetch AI recommendations (HTTP ${response.status})`);
  }

  const data: AIChooserResponsePayload = await response.json();
  return data;
}
