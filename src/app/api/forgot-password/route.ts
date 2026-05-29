import { NextResponse } from 'next/server';
import crypto from 'crypto';
import db, { initDB } from '@/lib/db';
import { sendResetEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    await initDB();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: '请输入邮箱' }, { status: 400 });
    }

    const result = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ?',
      args: [email],
    });

    // 无论用户是否存在，都返回成功（防止邮箱枚举攻击）
    if (result.rows.length === 0) {
      return NextResponse.json({ message: '如果该邮箱已注册，重置链接已发送' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 30 * 60 * 1000; // 30分钟有效期

    await db.execute({
      sql: 'UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?',
      args: [resetToken, expires, email],
    });

    await sendResetEmail(email, resetToken);

    return NextResponse.json({ message: '如果该邮箱已注册，重置链接已发送' });
  } catch {
    return NextResponse.json({ error: '发送失败' }, { status: 500 });
  }
}
