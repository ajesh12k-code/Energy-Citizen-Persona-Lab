export interface OpenDataset {
  id: string;
  title: string;
  provider: string;
  year: string;
  region: string;
  sampleSize: string;
  license: string;
  category: 'Survey & Personas' | 'Smart Meter & Telemetry' | 'Macro & Policy';
  doiOrUrl: string;
  summary: string;
  keyVariables: string[];
  howToUseWithPersonas: string;
}

export const OPEN_DATASETS: OpenDataset[] = [
  {
    id: 'greta-survey',
    title: 'GRETA Multinational Energy Citizenship Survey',
    provider: 'Horizon 2020 GRETA Consortium (Zenodo)',
    year: '2023',
    region: '16 European Countries (AT, BE, CZ, DK, FI, FR, DE, EL, HU, IE, IT, NL, PL, PT, RO, ES)',
    sampleSize: '10,488 interviews (9,414 Citizens, 536 Businesses, 538 Policymakers)',
    license: 'CC-BY-4.0',
    category: 'Survey & Personas',
    doiOrUrl: 'https://doi.org/10.5281/zenodo.10078752',
    summary:
      'Comprehensive multinational microdata measuring energy literacy, information complexity barriers, conservation behaviors, bill vulnerability, institutional trust, and policy acceptance.',
    keyVariables: ['c11 (Info complexity)', 'c14/c15 (Attitudes)', 'c28 (Energy poverty)', 'c39/c47 (Trust)', 'Raked weights'],
    howToUseWithPersonas: 'Core training dataset powering the 12-question classifier and 16-country baseline distributions in this app.',
  },
  {
    id: 'energy-communities-2025',
    title: 'Energy Citizenship & Willingness to Join Energy Communities',
    provider: 'Zenodo Open Research Repository',
    year: '2025',
    region: 'Austria, Germany, Netherlands',
    sampleSize: 'Multi-level citizen survey sample',
    license: 'CC-BY-4.0',
    category: 'Survey & Personas',
    doiOrUrl: 'https://doi.org/10.5281/zenodo.14794306',
    summary:
      'Investigates citizen willingness to participate in local, regional, and national Renewable Energy Communities (RECs) alongside socioeconomic predictors.',
    keyVariables: ['Community participation willingness', 'Geographical governance scale', 'Socioeconomic factors'],
    howToUseWithPersonas: 'Ideal for calibrating community-sharing features for Persona 1 (Guided Eco-Advocate) and Persona 6 (Data-Savvy Prosumer).',
  },
  {
    id: 'energyprospects',
    title: 'EnergyPROSPECTS European Energy Citizenship Case Mapping',
    provider: 'Horizon 2020 EnergyPROSPECTS (Zenodo)',
    year: '2024',
    region: 'Europe-wide (596 mapped initiatives across EU & associated states)',
    sampleSize: '596 energy citizenship cases',
    license: 'CC-BY-SA-4.0',
    category: 'Macro & Policy',
    doiOrUrl: 'https://doi.org/10.5281/zenodo.10569717',
    summary:
      'Structured typology and country factsheets mapping real-world energy cooperatives, municipal initiatives, and citizen-led transition projects across Europe.',
    keyVariables: ['Governance model', 'Citizen agency level', 'Initiative funding & scale', 'Country profiles'],
    howToUseWithPersonas: 'Helps municipalities and policymakers match real-world organizational models to local persona distributions.',
  },
  {
    id: 'sheds-swiss',
    title: 'SHEDS – Swiss Household Energy Demand Survey',
    provider: 'SWEET-CROSS / Swiss Competence Center for Energy Research',
    year: '2016–2025 (8+ Waves)',
    region: 'Switzerland',
    sampleSize: '~5,000 respondents per longitudinal wave',
    license: 'Open Academic Access',
    category: 'Survey & Personas',
    doiOrUrl: 'https://sweet-cross.ch/sheds',
    summary:
      'Longitudinal panel survey tracking heating systems, appliance ownership, mobility choices, psychological attitudes, and behavioral shifts over time.',
    keyVariables: ['Heating & hot water habits', 'Appliance efficiency', 'EV/mobility behavior', 'Psychological drivers'],
    howToUseWithPersonas: 'Enables longitudinal validation of how citizens transition between Passive (Persona 5) and Prosumer (Persona 6) archetypes.',
  },
  {
    id: 'ideal-uk',
    title: 'IDEAL Household Energy & Contextual Sensor Dataset',
    provider: 'University of Edinburgh (Nature Scientific Data)',
    year: '2021',
    region: 'United Kingdom (255 homes)',
    sampleSize: '255 households (high-frequency electricity, gas, temperature + surveys)',
    license: 'CC-BY-4.0',
    category: 'Smart Meter & Telemetry',
    doiOrUrl: 'https://doi.org/10.7488/ds/2836',
    summary:
      'Pairs high-resolution smart meter electricity/gas telemetry and room sensors with longitudinal household surveys on comfort, occupancy, and energy attitudes.',
    keyVariables: ['1-second electricity & pulse gas', 'Indoor temperature/humidity', 'Occupant survey attitudes'],
    howToUseWithPersonas: 'Allows utilities to test how actual kWh load curves differ between Comfort-First (Persona 2) and Eco-Advocate (Persona 1) homes.',
  },
  {
    id: 'eurostat-hhq',
    title: 'Eurostat Disaggregated Household Energy Consumption (nrg_d_hhq)',
    provider: 'European Commission / Eurostat',
    year: '2024–2026',
    region: 'EU-27 + EEA Member States',
    sampleSize: 'Official national statistical accounts across all EU nations',
    license: 'CC-BY-4.0 (Eurostat Reuse Policy)',
    category: 'Macro & Policy',
    doiOrUrl: 'https://ec.europa.eu/eurostat/databrowser/view/nrg_d_hhq/default/table?lang=en',
    summary:
      'Official European residential energy consumption broken down by end-use (space heating, water heating, cooling, cooking, lighting/appliances) and fuel mix.',
    keyVariables: ['End-use consumption shares', 'Fuel mix (renewables, gas, electricity, district heat)', 'Price bands (nrg_pc_204)'],
    howToUseWithPersonas: 'Extends national energy context to all 27 EU countries beyond the 16 GRETA survey nations.',
  },
  {
    id: 'oecd-epic',
    title: 'OECD EPIC Survey on Environmental Policies and Individual Behaviour',
    provider: 'Organisation for Economic Co-operation and Development (OECD)',
    year: '2023',
    region: 'Global OECD (US, UK, Canada, France, Germany, Netherlands, Sweden, Switzerland, Israel)',
    sampleSize: '17,000+ households across 9 OECD countries',
    license: 'OECD Open Data Terms',
    category: 'Survey & Personas',
    doiOrUrl: 'https://www.oecd.org/en/topics/sub-issues/household-behaviour-and-environment.html',
    summary:
      'Cross-country household survey examining residential energy adoption, smart meter usage, green tariff uptake, and support for carbon/energy policies.',
    keyVariables: ['Smart meter & green tariff adoption', 'Willingness to pay', 'Policy acceptability', 'Housing constraints'],
    howToUseWithPersonas: 'Provides North American and non-EU OECD reference benchmarks for global users of the Persona Lab.',
  },
  {
    id: 'wvs-wave7',
    title: 'World Values Survey (WVS Wave 7) – Environment & Social Trust',
    provider: 'World Values Survey Association',
    year: '2017–2024',
    region: '90+ Countries Worldwide (Asia, Americas, Africa, Europe, Oceania)',
    sampleSize: '150,000+ respondents globally',
    license: 'Open Academic / Public Release',
    category: 'Macro & Policy',
    doiOrUrl: 'https://www.worldvaluessurvey.org/WVSContents.jsp',
    summary:
      'Global cross-national survey capturing environmental protection vs. economic growth trade-offs, interpersonal trust, institutional confidence, and financial security.',
    keyVariables: ['Interpersonal trust', 'Institutional confidence', 'Environmental priority', 'Household financial satisfaction'],
    howToUseWithPersonas: 'Offers global proxy calibration for trust (c39) and financial stress (c28) across emerging and non-European markets.',
  },
];
