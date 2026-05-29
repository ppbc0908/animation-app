import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasDbUrl: !!process.env.TURSO_DATABASE_URL,
    hasAuthToken: !!process.env.TURSO_AUTH_TOKEN,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasResendKey: !!process.env.RESEND_AUTH_API_KEY,
    nodeEnv: process.env.NODE_ENV,
  });
}
