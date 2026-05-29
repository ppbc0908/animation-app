'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">链接无效</p>
        <Link href="/forgot-password" className="text-black font-medium hover:underline">
          重新申请重置
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('两次密码不一致');
      return;
    }

    if (password.length < 6) {
      setError('密码至少6位');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setMessage('密码重置成功！3秒后跳转到登录页...');
      setTimeout(() => router.push('/login'), 3000);
    } catch {
      setError('重置失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      {message && (
        <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg">
          {message}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">新密码</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          placeholder="请输入新密码（至少6位）"
          minLength={6}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">确认密码</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          placeholder="请再次输入密码"
          minLength={6}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition disabled:bg-gray-400"
      >
        {loading ? '重置中...' : '重置密码'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">重置密码</h1>
        <Suspense fallback={<div className="text-center text-gray-500">加载中...</div>}>
          <ResetPasswordForm />
        </Suspense>
        <p className="text-center mt-6 text-gray-500">
          <Link href="/login" className="text-black font-medium hover:underline">
            返回登录
          </Link>
        </p>
      </div>
    </div>
  );
}
