'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function VerifyResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  const configs: Record<string, { icon: string; title: string; message: string; color: string }> = {
    success: {
      icon: '✓',
      title: '验证成功',
      message: '您的邮箱已验证通过，现在可以使用全部功能了。',
      color: 'text-green-600',
    },
    invalid: {
      icon: '✗',
      title: '链接无效',
      message: '验证链接无效或已过期，请重新注册或联系客服。',
      color: 'text-red-600',
    },
    error: {
      icon: '✗',
      title: '验证失败',
      message: '验证过程中出现错误，请稍后重试。',
      color: 'text-red-600',
    },
  };

  const config = configs[status || ''] || configs.error;

  return (
    <div className="text-center">
      <div className={`text-6xl mb-6 ${config.color}`}>{config.icon}</div>
      <h1 className={`text-3xl font-bold mb-4 ${config.color}`}>{config.title}</h1>
      <p className="text-gray-500 mb-8">{config.message}</p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
      >
        返回首页
      </Link>
    </div>
  );
}

export default function VerifyResultPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-gray-500">加载中...</div>}>
        <VerifyResultContent />
      </Suspense>
    </div>
  );
}
