export interface QuizQuestion {
  id: string;
  text: string;
  options: Record<string, string>;
}

export interface PersonaModel {
  version: string;
  source_doi: string;
  cv_accuracy: number;
  features: string[];
  questions: QuizQuestion[];
  scaler_mean: number[];
  scaler_scale: number[];
  classes: number[]; // [1, 2, 3, 4, 5, 6]
  coef: number[][];
  intercept: number[];
}

export interface PredictionResult {
  clusterId: number; // 1 to 6
  probability: number;
}

export interface PersonaGuideline {
  id: number;
  name: string;
  tagline: string;
  color: string;
  dashboardMustHaves: string[];
  antiPatterns: string[];
}

export type CountryBaselines = Record<
  string,
  { n: number; distribution: Record<string, number> }
>;
