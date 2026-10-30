import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ eventId: string; taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const body = await req.json();

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        priority: body.priority,
        dueDate: body.dueDate !== undefined ? (body.dueDate ? new Date(body.dueDate) : null) : undefined,
        category: body.category,
      },
    });

    return NextResponse.json({ task: updated });
  } catch (error: any) {
    console.error('Update task error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ eventId: string; taskId: string }> }
) {
  try {
    const { taskId } = await params;
    await prisma.task.delete({ where: { id: taskId } });
    return NextResponse.json({ success: true, message: 'Task deleted' });
  } catch (error: any) {
    console.error('Delete task error:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
