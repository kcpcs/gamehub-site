import { NextRequest, NextResponse } from 'next/server';
import { notifyReleases } from '@/lib/release-notifier';

const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;

export async function POST(req: NextRequest) {
  const secret = req.headers.get('INTERNAL_API_SECRET');
  
  if (secret !== INTERNAL_API_SECRET) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized', code: 'UNAUTHORIZED' },
      { status: 401 }
    );
  }

  try {
    const result = await notifyReleases();

    return NextResponse.json({
      success: true,
      data: {
        totalGames: result.totalGames,
        emailsSent: result.emailsSent,
        discordNotifications: result.discordNotifications,
        errors: result.errors.length
      },
      message: `推送完成：${result.totalGames} 个游戏，发送 ${result.emailsSent} 封邮件，${result.discordNotifications} 条 Discord 通知`
    });

  } catch (error) {
    console.error('[POST /api/internal/releases/notify]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}