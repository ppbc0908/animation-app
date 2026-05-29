import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'amengxilin-secret-key-2024';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const tokenMatch = cookieHeader.match(/token=([^;]+)/);

    if (!tokenMatch) {
      return NextResponse.json({ user: null });
    }

    const token = tokenMatch[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; username: string };

    return NextResponse.json({
      user: {
        id: decoded.userId,
        email: decoded.email,
        username: decoded.username,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
