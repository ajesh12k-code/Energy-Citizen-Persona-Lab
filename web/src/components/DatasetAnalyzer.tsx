import React, { useState } from 'react';
import { FileSpreadsheet, Upload } from 'lucide-react';
import { PersonaModel } from '../types/persona';
import { PERSONA_GUIDELINES } from '../data/personaGuidelines';
import { predictPersona } from '../utils/predictPersona';

interface Props {
  model: PersonaModel | null;
}

export function DatasetAnalyzer({ model }: Props) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [rowCount, setRowCount] = useState<number>(0);
  const [matchedCols, setMatchedCols] = useState<string[]>([]);
  const [distribution, setDistribution] = useState<Record<number, number> | null>(null);

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !model) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) return;

      const delimiter = lines[0].includes(';') ? ';' : ',';
      const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^"|"$/g, ''));
      const headerIndex = new Map(headers.map((h, idx) => [h.toLowerCase(), idx]));

      const found = model.features.filter((f) => headerIndex.has(f.toLowerCase()));
      setMatchedCols(found);

      const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      let validRows = 0;

      for (let r = 1; r < lines.length; r++) {
        const cells = lines[r].split(delimiter);
        if (cells.length < 2) continue;

        const answers = model.features.map((feat, fIdx) => {
          const colIdx = headerIndex.get(feat.toLowerCase());
          const raw = colIdx !== undefined ? parseFloat(cells[colIdx]) : NaN;
          return Number.isFinite(raw) ? raw : model.scaler_mean[fIdx];
        });

        const top = predictPersona(answers, model)[0];
        counts[top.clusterId] = (counts[top.clusterId] || 0) + 1;
        validRows++;
      }

      setRowCount(validRows);
      const pcts: Record<number, number> = {};
      for (const k of [1, 2, 3, 4, 5, 6]) {
        pcts[k] = validRows > 0 ? Math.round((counts[k] / validRows) * 1000) / 10 : 0;
      }
      setDistribution(pcts);
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-sky-600" /> Instant CSV Persona Profiler (In-Browser)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload any newly published survey CSV to classify respondents across Personas 1–6 locally in your browser (zero server upload).
          </p>
        </div>
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition shrink-0">
          <Upload className="w-4 h-4" /> Upload Survey CSV
          <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />
        </label>
      </div>

      {distribution && (
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <span><strong>File:</strong> {fileName} ({rowCount.toLocaleString()} rows classified)</span>
            <span><strong>Matched GRETA features:</strong> {matchedCols.length} / {model?.features.length ?? 12}</span>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((id) => (
              <div key={id} className="bg-white p-3 rounded-lg border border-slate-200">
                <div className="text-xs font-semibold text-slate-800">{PERSONA_GUIDELINES[id].name}</div>
                <div className="text-xl font-bold text-sky-700 mt-1">{distribution[id]}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
