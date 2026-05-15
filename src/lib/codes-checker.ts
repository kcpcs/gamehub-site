export interface CodeValidityResult {
  valid: boolean;
  message?: string;
  error?: string;
}

// 常见游戏兑换码格式规则
const CODE_PATTERNS: Record<string, RegExp[]> = {
  // Genshin Impact 格式：通常是 2x3 或 3x3 字母+数字组合
  'genshin-impact': [
    /^[A-Z0-9]{6}$/,           // 6位纯字母数字
    /^[A-Z0-9]{3}-[A-Z0-9]{3}$/,  // 3-3格式
    /^[A-Z0-9]{2}-[A-Z0-9]{2}-[A-Z0-9]{2}$/,  // 2-2-2格式
  ],
  // 通用格式
  'default': [
    /^[A-Z0-9]{4,20}$/,       // 4-20位字母数字
    /^[A-Z0-9-]{4,25}$/,      // 带连字符的格式
  ]
};

/**
 * 检查兑换码格式是否有效
 * @param code 兑换码
 * @param gameSlug 游戏slug
 */
export function validateCodeFormat(code: string, gameSlug?: string): { valid: boolean; message?: string } {
  const cleanCode = code.trim().toUpperCase();

  // 1. 先检查明显无效的模式
  const obviousInvalid = [
    /^TEST/i,                  // 测试码
    /^EXPIRE/i,                // 过期标记
    /^INVALID/i,               // 无效标记
    /^PLACEHOLDER/i,           // 占位符
    /^\s*$/,                   // 空白
  ];
  
  for (const pattern of obviousInvalid) {
    if (pattern.test(cleanCode)) {
      return { valid: false, message: 'Invalid code format' };
    }
  }

  // 2. 获取针对特定游戏的验证规则，先尝试匹配
  const patterns = gameSlug ? (CODE_PATTERNS[gameSlug] || CODE_PATTERNS['default']) : CODE_PATTERNS['default'];

  for (const pattern of patterns) {
    if (pattern.test(cleanCode)) {
      return { valid: true };
    }
  }

  // 3. 如果没有匹配游戏特定规则，再检查更一般的无效模式
  const moreInvalid = [
    /^[0-9]+$/,                // 纯数字（通常无效）
    /^[A-Z0-9]{1,3}$/,         // 太短
    /^[A-Z0-9]{21,}$/,         // 太长
  ];
  
  for (const pattern of moreInvalid) {
    if (pattern.test(cleanCode)) {
      return { valid: false, message: 'Invalid code format' };
    }
  }

  // 4. 最后检查是否是一个合理的通用格式
  if (/^[A-Z0-9-]{4,20}$/.test(cleanCode)) {
    return { valid: true };
  }

  return { valid: false, message: 'Code format not recognized for this game' };
}

/**
 * 检查兑换码是否已过期
 * @param expiresAt 过期时间（ISO字符串或Date）
 */
export function checkIfExpired(expiresAt?: string | Date): { expired: boolean; message?: string } {
  if (!expiresAt) {
    return { expired: false };
  }

  const expiryDate = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  const now = new Date();

  if (expiryDate < now) {
    return { expired: true, message: 'This code has expired' };
  }

  return { expired: false };
}

/**
 * 完整的兑换码验证
 * @param code 兑换码
 * @param gameSlug 游戏slug
 * @param existingCode 数据库中已存在的兑换码数据
 */
export async function checkCodeValidity(
  code: string,
  gameSlug: string,
  existingCode?: {
    status?: string;
    expires_at?: string | Date;
    verified_at?: string | Date;
  }
): Promise<CodeValidityResult> {
  try {
    // 1. 验证格式
    const formatCheck = validateCodeFormat(code, gameSlug);
    if (!formatCheck.valid) {
      return { valid: false, message: formatCheck.message };
    }

    // 2. 如果有数据库记录，检查状态
    if (existingCode) {
      // 检查状态
      if (existingCode.status === 'expired') {
        return { valid: false, message: 'This code has expired' };
      }

      // 检查过期时间
      if (existingCode.expires_at) {
        const expiryCheck = checkIfExpired(existingCode.expires_at);
        if (expiryCheck.expired) {
          return { valid: false, message: expiryCheck.message };
        }
      }

      // 如果是 unverified 状态，说明需要验证但格式已通过
      if (existingCode.status === 'unverified') {
        return { valid: true, message: 'Code submitted, awaiting verification' };
      }

      // 已验证且有效的码
      if (existingCode.status === 'active') {
        return { valid: true, message: 'This code is valid and active' };
      }
    }

    // 3. 新提交的码，格式通过验证
    return { valid: true, message: 'Code format is valid' };

  } catch (error) {
    console.error('[checkCodeValidity] Error:', error);
    return { valid: false, error: 'Error validating code' };
  }
}

/**
 * 批量验证兑换码格式
 */
export function validateCodesBatch(
  codes: string[],
  gameSlug?: string
): { valid: string[]; invalid: { code: string; reason: string }[] } {
  const valid: string[] = [];
  const invalid: { code: string; reason: string }[] = [];

  for (const code of codes) {
    const check = validateCodeFormat(code, gameSlug);
    if (check.valid) {
      valid.push(code.trim().toUpperCase());
    } else {
      invalid.push({ code, reason: check.message || 'Invalid format' });
    }
  }

  return { valid, invalid };
}
