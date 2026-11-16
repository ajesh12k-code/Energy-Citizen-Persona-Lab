import React, { useState } from 'react';
import { Send, ShieldCheck } from 'lucide-react';
import { LeadSubmission, saveLead } from '../utils/supabase';

interface LeadFormProps {
  defaultRole: LeadSubmission['role_type'];
  requireOrg?: boolean;
  country?: string;
  personaId?: number;
  personaName?: string;
  dashboardNotes?: string;
  title: string;
  subtitle: string;
  buttonText: string;
  onSuccess?: () => void;
}

export function LeadForm({
  defaultRole,
  requireOrg = false,
  country,
  personaId,
  personaName,
  dashboardNotes,
  title,
  subtitle,
  buttonText,
  onSuccess,
}: LeadFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [roleType, setRoleType] = useState<LeadSubmission['role_type']>(defaultRole);
  const [consent, setConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent || !email || !fullName) return;
    setSaving(true);
    await saveLead({
      role_type: roleType,
      full_name: fullName,
      email,
      organization: organization || undefined,
      country,
      primary_persona_id: personaId,
      primary_persona_name: personaName,
      dashboard_notes: dashboardNotes,
      gdpr_consent: consent,
    });
    setSaving(false);
    setSaved(true);
    onSuccess?.();
  };

  if (saved) {
    return (
      <div className="bg-slate-900 text-emerald-400 p-5 rounded-xl flex items-center gap-3 font-medium text-sm">
        <ShieldCheck className="w-6 h-6 shrink-0" />
        <span>Thank you! Your contact details are safely stored. Dr. Ajesh Kumar will connect with you soon.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900 text-white p-6 rounded-xl space-y-4">
      <div>
        <h4 className="font-semibold text-lg">{title}</h4>
        <p className="text-xs text-slate-300 mt-0.5">{subtitle}</p>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
        <input
          type="text"
          required
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white"
        />
        <input
          type="email"
          required
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white"
        />
        <input
          type="text"
          required={requireOrg}
          placeholder={requireOrg ? 'Organization / Municipality' : 'Organization (Optional)'}
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          className="px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white"
        />
        <select
          value={roleType}
          onChange={(e) => setRoleType(e.target.value as LeadSubmission['role_type'])}
          className="px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white"
        >
          <option value="citizen">Citizen / Resident</option>
          <option value="business">Energy Business / Utility</option>
          <option value="policymaker">Policymaker / Municipality</option>
          <option value="researcher">Academic / Researcher</option>
        </select>
      </div>
      <label className="flex items-start gap-2 text-xs text-slate-300 cursor-pointer">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          I consent to storing my contact details securely so Dr. Ajesh Kumar can reach out regarding energy persona insights and collaboration (GDPR compliant; deletion anytime).
        </span>
      </label>
      <button
        type="submit"
        disabled={saving}
        className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm inline-flex items-center gap-2"
      >
        <Send className="w-4 h-4" /> {saving ? 'Saving...' : buttonText}
      </button>
    </form>
  );
}
