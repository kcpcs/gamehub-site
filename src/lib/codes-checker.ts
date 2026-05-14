export interface CodeValidityResult {
  valid: boolean;
  message?: string;
  error?: string;
}

export async function checkCodeValidity(code: string, gameSlug: string): Promise<CodeValidityResult> {
  return { valid: false, message: 'Not implemented' };
}
