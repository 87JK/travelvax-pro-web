import { createClient } from '@supabase/supabase-js';
import type { ItineraryInput, PlanOutput } from './types';

export async function savePlanIfConfigured(inp: ItineraryInput, plan: PlanOutput) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const table = process.env.SUPABASE_TABLE || 'plans';
  if (!url || !key) return;

  const supabase = createClient(url, key);
  const reference = crypto.randomUUID().slice(0,8);

  const payload = {
    reference,
    inputs_json: {
      ...inp,
      // enforce de-identified
      patient_initials: inp.deidentified ? null : inp.patient_initials || null,
      birth_year_range: inp.deidentified ? null : inp.birth_year_range || null
    },
    output_json: plan,
  };

  await supabase.from(table).insert(payload);
}
