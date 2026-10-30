import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const guests = await prisma.guest.findMany({
      where: { eventId },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ guests });
  } catch (error: any) {
    console.error('Fetch guests error:', error);
    return NextResponse.json({ error: 'Failed to retrieve guests' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const {
      name,
      email,
      phone,
      group = 'GENERAL',
      rsvpStatus = 'NO_REPLY',
      plusOnes = 0,
      dietaryNeeds,
      notes,
    } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Guest name is required' }, { status: 400 });
    }

    const guest = await prisma.guest.create({
      data: {
        eventId,
        name: name.trim(),
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        group,
        rsvpStatus,
        plusOnes: Number(plusOnes) || 0,
        dietaryNeeds: dietaryNeeds?.trim() || null,
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json({ guest }, { status: 201 });
  } catch (error: any) {
    console.error('Create guest error:', error);
    return NextResponse.json({ error: 'Failed to add guest' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { guestId, rsvpStatus, plusOnes, dietaryNeeds, notes } = await req.json();

    if (!guestId) {
      return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 });
    }

    const updated = await prisma.guest.update({
      where: { id: guestId },
      data: {
        rsvpStatus,
        plusOnes: plusOnes !== undefined ? Number(plusOnes) : undefined,
        dietaryNeeds,
        notes,
      },
    });

    return NextResponse.json({ guest: updated });
  } catch (error: any) {
    console.error('Update guest error:', error);
    return NextResponse.json({ error: 'Failed to update guest' }, { status: 500 });
  }
}
