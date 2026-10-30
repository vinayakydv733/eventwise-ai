import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const vendors = await prisma.vendor.findMany({
      where: { eventId },
      include: {
        quotes: true,
        expenses: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ vendors });
  } catch (error: any) {
    console.error('Fetch vendors error:', error);
    return NextResponse.json({ error: 'Failed to retrieve vendors' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    const body = await req.json();
    const {
      name,
      category,
      contactName,
      email,
      phone,
      website,
      address,
      quotedAmount,
      bookingStatus = 'TO_RESEARCH',
      paymentStatus = 'NOT_DUE',
      notes,
    } = body;

    if (!name || !category) {
      return NextResponse.json({ error: 'Vendor name and category are required' }, { status: 400 });
    }

    const vendor = await prisma.vendor.create({
      data: {
        eventId,
        workspaceId: event.workspaceId,
        name: name.trim(),
        category: category.trim(),
        contactName: contactName?.trim() || null,
        email: email?.trim() || null,
        phone: phone?.trim() || null,
        website: website?.trim() || null,
        address: address?.trim() || null,
        quotedAmount: quotedAmount !== undefined ? Number(quotedAmount) : null,
        bookingStatus,
        paymentStatus,
        notes: notes?.trim() || null,
      },
    });

    return NextResponse.json({ vendor }, { status: 201 });
  } catch (error: any) {
    console.error('Create vendor error:', error);
    return NextResponse.json({ error: 'Failed to add vendor' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const body = await req.json();
    const { vendorId, bookingStatus, paymentStatus, quotedAmount, notes } = body;

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID is required' }, { status: 400 });
    }

    const updated = await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        bookingStatus,
        paymentStatus,
        quotedAmount: quotedAmount !== undefined ? Number(quotedAmount) : undefined,
        notes,
      },
    });

    return NextResponse.json({ vendor: updated });
  } catch (error: any) {
    console.error('Update vendor error:', error);
    return NextResponse.json({ error: 'Failed to update vendor' }, { status: 500 });
  }
}
