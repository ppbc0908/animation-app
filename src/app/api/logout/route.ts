import { NextResponse } from 'next/server';

export async function POST() {
  const isProd = process.env.NODE_ENV === 'production';
  const response = NextResponse.json({ message: '已退出' });
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
