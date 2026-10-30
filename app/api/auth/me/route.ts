import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        systemRole: true,
        workspaces: {
          include: {
            workspace: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        systemRole: user.systemRole,
      },
      workspaces: user.workspaces.map((w) => ({
        ...w.workspace,
        role: w.role,
      })),
      activeWorkspace: user.workspaces[0]?.workspace || null,
    });
  } catch (error: any) {
    console.error('Session check error:', error);
    return NextResponse.json({ error: 'Failed to verify session' }, { status: 500 });
  }
}
