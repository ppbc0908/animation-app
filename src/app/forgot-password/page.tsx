'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setMessage(data.message);
    } catch {
      setError('发送失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">忘记密码</h1>

        {message ? (
          <div className="text-center">
            <div className="p-4 bg-green-50 text-green-600 rounded-lg mb-6">
              {message}
            </div>
            <p className="text-gray-500 mb-6">请检查您的邮箱，点击重置链接</p>
            <Link href="/login" className="text-black font-medium hover:underline">
              返回登录
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <p className="text-gray-500 text-sm">
              输入您注册时使用的邮箱，我们将发送密码重置链接。
            </p>

            <div>
              <label className="block text-sm font-medium mb-1">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                placeholder="请输入邮箱"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition disabled:bg-gray-400"
            >
              {loading ? '发送中...' : '发送重置链接'}
            </button>
          </form>
        )}

        <p className="text-center mt-6 text-gray-500">
          <Link href="/login" className="text-black font-medium hover:underline">
            返回登录
          </Link>
        </p>
      </div>
    </div>
  );
}
