import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const expenses = await prisma.expense.findMany({
      where: { eventId },
      include: { category: true, vendor: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ expenses });
  } catch (error: any) {
    console.error('Fetch expenses error:', error);
    return NextResponse.json({ error: 'Failed to retrieve expenses' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params;
    const {
      categoryId,
      title,
      amount,
      status = 'PENDING',
      paymentDate,
      receiptUrl,
      vendorId,
      notes,
      isEstimated = false,
    } = await req.json();

    if (!categoryId || !title || amount === undefined) {
      return NextResponse.json({ error: 'Category, title, and amount are required' }, { status: 400 });
    }

    const expense = await prisma.expense.create({
      data: {
        eventId,
        categoryId,
        title: title.trim(),
        amount: Number(amount) || 0,
        status,
        paymentDate: paymentDate ? new Date(paymentDate) : null,
        receiptUrl,
        vendorId: vendorId || null,
        notes: notes?.trim() || null,
        isEstimated: Boolean(isEstimated),
      },
      include: { category: true, vendor: true },
    });

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error: any) {
    console.error('Create expense error:', error);
    return NextResponse.json({ error: 'Failed to record expense' }, { status: 500 });
  }
}
