import { NextResponse } from 'next/server';
import { applyApprovedPlan } from '@/lib/ai/orchestrator';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const body = await req.json();
    const { planId, applyBudget, applyTimeline, applyVendors, applyIdeas } = body;

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required to apply changes' }, { status: 400 });
    }

    const updatedPlan = await applyApprovedPlan(planId, {
      applyBudget,
      applyTimeline,
      applyVendors,
      applyIdeas,
    });

    return NextResponse.json({
      success: true,
      message: 'Plan approved and successfully populated into your event workspace!',
      plan: updatedPlan,
    });
  } catch (error: any) {
    console.error('Apply AI plan error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to apply plan changes' },
      { status: 500 }
    );
  }
}
