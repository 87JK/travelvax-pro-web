import { ItineraryInput, PlanOutput, PlanItem, MalariaPlan } from './types';
import { getDestinationData } from './cdc';

export async function buildPlan(inp: ItineraryInput): Promise<PlanOutput> {
  const sources = new Set<string>();
  const recs: PlanItem[] = [];
  const entry: PlanItem[] = [];
  const notices: { level: string; title: string; url: string }[] = [];

  for (const c of inp.destinations) {
    const data = await getDestinationData(c);
    data.sources.forEach(s => sources.add(s));

    if (data.vaccines.includes('Hepatitis A')) {
      recs.push({
        vaccine: 'Hepatitis A',
        category: 'recommended',
        rationale: `Hep A risk from food/water in ${c}.`,
        schedule: 'Dose 1 asap; Dose 2 at 6–12 months for long-term protection.',
        citations: data.sources
      });
    }
    if (data.vaccines.includes('Typhoid')) {
      recs.push({
        vaccine: 'Typhoid',
        category: 'recommended',
        rationale: `Risk higher with smaller cities or rural travel in ${c}.`,
        schedule: 'IM: single dose ≥2 weeks pre-travel (booster 2y). Oral: days 0,2,4,6 (finish ≥1 week pre-travel).',
        citations: data.sources
      });
    }
    if (data.vaccines.some(v => v.startsWith('Yellow Fever'))) {
      entry.push({
        vaccine: 'Yellow Fever',
        category: 'required',
        rationale: `May be required for entry/transit or regionally recommended in ${c}.`,
        schedule: 'Single dose ≥10 days before; certificate valid per IHR.',
        citations: data.sources
      });
    }
    if (data.vaccines.includes('Polio booster (if indicated)')) {
      recs.push({
        vaccine: 'Polio (adult booster if indicated)',
        category: 'consider',
        rationale: `Booster for adults with prior primary series if traveling to polio-affected regions.`,
        schedule: 'One lifetime adult booster when indicated.',
        citations: data.sources
      });
    }
    if (data.vaccines.includes('Rabies (risk-based)')) {
      recs.push({
        vaccine: 'Rabies (pre-exposure)',
        category: 'consider',
        rationale: `Consider with animal exposure risk, remote travel, or limited access to RIG.`,
        schedule: '2-dose pre-exposure (day 0,7).',
        citations: data.sources
      });
    }
    if (data.vaccines.includes('Japanese Encephalitis (risk-based)')) {
      recs.push({
        vaccine: 'Japanese Encephalitis',
        category: 'consider',
        rationale: `Consider for long stays or rural exposure during transmission season.`,
        schedule: '2 doses, typically days 0 and 28 (accelerated schedules exist).',
        citations: data.sources
      });
    }
  }

  const malaria: MalariaPlan = {
    indicated: true,
    regimen: 'Atovaquone-proguanil daily',
    schedule: 'Start 1–2 days before entering risk area; continue while there; 7 days after leaving.',
    notes: 'Choose regimen based on contraindications, costs, paediatrics, and itinerary specifics.',
    citations: Array.from(sources)
  };

  return {
    entry_requirements: entry,
    recommendations: recs,
    malaria,
    notices,
    last_reviewed: new Date().toISOString().slice(0,10),
    sources: Array.from(sources)
  };
}
