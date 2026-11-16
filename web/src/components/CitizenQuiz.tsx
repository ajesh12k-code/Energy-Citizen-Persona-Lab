import { useState } from 'react';
import { ArrowRight, BarChart3, CheckCircle2 } from 'lucide-react';
import { CountryBaselines, PersonaModel, PredictionResult } from '../types/persona';
import { PERSONA_GUIDELINES } from '../data/personaGuidelines';
import { GLOBAL_COUNTRIES, resolveCountryBaseline } from '../data/globalCountries';
import { predictPersona } from '../utils/predictPersona';
import { formatSurveyQuestion } from '../utils/formatQuestion';
import { LeadForm } from './LeadForm';

interface Props {
  model: PersonaModel | null;
  baselines: CountryBaselines;
}

export function CitizenQuiz({ model, baselines }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [country, setCountry] = useState('Finland');
  const [predictions, setPredictions] = useState<PredictionResult[] | null>(null);

  const handlePredict = () => {
    if (!model) return;
    const ordered = model.questions.map((_, i) => answers[i] ?? model.scaler_mean[i]);
    setPredictions(predictPersona(ordered, model));
  };

  const top = predictions?.[0];
  const persona = top ? PERSONA_GUIDELINES[top.clusterId] : null;
  const resolved = resolveCountryBaseline(country, baselines);
  const natShare = top ? resolved.shareByPersona[String(top.clusterId)] : undefined;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-lg">1. Select Your Country</h2>
          <p className="text-sm text-slate-500">
            Supports 16 direct EU national baselines plus global reference benchmarking.
          </p>
        </div>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="border border-slate-300 rounded-xl px-4 py-2.5 bg-white font-medium text-sm"
        >
          {GLOBAL_COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c} {baselines[c] ? '★' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-semibold text-lg">2. Answer 12 Quick Questions</h2>
            <p className="text-sm text-slate-500">
              Distilled ML model ({model ? `${(model.cv_accuracy * 100).toFixed(1)}%` : '88.2%'} cross-validated accuracy).
            </p>
          </div>
          <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            {Object.keys(answers).length} / {model?.questions.length ?? 12} answered
          </span>
        </div>

        {!model ? (
          <p className="text-slate-500 text-sm">Loading persona inference model...</p>
        ) : (
          <div className="space-y-5">
            {model.questions.map((q, idx) => {
              const formatted = formatSurveyQuestion(q.id, q.text);
              return (
                <div key={q.id} className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <div className="text-xs font-bold text-slate-400 uppercase">Question {idx + 1}</div>
                  {formatted.instruction && (
                    <p className="text-xs font-medium text-slate-500">{formatted.instruction}</p>
                  )}
                  <p className="font-semibold text-slate-900 text-base">{formatted.statement}</p>

                  {formatted.isNumericScale && (
                    <div className="flex justify-between text-xs font-medium text-slate-500 pt-1 max-w-md">
                      <span>{formatted.lowAnchor}</span>
                      <span>{formatted.highAnchor}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-1">
                    {Object.entries(q.options).map(([valStr, label]) => {
                      const val = Number(valStr);
                      const active = answers[idx] === val;
                      const buttonText = formatted.isNumericScale ? `${val}` : `${val}. ${label}`;
                      return (
                        <button
                          key={valStr}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, [idx]: val }))}
                          className={`${
                            formatted.isNumericScale ? 'w-10 h-10 justify-center' : 'px-3.5 py-2'
                          } inline-flex items-center rounded-lg text-xs font-semibold border transition ${
                            active
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-400'
                          }`}
                        >
                          {buttonText}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={handlePredict}
              disabled={Object.keys(answers).length < model.questions.length}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-semibold flex items-center justify-center gap-2 transition"
            >
              Identify My Energy Persona <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {predictions && top && persona && (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border-2 border-emerald-500 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Primary Energy Archetype ({top.probability}% Match)
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">{persona.name}</h3>
              <p className="text-slate-600 mt-1">{persona.tagline}</p>
            </div>
            {natShare !== undefined && (
              <div className="bg-slate-100 px-4 py-3 rounded-xl text-right shrink-0">
                <div className="text-xs text-slate-500">{resolved.label}</div>
                <div className="text-2xl font-bold text-slate-900">{natShare}%</div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-emerald-50/70 p-5 rounded-xl border border-emerald-200">
              <h4 className="font-semibold text-emerald-950 flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ideal Dashboard Features for You
              </h4>
              <ul className="space-y-2 text-sm text-emerald-900">
                {persona.dashboardMustHaves.map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-slate-600" /> Affinity Across All 6 Personas
              </h4>
              <div className="space-y-2.5">
                {predictions.map((p) => (
                  <div key={p.clusterId} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{PERSONA_GUIDELINES[p.clusterId]?.name}</span>
                      <span>{p.probability}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${p.probability}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <LeadForm
            defaultRole="citizen"
            country={country}
            personaId={top.clusterId}
            personaName={persona.name}
            title="Stay Connected & Receive Research Updates"
            subtitle="Leave your email to connect with Dr. Ajesh Kumar and receive updates on energy citizenship tools."
            buttonText="Save & Connect"
          />
        </div>
      )}
    </div>
  );
}
