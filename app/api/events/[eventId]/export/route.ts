import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auditBudget } from '@/lib/finance/calculator';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'json';

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        categories: true,
        expenses: { include: { category: true, vendor: true } },
        tasks: { orderBy: { dueDate: 'asc' } },
        vendors: true,
        guests: true,
        ideas: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (format === 'csv') {
      // Generate CSV for expenses & budget
      const headers = ['Category', 'Expense Title', 'Amount', 'Currency', 'Status', 'Payment Date', 'Notes'];
      const rows = event.expenses.map((e) => [
        `"${e.category?.name || 'Uncategorized'}"`,
        `"${e.title.replace(/"/g, '""')}"`,
        e.amount,
        event.currency,
        e.status,
        e.paymentDate ? e.paymentDate.toISOString().split('T')[0] : '',
        `"${(e.notes || '').replace(/"/g, '""')}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${event.slug}-expenses.csv"`,
        },
      });
    }

    // Default JSON snapshot export
    const audit = auditBudget(event.budgetCeiling, event.guestCount, event.categories, event.expenses);

    const snapshot = {
      event: {
        title: event.title,
        type: event.type,
        startDate: event.startDate,
        location: event.location,
        guestCount: event.guestCount,
        budgetCeiling: event.budgetCeiling,
        currency: event.currency,
        theme: event.theme,
        formality: event.formality,
        notes: event.notes,
      },
      audit,
      categories: event.categories,
      expenses: event.expenses,
      tasks: event.tasks,
      vendors: event.vendors,
      guests: event.guests,
      ideas: event.ideas,
      exportedAt: new Date().toISOString(),
      exportVersion: 'Eventwise-SaaS-v1.0',
    };

    return NextResponse.json(snapshot);
  } catch (error: any) {
    console.error('Export event error:', error);
    return NextResponse.json({ error: 'Failed to export event data' }, { status: 500 });
  }
}
