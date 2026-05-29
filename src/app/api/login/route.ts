import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db, { initDB } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'amengxilin-secret-key-2024';

export async function POST(request: Request) {
  try {
    await initDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: '请填写邮箱和密码' }, { status: 400 });
    }

    const result = await db.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password as string);
    if (!valid) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      message: '登录成功',
      username: user.username,
      email: user.email,
    });
    const isProd = process.env.NODE_ENV === 'production';
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('登录失败详情:', error);
    return NextResponse.json({ error: '登录失败，请稍后重试' }, { status: 500 });
  }
}
