import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ImagePlus, Link2, Sparkles, X } from 'lucide-react';
import { DASHBOARD_FEATURES } from '../data/dashboardFeatures';
import { PERSONA_GUIDELINES } from '../data/personaGuidelines';
import { AiAuditResponse, runMultimodalDashboardAudit } from '../utils/dashboardAuditApi';
import { LeadForm } from './LeadForm';

export function DashboardAuditor() {
  const [selected, setSelected] = useState<string[]>(['hourly_kwh', 'euro_cost']);
  const [dashboardUrl, setDashboardUrl] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [aiResult, setAiResult] = useState<AiAuditResponse | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const readImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setScreenshotPreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) readImageFile(file);
      }
    }
  };

  const handleUnlock = async () => {
    setUnlocked(true);
    setAnalyzing(true);
    const ai = await runMultimodalDashboardAudit({
      imageBase64: screenshotPreview || undefined,
      dashboardUrl: dashboardUrl || undefined,
      selectedFeatures: selected,
      notes,
    });
    setAiResult(ai);
    setAnalyzing(false);
  };

  const getCoverage = (personaId: number) => {
    const relevant = DASHBOARD_FEATURES.filter((f) => f.personas.includes(personaId));
    const matched = relevant.filter((f) => selected.includes(f.id));
    return relevant.length ? Math.round((matched.length / relevant.length) * 100) : 0;
  };

  return (
    <div onPaste={handlePaste} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
      <div>
        <h2 className="font-semibold text-xl">Audit Your Energy Dashboard or Policy Portal</h2>
        <p className="text-sm text-slate-500 mt-1">
          Paste a screenshot (<kbd className="px-1.5 py-0.5 bg-slate-100 border rounded text-xs">Ctrl+V</kbd>), upload an image, provide a dashboard URL, and select your active widgets to evaluate fit across Personas 1–6.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-slate-50 flex flex-col justify-between">
          {screenshotPreview ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                <span>Dashboard Screenshot Attached</span>
                <button
                  type="button"
                  onClick={() => setScreenshotPreview(null)}
                  className="text-rose-600 hover:underline inline-flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
              <img src={screenshotPreview} alt="Dashboard preview" className="max-h-40 rounded-lg border border-slate-200 object-contain mx-auto" />
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center justify-center text-center py-4 space-y-2">
              <ImagePlus className="w-7 h-7 text-sky-600" />
              <span className="text-sm font-medium text-slate-800">Paste Screenshot (Ctrl+V) or Click to Upload</span>
              <span className="text-xs text-slate-500">PNG, JPG, or WebP mockup of your customer portal</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && readImageFile(e.target.files[0])}
              />
            </label>
          )}
        </div>

        <div className="space-y-3 flex flex-col justify-between">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500 flex items-center gap-1.5 mb-1">
              <Link2 className="w-3.5 h-3.5" /> Live Dashboard / Portal URL (Optional)
            </label>
            <input
              type="url"
              value={dashboardUrl}
              onChange={(e) => setDashboardUrl(e.target.value)}
              placeholder="https://portal.your-energy-service.com"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500 block mb-1">
              Target Region & Context
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Smart meter app for apartment tenants & EV owners..."
              className="w-full rounded-xl border border-slate-300 p-2.5 text-sm"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-800 mb-2.5">Select Features Currently Visible on Your Dashboard</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {DASHBOARD_FEATURES.map((feat) => {
            const active = selected.includes(feat.id);
            return (
              <button
                key={feat.id}
                type="button"
                onClick={() => toggle(feat.id)}
                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition flex items-center justify-between gap-2 ${
                  active ? 'bg-sky-50 border-sky-500 text-sky-950 font-medium' : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <span>{feat.label}</span>
                {active && <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {!unlocked ? (
        <LeadForm
          defaultRole="business"
          requireOrg
          dashboardNotes={`URL: ${dashboardUrl || 'N/A'} | Screenshot: ${screenshotPreview ? 'Attached' : 'No'} | Features: ${selected.join(', ')} | ${notes}`}
          title="Unlock Full 6-Persona UX Audit & Recommendations"
          subtitle="Enter your work contact details to inspect your persona gap matrix and receive tailored UX feedback."
          buttonText="Generate Dashboard UX Audit"
          onSuccess={handleUnlock}
        />
      ) : (
        <div className="space-y-5 pt-4 border-t border-slate-200">
          {analyzing && (
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin" /> Analyzing screenshot and dashboard structure across Personas 1–6...
            </div>
          )}

          {aiResult && (
            <div className="p-5 rounded-xl bg-slate-900 text-white space-y-3">
              <h4 className="font-bold text-sky-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> AI Multimodal UX Critique
              </h4>
              <p className="text-sm text-slate-200">{aiResult.summary}</p>
              <ul className="text-xs text-slate-300 space-y-1">
                {aiResult.priorityRecommendations.map((r, i) => <li key={i}>• {r}</li>)}
              </ul>
            </div>
          )}

          <h3 className="font-bold text-lg text-slate-900">Persona Coverage & Missing Dashboard Elements</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.values(PERSONA_GUIDELINES).map((p) => {
              const score = getCoverage(p.id);
              const missing = DASHBOARD_FEATURES.filter((f) => f.personas.includes(p.id) && !selected.includes(f.id));
              return (
                <div key={p.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">{p.name}</h4>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      score >= 65 ? 'bg-emerald-100 text-emerald-800' : score >= 35 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {score}% Fit
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{p.tagline}</p>
                  {missing.length > 0 ? (
                    <div className="text-xs bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Recommended additions:
                      </div>
                      {missing.map((m) => <div key={m.id} className="text-slate-600">+ {m.label}</div>)}
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-700 font-medium">✓ Well-served by your current feature set.</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
