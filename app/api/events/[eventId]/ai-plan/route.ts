import { NextResponse } from 'next/server';
import { requestAndSavePlan } from '@/lib/ai/orchestrator';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const result = await requestAndSavePlan(eventId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('AI plan generation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate AI plan' },
      { status: 500 }
    );
  }
}
