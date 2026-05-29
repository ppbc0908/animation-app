import { NextResponse } from 'next/server';
import db, { initDB } from '@/lib/db';

export async function GET(request: Request) {
  try {
    await initDB();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/verify-result?status=invalid', request.url));
    }

    const result = await db.execute({
      sql: 'SELECT id FROM users WHERE verify_token = ?',
      args: [token],
    });

    if (result.rows.length === 0) {
      return NextResponse.redirect(new URL('/verify-result?status=invalid', request.url));
    }

    await db.execute({
      sql: 'UPDATE users SET verified = 1, verify_token = NULL WHERE verify_token = ?',
      args: [token],
    });

    return NextResponse.redirect(new URL('/verify-result?status=success', request.url));
  } catch {
    return NextResponse.redirect(new URL('/verify-result?status=error', request.url));
  }
}
