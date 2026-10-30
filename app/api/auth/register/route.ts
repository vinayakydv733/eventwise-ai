import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword, createSessionToken, setSessionCookie } from '@/lib/auth/session';
import { slugify } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const { email, password, name, workspaceName } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const finalWorkspaceName = workspaceName?.trim() || `${name}'s Workspace`;
    let baseSlug = slugify(finalWorkspaceName) || 'my-workspace';
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.workspace.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // Create user and workspace in a transaction
    const { user, workspace } = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: email.toLowerCase().trim(),
          passwordHash,
          name: name.trim(),
        },
      });

      const newWorkspace = await tx.workspace.create({
        data: {
          name: finalWorkspaceName,
          slug,
          ownerId: newUser.id,
          currency: 'INR',
          locale: 'en-IN',
          timezone: 'Asia/Kolkata',
          members: {
            create: {
              userId: newUser.id,
              role: 'OWNER',
            },
          },
        },
      });

      return { user: newUser, workspace: newWorkspace };
    });

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      systemRole: user.systemRole,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      workspace,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
