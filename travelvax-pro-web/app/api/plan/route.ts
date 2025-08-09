import { NextRequest, NextResponse } from 'next/server';
import { buildPlan } from '@/lib/rules';
import type { ItineraryInput } from '@/lib/types';
import { savePlanIfConfigured } from '@/lib/storage';

export async function POST(req: NextRequest) {
  const payload = await req.json() as ItineraryInput;
  try {
    const plan = await buildPlan(payload);
    // store de-identified (optional)
    await savePlanIfConfigured(payload, plan);
    return NextResponse.json(plan);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to build plan' }, { status: 400 });
  }
}
