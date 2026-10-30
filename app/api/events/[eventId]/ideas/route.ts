import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const ideas = await prisma.idea.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ ideas });
  } catch (error: any) {
    console.error('Fetch ideas error:', error);
    return NextResponse.json({ error: 'Failed to retrieve inspiration ideas' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const { title, description, category = 'Theme', impact = 'Medium', status = 'PROPOSED' } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const idea = await prisma.idea.create({
      data: {
        eventId,
        title: title.trim(),
        description: description.trim(),
        category,
        impact,
        status,
      },
    });

    return NextResponse.json({ idea }, { status: 201 });
  } catch (error: any) {
    console.error('Create idea error:', error);
    return NextResponse.json({ error: 'Failed to record idea' }, { status: 500 });
  }
}
