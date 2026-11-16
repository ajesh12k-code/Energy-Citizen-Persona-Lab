import { PersonaGuideline } from '../types/persona';

export const PERSONA_GUIDELINES: Record<number, PersonaGuideline> = {
  1: {
    id: 1,
    name: '1. The Guided Eco-Advocate',
    tagline: 'High climate & societal motivation, but overwhelmed by technical energy metrics.',
    color: '#10b981',
    dashboardMustHaves: [
      'Plain-language CO₂ avoided & renewable grid-mix indicators',
      'Guided 1-click eco-actions ranked by environmental impact',
      'Visual analogies instead of raw kWh/kW engineering units',
    ],
    antiPatterns: ['Dense time-series load curves without labels', 'Manual tariff tables'],
  },
  2: {
    id: 2,
    name: '2. The Transition Skeptic',
    tagline: 'Comfortable reading bills, skeptical of green framing, motivated by control & wallet.',
    color: '#64748b',
    dashboardMustHaves: [
      'Line-item euro cost transparency (supply vs. grid fees vs. taxes)',
      'Zero-comfort-loss bill optimization tips',
      'Clear ROI payback timelines for hardware upgrades',
    ],
    antiPatterns: ['Moralizing climate nudges', 'Mandatory smart-device overrides'],
  },
  3: {
    id: 3,
    name: '3. The Overwhelmed Time-Poor',
    tagline: 'Financially stable but too busy and data-averse to actively manage energy.',
    color: '#8b5cf6',
    dashboardMustHaves: [
      "Single-screen 'Everything OK / Action Needed' status",
      "Automated 'Set & Forget' heating and EV tariff toggles",
      'Monthly 30-second digest notification',
    ],
    antiPatterns: ['Multi-tab analytics portals', 'Frequent price-alert push spam'],
  },
  4: {
    id: 4,
    name: '4. The Energy-Vulnerable Household',
    tagline: 'Facing severe bill/disconnection stress alongside high data-complexity barriers.',
    color: '#ef4444',
    dashboardMustHaves: [
      'Real-time €/day budget tracker with early threshold alerts',
      'Direct eligibility checker for social tariffs, grants & bill relief',
      'Zero-cost behavioral actions ranked by immediate euro savings',
    ],
    antiPatterns: ['Upselling expensive solar/heat-pump hardware', 'Delayed monthly bill surprises'],
  },
  5: {
    id: 5,
    name: '5. The Passive Mainstream',
    tagline: 'Moderate engagement and trust; responds best to clear benchmarks and anomaly alerts.',
    color: '#f59e0b',
    dashboardMustHaves: [
      "Similar-household neighborhood benchmark ('You vs. similar homes')",
      'Automated anomaly alert when usage spikes above baseline',
      'Simple seasonal efficiency checklists',
    ],
    antiPatterns: ['Complex self-service energy modeling tools', 'Unexplained kilowatt-hour jargon'],
  },
  6: {
    id: 6,
    name: '6. The Data-Savvy Prosumer',
    tagline: 'High transition commitment combined with high confidence reading granular energy data.',
    color: '#0ea5e9',
    dashboardMustHaves: [
      'High-resolution kWh, self-consumption, and hourly spot-price charts',
      'Battery, solar PV, heat-pump, and EV load-shifting controls',
      'CSV/API data export and local energy-community sharing metrics',
    ],
    antiPatterns: ['Over-simplified summaries that hide raw kWh data', 'Locked automation schedules'],
  },
};
