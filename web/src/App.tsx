import { useEffect, useState } from 'react';
import { Database, LayoutDashboard, Sparkles, Users } from 'lucide-react';
import { CountryBaselines, PersonaModel } from './types/persona';
import { CitizenQuiz } from './components/CitizenQuiz';
import { DashboardAuditor } from './components/DashboardAuditor';
import { DatasetCatalogue } from './components/DatasetCatalogue';

export function App() {
  const [tab, setTab] = useState<'citizen' | 'auditor' | 'datasets'>('citizen');
  const [model, setModel] = useState<PersonaModel | null>(null);
  const [baselines, setBaselines] = useState<CountryBaselines>({});

  useEffect(() => {
    fetch('./data/personas_model.json').then((r) => r.json()).then(setModel);
    fetch('./data/country_baselines.json').then((r) => r.json()).then(setBaselines);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
              <Sparkles className="w-3.5 h-3.5" /> EU Horizon 2020 GRETA Data (N = 9,414)
            </span>
            <h1 className="text-2xl md:text-3xl font-bold mt-2">Energy Citizen Persona Lab</h1>
            <p className="text-slate-300 text-sm mt-1">
              Discover your empirical energy persona (1–6), audit dashboard UX, or explore open datasets.
            </p>
          </div>
          <div className="flex flex-wrap bg-slate-800 p-1 rounded-xl self-start gap-1">
            <button
              onClick={() => setTab('citizen')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                tab === 'citizen' ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" /> Citizen Quiz
            </button>
            <button
              onClick={() => setTab('auditor')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                tab === 'auditor' ? 'bg-sky-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard Auditor
            </button>
            <button
              onClick={() => setTab('datasets')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                tab === 'datasets' ? 'bg-amber-400 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" /> Open Datasets
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {tab === 'citizen' && <CitizenQuiz model={model} baselines={baselines} />}
        {tab === 'auditor' && <DashboardAuditor />}
        {tab === 'datasets' && <DatasetCatalogue model={model} />}
      </main>
    </div>
  );
}

export default App;
