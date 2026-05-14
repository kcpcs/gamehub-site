import { z } from 'zod';

const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  TURSO_AUTH_TOKEN: z.string().optional(),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  ALGOLIA_APP_ID: z.string().optional(),
  ALGOLIA_API_KEY: z.string().optional(),
  ALGOLIA_ADMIN_KEY: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  YOUTUBE_API_KEY: z.string().optional(),
  TWITCH_CLIENT_ID: z.string().optional(),
  TWITCH_CLIENT_SECRET: z.string().optional(),
  TIKTOK_API_KEY: z.string().optional(),
  STEAM_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_BASE_URL: z.string().url().optional(),
  DEFAULT_CLAUDE_MODEL: z.string().optional(),
  DEFAULT_OPUS_MODEL: z.string().optional(),
  DEFAULT_HAIKU_MODEL: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  DIFY_API_KEY: z.string().optional(),
  DIFY_BASE_URL: z.string().url().optional(),
  DIFY_KNOWLEDGE_ID: z.string().optional(),
  INTERNAL_API_SECRET: z.string().optional(),
  ADMIN_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  MAILGUN_API_KEY: z.string().optional(),
  MAILGUN_DOMAIN: z.string().optional(),
  CONVERTKIT_API_KEY: z.string().optional(),
  CONVERTKIT_FORM_ID: z.string().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).optional(),
  ALERT_EMAIL_ENABLED: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  ALERT_EMAIL_RECIPIENTS: z.string().optional(),
  ALERT_SLACK_ENABLED: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  ALERT_SLACK_WEBHOOK_URL: z.string().url().optional(),
  ALERT_DISCORD_ENABLED: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  ALERT_DISCORD_WEBHOOK_URL: z.string().url().optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).optional(),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_ALGOLIA_APP_ID: z.string().optional(),
  NEXT_PUBLIC_ADSENSE_CLIENT: z.string().optional(),
});

const clientEnv = clientSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_ALGOLIA_APP_ID: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  NEXT_PUBLIC_ADSENSE_CLIENT: process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
});

const serverEnv = serverSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
  ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
  ALGOLIA_ADMIN_KEY: process.env.ALGOLIA_ADMIN_KEY,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
  TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET,
  TIKTOK_API_KEY: process.env.TIKTOK_API_KEY,
  STEAM_API_KEY: process.env.STEAM_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  ANTHROPIC_BASE_URL: process.env.ANTHROPIC_BASE_URL,
  DEFAULT_CLAUDE_MODEL: process.env.DEFAULT_CLAUDE_MODEL,
  DEFAULT_OPUS_MODEL: process.env.DEFAULT_OPUS_MODEL,
  DEFAULT_HAIKU_MODEL: process.env.DEFAULT_HAIKU_MODEL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  DIFY_API_KEY: process.env.DIFY_API_KEY,
  DIFY_BASE_URL: process.env.DIFY_BASE_URL,
  DIFY_KNOWLEDGE_ID: process.env.DIFY_KNOWLEDGE_ID,
  INTERNAL_API_SECRET: process.env.INTERNAL_API_SECRET,
  ADMIN_API_KEY: process.env.ADMIN_API_KEY,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
  MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
  CONVERTKIT_API_KEY: process.env.CONVERTKIT_API_KEY,
  CONVERTKIT_FORM_ID: process.env.CONVERTKIT_FORM_ID,
  LOG_LEVEL: process.env.LOG_LEVEL,
  ALERT_EMAIL_ENABLED: process.env.ALERT_EMAIL_ENABLED,
  ALERT_EMAIL_RECIPIENTS: process.env.ALERT_EMAIL_RECIPIENTS,
  ALERT_SLACK_ENABLED: process.env.ALERT_SLACK_ENABLED,
  ALERT_SLACK_WEBHOOK_URL: process.env.ALERT_SLACK_WEBHOOK_URL,
  ALERT_DISCORD_ENABLED: process.env.ALERT_DISCORD_ENABLED,
  ALERT_DISCORD_WEBHOOK_URL: process.env.ALERT_DISCORD_WEBHOOK_URL,
  NODE_ENV: process.env.NODE_ENV,
});

if (!clientEnv.success) {
  console.error('❌ Invalid client environment variables:', clientEnv.error.format());
  throw new Error('Invalid client environment variables');
}

if (!serverEnv.success) {
  console.error('❌ Invalid server environment variables:', serverEnv.error.format());
  throw new Error('Invalid server environment variables');
}

export const env = {
  ...serverEnv.data,
  ...clientEnv.data,
};
