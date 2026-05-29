import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_AUTH_API_KEY);

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://animation-app-ashy.vercel.app';

export async function sendVerifyEmail(email: string, token: string) {
  const url = `${SITE_URL}/api/verify-email?token=${token}`;

  await resend.emails.send({
    from: '阿梦西林 <onboarding@resend.dev>',
    to: email,
    subject: '请验证您的邮箱 - 阿梦西林',
    html: `
      <div style="max-width:600px;margin:0 auto;padding:40px;font-family:Arial,sans-serif;">
        <h1 style="font-size:24px;margin-bottom:20px;">阿梦西林 - 邮箱验证</h1>
        <p style="font-size:16px;color:#333;margin-bottom:20px;">
          您好！感谢您注册阿梦西林账号。请点击下方按钮验证您的邮箱：
        </p>
        <a href="${url}" style="display:inline-block;padding:14px 28px;background:#000;color:#fff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:bold;">
          验证邮箱
        </a>
        <p style="font-size:14px;color:#666;margin-top:30px;">
          如果按钮无法点击，请复制以下链接到浏览器打开：<br/>
          <a href="${url}">${url}</a>
        </p>
        <p style="font-size:14px;color:#999;margin-top:20px;">
          如果您没有注册阿梦西林账号，请忽略此邮件。
        </p>
      </div>
    `,
  });
}

export async function sendResetEmail(email: string, token: string) {
  const url = `${SITE_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: '阿梦西林 <onboarding@resend.dev>',
    to: email,
    subject: '重置密码 - 阿梦西林',
    html: `
      <div style="max-width:600px;margin:0 auto;padding:40px;font-family:Arial,sans-serif;">
        <h1 style="font-size:24px;margin-bottom:20px;">阿梦西林 - 重置密码</h1>
        <p style="font-size:16px;color:#333;margin-bottom:20px;">
          您好！请点击下方按钮重置您的密码：
        </p>
        <a href="${url}" style="display:inline-block;padding:14px 28px;background:#000;color:#fff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:bold;">
          重置密码
        </a>
        <p style="font-size:14px;color:#666;margin-top:30px;">
          如果按钮无法点击，请复制以下链接到浏览器打开：<br/>
          <a href="${url}">${url}</a>
        </p>
        <p style="font-size:14px;color:#999;margin-top:20px;">
          此链接30分钟内有效。如果您没有请求重置密码，请忽略此邮件。
        </p>
      </div>
    `,
  });
}
