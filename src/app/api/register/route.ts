import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db, { initDB } from '@/lib/db';
import { sendVerifyEmail } from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'amengxilin-secret-key-2024';

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

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
    const verifyToken = generateToken();

    const result = await db.execute({
      sql: 'INSERT INTO users (email, password, username, verify_token) VALUES (?, ?, ?, ?)',
      args: [email, hashedPassword, username, verifyToken],
    });

    // 发送验证邮件（失败不阻止注册）
    try {
      await sendVerifyEmail(email, verifyToken);
    } catch (emailError) {
      console.error('验证邮件发送失败:', emailError);
    }

    const token = jwt.sign(
      { userId: Number(result.lastInsertRowid), email, username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const isProd = process.env.NODE_ENV === 'production';
    const response = NextResponse.json({
      message: '注册成功，请查收验证邮件',
      username,
      email,
    });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('注册失败详情:', error);
    return NextResponse.json({ error: '注册失败，请稍后重试' }, { status: 500 });
  }
}
