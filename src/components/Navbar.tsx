'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);

  useEffect(() => {
    fetch('/api/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200">
      <Link href="/" className="text-2xl font-bold">
        阿梦西林
      </Link>
      <div className="flex gap-6 items-center text-sm">
        <Link href="/" className="hover:text-gray-500 transition">首页</Link>
        <Link href="/episodes" className="hover:text-gray-500 transition">全部剧集</Link>
        {user ? (
          <div className="flex gap-4 items-center">
            <span className="text-gray-600">{user.username}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              退出
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
              登录
            </Link>
            <Link href="/register" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
              注册
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
