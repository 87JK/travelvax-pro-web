export type ItineraryInput = {
  destinations: string[];
  departure_date: string;
  return_date: string;
  age: number;
  pregnancy?: boolean;
  immunosuppressed?: boolean;
  activities?: string[];
  accommodations?: string[];
  prior_vaccines?: Record<string, any>;
  deidentified?: boolean;
  patient_initials?: string | null;
  birth_year_range?: string | null;
};

export type PlanItem = {
  vaccine: string;
  category: 'required' | 'recommended' | 'consider';
  rationale: string;
  schedule?: string;
  citations?: string[];
};

export type MalariaPlan = {
  indicated: boolean;
  regimen?: string;
  schedule?: string;
  notes?: string;
  citations?: string[];
};

export type PlanOutput = {
  entry_requirements: PlanItem[];
  recommendations: PlanItem[];
  malaria?: MalariaPlan | null;
  notices: { level: string; title: string; url: string }[];
  last_reviewed: string;
  sources: string[];
};