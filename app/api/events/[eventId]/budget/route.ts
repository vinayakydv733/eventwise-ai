import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auditBudget } from '@/lib/finance/calculator';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        categories: true,
        expenses: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const audit = auditBudget(
      event.budgetCeiling,
      event.guestCount,
      event.categories,
      event.expenses
    );

    return NextResponse.json({
      budgetCeiling: event.budgetCeiling,
      currency: event.currency,
      audit,
      categories: event.categories,
    });
  } catch (error: any) {
    console.error('Budget fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve budget' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const { name, allocatedAmount, color, note } = await req.json();

    if (!name || allocatedAmount === undefined) {
      return NextResponse.json({ error: 'Category name and allocated amount are required' }, { status: 400 });
    }

    const category = await prisma.budgetCategory.create({
      data: {
        eventId,
        name: name.trim(),
        allocatedAmount: Number(allocatedAmount) || 0,
        color: color || '#6366f1',
        note: note?.trim() || null,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error: any) {
    console.error('Budget category create error:', error);
    return NextResponse.json({ error: 'Failed to create budget category' }, { status: 500 });
  }
}
