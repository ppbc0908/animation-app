import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db, { initDB } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'amengxilin-secret-key-2024';

export async function POST(request: Request) {
  try {
    await initDB();
    const { email, password, username } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json({ error: '请填写所有字段' }, { status: 400 });
    }

    const existing = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email],
    });

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: '邮箱已注册' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.execute({
      sql: 'INSERT INTO users (email, password, username) VALUES (?, ?, ?)',
      args: [email, hashedPassword, username],
    });

    const token = jwt.sign(
      { userId: Number(result.lastInsertRowid), email, username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({ message: '注册成功', username, email });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: '注册失败' }, { status: 500 });
  }
}
