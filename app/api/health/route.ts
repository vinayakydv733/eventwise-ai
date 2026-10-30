import { NextResponse } from 'next/server';
import { isAIConfigured } from '@/lib/ai/provider';
import prisma from '@/lib/db';

export async function GET() {
  let dbOk = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch (e: any) {
    dbOk = false;
  }

  const aiOk = isAIConfigured();

  return NextResponse.json({
    status: dbOk ? 'healthy' : 'degraded',
    databaseConnected: dbOk,
    aiConfigured: aiOk,
    aiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
}
