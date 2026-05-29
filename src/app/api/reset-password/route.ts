import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db, { initDB } from '@/lib/db';

export async function POST(request: Request) {
  try {
    await initDB();
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: '请填写完整信息' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: '密码至少6位' }, { status: 400 });
    }

    const result = await db.execute({
      sql: 'SELECT id, reset_expires FROM users WHERE reset_token = ?',
      args: [token],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: '链接无效或已过期' }, { status: 400 });
    }

    const user = result.rows[0];
    if (Number(user.reset_expires) < Date.now()) {
      return NextResponse.json({ error: '链接已过期，请重新申请' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute({
      sql: 'UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE reset_token = ?',
      args: [hashedPassword, token],
    });

    return NextResponse.json({ message: '密码重置成功' });
  } catch {
    return NextResponse.json({ error: '重置失败' }, { status: 500 });
  }
}
