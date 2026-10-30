import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ eventId: string; expenseId: string }> }
) {
  try {
    const { expenseId } = await params;
    const body = await req.json();

    const updated = await prisma.expense.update({
      where: { id: expenseId },
      data: {
        title: body.title,
        amount: body.amount !== undefined ? Number(body.amount) : undefined,
        status: body.status,
        paymentDate: body.paymentDate ? new Date(body.paymentDate) : null,
        categoryId: body.categoryId,
        vendorId: body.vendorId,
        notes: body.notes,
        isEstimated: body.isEstimated !== undefined ? Boolean(body.isEstimated) : undefined,
      },
      include: { category: true, vendor: true },
    });

    return NextResponse.json({ expense: updated });
  } catch (error: any) {
    console.error('Update expense error:', error);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ eventId: string; expenseId: string }> }
) {
  try {
    const { expenseId } = await params;
    await prisma.expense.delete({ where: { id: expenseId } });
    return NextResponse.json({ success: true, message: 'Expense deleted' });
  } catch (error: any) {
    console.error('Delete expense error:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}
