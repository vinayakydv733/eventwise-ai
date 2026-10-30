import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { auditBudget } from '@/lib/finance/calculator';
import { getDaysRemaining } from '@/lib/utils';

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
        expenses: {
          include: { category: true, vendor: true },
          orderBy: { createdAt: 'desc' },
        },
        tasks: {
          orderBy: [{ status: 'asc' }, { dueDate: 'asc' }],
        },
        vendors: {
          orderBy: { createdAt: 'desc' },
        },
        guests: {
          orderBy: { name: 'asc' },
        },
        ideas: {
          orderBy: { createdAt: 'desc' },
        },
        aiPlans: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Compute live deterministic budget audit
    const budgetAudit = auditBudget(
      event.budgetCeiling,
      event.guestCount,
      event.categories,
      event.expenses
    );

    // Compute task stats
    const totalTasks = event.tasks.length;
    const completedTasks = event.tasks.filter((t) => t.status === 'COMPLETED').length;
    const inProgressTasks = event.tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const todoTasks = event.tasks.filter((t) => t.status === 'TODO').length;
    const overdueTasks = event.tasks.filter(
      (t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED'
    ).length;

    // Compute RSVP stats
    const rsvpStats = {
      attending: event.guests.filter((g) => g.rsvpStatus === 'ATTENDING').length,
      declined: event.guests.filter((g) => g.rsvpStatus === 'DECLINED').length,
      tentative: event.guests.filter((g) => g.rsvpStatus === 'TENTATIVE').length,
      noReply: event.guests.filter((g) => g.rsvpStatus === 'NO_REPLY').length,
    };

    const daysRemaining = getDaysRemaining(event.startDate);

    return NextResponse.json({
      event,
      stats: {
        budget: budgetAudit,
        tasks: {
          total: totalTasks,
          completed: completedTasks,
          inProgress: inProgressTasks,
          todo: todoTasks,
          overdue: overdueTasks,
          percentComplete: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
        },
        rsvp: rsvpStats,
        countdown: daysRemaining,
      },
    });
  } catch (error: any) {
    console.error('Fetch event detail error:', error);
    return NextResponse.json({ error: 'Failed to retrieve event details' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const body = await req.json();

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title: body.title,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        location: body.location,
        guestCount: body.guestCount !== undefined ? Number(body.guestCount) : undefined,
        budgetCeiling: body.budgetCeiling !== undefined ? Number(body.budgetCeiling) : undefined,
        currency: body.currency,
        theme: body.theme,
        formality: body.formality,
        dietaryNotes: body.dietaryNotes,
        notes: body.notes,
        status: body.status,
      },
    });

    return NextResponse.json({ event: updatedEvent });
  } catch (error: any) {
    console.error('Update event error:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    await prisma.event.delete({ where: { id: eventId } });
    return NextResponse.json({ success: true, message: 'Event deleted' });
  } catch (error: any) {
    console.error('Delete event error:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
