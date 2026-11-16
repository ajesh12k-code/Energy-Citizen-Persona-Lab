export interface DashboardFeature {
  id: string;
  label: string;
  personas: number[]; // Persona IDs 1..6 served by this feature
}

export const DASHBOARD_FEATURES: DashboardFeature[] = [
  { id: 'euro_cost', label: 'Simple €/month & €/day cost breakdown', personas: [2, 3, 4, 5] },
  { id: 'bill_alerts', label: 'Mid-month spend cap & anomaly alerts', personas: [3, 4, 5] },
  { id: 'subsidy_finder', label: 'Tariff support, grants & bill-relief eligibility', personas: [4] },
  { id: 'co2_mix', label: 'Plain-language CO₂ saved & renewable grid mix', personas: [1, 6] },
  { id: 'auto_pilot', label: '1-click automated heating / EV / tariff optimization', personas: [1, 3, 5] },
  { id: 'peer_bench', label: 'Similar-household / neighborhood comparison', personas: [1, 5] },
  { id: 'hourly_kwh', label: 'Granular hourly kWh & dynamic spot-price charts', personas: [6] },
  { id: 'prosumer_api', label: 'Solar/battery self-sufficiency & CSV/API export', personas: [6] },
  { id: 'roi_calc', label: 'Clear payback ROI without climate lecturing', personas: [2, 6] },
];
