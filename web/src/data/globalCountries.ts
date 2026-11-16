import { CountryBaselines } from '../types/persona';

export const GLOBAL_COUNTRIES: string[] = [
  'Finland', 'Austria', 'Belgium', 'Czechia', 'Denmark', 'France', 'Germany',
  'Greece', 'Hungary', 'Ireland', 'Italy', 'Netherlands', 'Poland', 'Portugal',
  'Romania', 'Spain',
  'Australia', 'Brazil', 'Canada', 'China', 'Estonia', 'India', 'Japan',
  'Kenya', 'Latvia', 'Lithuania', 'Mexico', 'New Zealand', 'Nigeria', 'Norway',
  'Singapore', 'South Africa', 'South Korea', 'Sweden', 'Switzerland',
  'United Arab Emirates', 'United Kingdom', 'United States', 'Other / Global'
];

export function resolveCountryBaseline(
  country: string,
  baselines: CountryBaselines
): { shareByPersona: Record<string, number>; isDirectNational: boolean; label: string } {
  if (baselines[country]) {
    return {
      shareByPersona: baselines[country].distribution,
      isDirectNational: true,
      label: `Prevalence in ${country} (GRETA National Sample, n=${baselines[country].n})`,
    };
  }
  const countries = Object.values(baselines);
  const avg: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0 };
  if (countries.length > 0) {
    for (const c of countries) {
      for (const k of Object.keys(avg)) {
        avg[k] += (c.distribution[k] || 0) / countries.length;
      }
    }
    for (const k of Object.keys(avg)) avg[k] = Math.round(avg[k] * 10) / 10;
  }
  return {
    shareByPersona: avg,
    isDirectNational: false,
    label: `Global / Pan-European Reference Baseline (${country})`,
  };
}
