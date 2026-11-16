import { PERSONA_GUIDELINES } from '../data/personaGuidelines';

export interface AuditPayload {
  imageBase64?: string;
  dashboardUrl?: string;
  selectedFeatures: string[];
  notes: string;
}

export interface AiAuditResponse {
  summary: string;
  visualFindings: string[];
  priorityRecommendations: string[];
}

export async function runMultimodalDashboardAudit(
  payload: AuditPayload
): Promise<AiAuditResponse | null> {
  const endpoint = import.meta.env.VITE_AUDIT_API_URL;
  if (!endpoint) return null;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        personas: Object.values(PERSONA_GUIDELINES),
      }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
