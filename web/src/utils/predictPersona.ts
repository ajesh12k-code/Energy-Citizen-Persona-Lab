import { PersonaModel, PredictionResult } from '../types/persona';

export function predictPersona(answers: number[], model: PersonaModel): PredictionResult[] {
  const z = answers.map((val, i) => (val - model.scaler_mean[i]) / model.scaler_scale[i]);

  const logits = model.coef.map((weights, classIdx) => {
    const dot = weights.reduce((sum, w, featIdx) => sum + w * z[featIdx], 0);
    return dot + model.intercept[classIdx];
  });

  const maxLogit = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxLogit));
  const sumExps = exps.reduce((a, b) => a + b, 0);

  return model.classes
    .map((clusterId, idx) => ({
      clusterId,
      probability: Math.round((exps[idx] / sumExps) * 1000) / 10,
    }))
    .sort((a, b) => b.probability - a.probability);
}
