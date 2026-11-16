import { useEffect, useState } from 'react';
import { Database, ExternalLink, Search, Sparkles, Tag } from 'lucide-react';
import { OPEN_DATASETS, OpenDataset } from '../data/openDatasets';
import { PersonaModel } from '../types/persona';
import { DatasetAnalyzer } from './DatasetAnalyzer';

const CATEGORIES: Array<'All' | OpenDataset['category']> = [
  'All',
  'Survey & Personas',
  'Smart Meter & Telemetry',
  'Macro & Policy',
];

interface Props {
  model: PersonaModel | null;
}

export function DatasetCatalogue({ model }: Props) {
  const [datasets, setDatasets] = useState<(OpenDataset & { autoIndexed?: boolean })[]>(OPEN_DATASETS);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | OpenDataset['category']>('All');

  useEffect(() => {
    fetch('./data/datasets.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setDatasets(data);
      })
      .catch(() => {});
  }, []);

  const filtered = datasets.filter((ds) => {
    const matchesCat = category === 'All' || ds.category === category;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      ds.title.toLowerCase().includes(q) ||
      ds.region.toLowerCase().includes(q) ||
      ds.summary.toLowerCase().includes(q) ||
      ds.keyVariables.some((v) => v.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <DatasetAnalyzer model={model} />

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div>
          <h2 className="font-semibold text-xl flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" /> Open-Access Energy Behavior & Citizenship Datasets
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Curated public datasets plus weekly auto-indexed releases from Zenodo OpenAIRE.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by country, variable (e.g., smart meter, trust, EU-27, UK)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition ${
                  category === cat
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map((ds) => (
          <div key={ds.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {ds.category}
                  </span>
                  {ds.autoIndexed && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      <Sparkles className="w-3 h-3" /> Auto-Indexed
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 font-medium">{ds.year} • {ds.license}</span>
              </div>

              <div>
                <h3 className="font-bold text-lg text-slate-900 leading-snug">{ds.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{ds.provider}</p>
              </div>

              <p className="text-sm text-slate-600">{ds.summary}</p>

              <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                <div><span className="font-semibold text-slate-800">Coverage:</span> {ds.region}</div>
                <div><span className="font-semibold text-slate-800">Sample:</span> {ds.sampleSize}</div>
                <div><span className="font-semibold text-emerald-800">Persona Integration:</span> {ds.howToUseWithPersonas}</div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {ds.keyVariables.map((v) => (
                  <span key={v} className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                    <Tag className="w-2.5 h-2.5" /> {v}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={ds.doiOrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-900 hover:text-white hover:border-slate-900 text-sm font-semibold text-slate-800 transition"
            >
              Access Dataset & Documentation <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
