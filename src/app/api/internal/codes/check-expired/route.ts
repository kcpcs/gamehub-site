import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkCodeValidity } from '@/lib/codes-checker';

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
    const { dryRun = false } = await req.json().catch(() => ({ dryRun: false }));

    const activeCodes = await db.gameCode.findMany({
      where: { status: 'active' },
      include: {
        game: {
          select: { name: true, slug: true }
        }
      }
    });

    const stats = {
      totalChecked: 0,
      expiredCount: 0,
      validCount: 0,
      errorCount: 0
    };

    for (const codeRecord of activeCodes) {
      try {
        const result = await checkCodeValidity(codeRecord.code, codeRecord.game.slug);
        
        stats.totalChecked++;
        
        if (!result.valid) {
          stats.expiredCount++;
          
          if (!dryRun) {
            await db.gameCode.update({
              where: { id: codeRecord.id },
              data: {
                status: 'expired',
                expires_at: new Date()
              }
            });
          }
        } else {
          stats.validCount++;
        }
      } catch {
        stats.errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalChecked: stats.totalChecked,
        expiredCount: stats.expiredCount,
        validCount: stats.validCount,
        errorCount: stats.errorCount,
        dryRun
      },
      message: dryRun 
        ? `检测完成（模拟模式）：发现 ${stats.expiredCount} 个失效兑换码`
        : `检测完成：已标记 ${stats.expiredCount} 个失效兑换码`
    });

  } catch (error) {
    console.error('[POST /api/internal/codes/check-expired]', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}