import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';
import { slugify } from '@/lib/utils';

export async function GET(req: Request) {
  try {
    const session = await getCurrentUser();
    let workspaceId: string | null = null;

    if (session) {
      const membership = await prisma.workspaceMember.findFirst({
        where: { userId: session.userId },
      });
      workspaceId = membership?.workspaceId || null;
    }

    // If no session, fallback to the demo workspace
    if (!workspaceId) {
      const demoWorkspace = await prisma.workspace.findFirst({
        where: { slug: 'sharma-celebrations' },
      });
      workspaceId = demoWorkspace?.id || null;
    }

    if (!workspaceId) {
      return NextResponse.json({ events: [] });
    }

    const events = await prisma.event.findMany({
      where: { workspaceId },
      include: {
        categories: true,
        expenses: true,
        tasks: true,
        vendors: true,
      },
      orderBy: { startDate: 'asc' },
    });

    return NextResponse.json({ events });
  } catch (error: any) {
    console.error('Fetch events error:', error);
    return NextResponse.json({ error: 'Failed to retrieve events' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentUser();
    let userId: string;
    let workspaceId: string;

    if (session) {
      userId = session.userId;
      const membership = await prisma.workspaceMember.findFirst({
        where: { userId },
      });
      if (!membership) {
        return NextResponse.json({ error: 'No active workspace found' }, { status: 400 });
      }
      workspaceId = membership.workspaceId;
    } else {
      // Use demo user/workspace if unauthenticated
      const demoUser = await prisma.user.findUnique({ where: { email: 'demo@eventwise.ai' } });
      const demoWorkspace = await prisma.workspace.findFirst({ where: { slug: 'sharma-celebrations' } });
      if (!demoUser || !demoWorkspace) {
        return NextResponse.json({ error: 'Please sign in to create an event' }, { status: 401 });
      }
      userId = demoUser.id;
      workspaceId = demoWorkspace.id;
    }

    const body = await req.json();
    const {
      title,
      type = 'WEDDING',
      startDate,
      endDate,
      location,
      guestCount = 50,
      budgetCeiling = 100000,
      currency = 'INR',
      theme,
      formality = 'Semi-formal',
      dietaryNotes,
      accessibilityNotes,
      notes,
    } = body;

    if (!title || !startDate || !location) {
      return NextResponse.json({ error: 'Title, event date, and location are required' }, { status: 400 });
    }

    let baseSlug = slugify(title) || 'event';
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.event.findFirst({ where: { workspaceId, slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const newEvent = await prisma.event.create({
      data: {
        workspaceId,
        creatorId: userId,
        title: title.trim(),
        slug,
        type: type.toUpperCase(),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location: location.trim(),
        guestCount: Number(guestCount) || 50,
        budgetCeiling: Number(budgetCeiling) || 100000,
        currency,
        theme: theme?.trim() || null,
        formality: formality?.trim() || null,
        dietaryNotes: dietaryNotes?.trim() || null,
        accessibilityNotes: accessibilityNotes?.trim() || null,
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json({ event: newEvent }, { status: 201 });
  } catch (error: any) {
    console.error('Create event error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
