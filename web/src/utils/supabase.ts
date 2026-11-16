import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || '';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = url && key ? createClient(url, key) : null;

export interface LeadSubmission {
  role_type: 'citizen' | 'business' | 'policymaker' | 'researcher';
  full_name: string;
  email: string;
  organization?: string;
  country?: string;
  primary_persona_id?: number; // 1..6
  primary_persona_name?: string;
  dashboard_notes?: string;
  gdpr_consent: boolean;
}

export async function saveLead(lead: LeadSubmission) {
  if (!supabase) {
    console.info('Supabase not configured yet; lead captured locally:', lead);
    return { error: null };
  }
  return await supabase.from('leads').insert([lead]);
}
