import { db } from '@/lib/db';
import { sendEmail } from '@/lib/mailer';
import { sendDiscordNotification } from '@/lib/discordService';

export interface ReleaseNotificationResult {
  totalGames: number;
  emailsSent: number;
  discordNotifications: number;
  errors: string[];
}

export async function notifyReleases(): Promise<ReleaseNotificationResult> {
  const now = new Date();
  const endOfDay = new Date();
  endOfDay.setDate(now.getDate() + 1);
  endOfDay.setHours(23, 59, 59, 999);

  const games = await db.game.findMany({
    where: {
      release_date: {
        gte: now,
        lte: endOfDay
      }
    },
    select: {
      id: true,
      slug: true,
      name: true,
      cover_url: true,
      release_date: true,
      platforms: true,
      genres: true
    }
  });

  if (games.length === 0) {
    return {
      totalGames: 0,
      emailsSent: 0,
      discordNotifications: 0,
      errors: []
    };
  }

  const stats = {
    emailsSent: 0,
    discordNotifications: 0,
    errors: [] as string[]
  };

  for (const game of games) {
    const subscribers = await db.subscriber.findMany({
      where: {
        status: 'active'
      }
    });

    const subscribedUsers = subscribers.filter(subscriber => {
      const subscriptions = getSubscriptions(subscriber);
      return subscriptions.includes(game.id) || subscriptions.includes(game.slug);
    });

    for (const subscriber of subscribedUsers) {
      if (subscriber.email) {
        try {
          const emailContent = generateReleaseEmail(
            game.name,
            game.release_date?.toISOString() || '',
            game.slug
          );
          await sendEmail({
            to: subscriber.email,
            subject: emailContent.subject,
            html: emailContent.html
          });
          stats.emailsSent++;
        } catch (error) {
          stats.errors.push(`Email failed for ${subscriber.email}: ${error instanceof Error ? error.message : error}`);
        }
      }

      if (subscriber.discord_webhook_url) {
        try {
          await sendDiscordNotification(subscriber.discord_webhook_url, {
            title: `${game.name} Releases Today!`,
            description: `Check out the latest release!`,
            url: `${process.env.NEXT_PUBLIC_APP_URL}/games/${game.slug}`,
            color: 0x22c55e,
            fields: [
              { name: 'Release Date', value: game.release_date?.toLocaleDateString() || 'Today', inline: true },
              { name: 'Platforms', value: parsePlatforms(game.platforms).join(', ') || 'Multiple', inline: true }
            ],
            thumbnail: game.cover_url
          });
          stats.discordNotifications++;
        } catch (error) {
          stats.errors.push(`Discord failed for ${subscriber.email}: ${error instanceof Error ? error.message : error}`);
        }
      }
    }
  }

  return {
    totalGames: games.length,
    emailsSent: stats.emailsSent,
    discordNotifications: stats.discordNotifications,
    errors: stats.errors
  };
}

function getSubscriptions(subscriber: { games?: string | null; game_subscriptions?: unknown; discord_webhook_url?: string | null }): string[] {
  const subscriptions: string[] = [];

  if (subscriber.game_subscriptions) {
    try {
      const parsed = typeof subscriber.game_subscriptions === 'string'
        ? JSON.parse(subscriber.game_subscriptions)
        : subscriber.game_subscriptions;
      if (Array.isArray(parsed)) {
        subscriptions.push(...parsed);
      }
    } catch {
    }
  }

  if (subscriber.games) {
    try {
      const parsed = JSON.parse(subscriber.games);
      if (Array.isArray(parsed)) {
        subscriptions.push(...parsed);
      }
    } catch {
    }
  }

  return subscriptions;
}

function parsePlatforms(platformsJson: string | unknown): string[] {
  if (!platformsJson || typeof platformsJson !== 'string') return [];
  try {
    const parsed = JSON.parse(platformsJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function generateReleaseEmail(gameName: string, releaseDate: string, gameSlug: string): { subject: string; html: string } {
  const formattedDate = new Date(releaseDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return {
    subject: `${gameName} Releases Today!`,
    html: generateEmailHtml(gameName, formattedDate, gameSlug)
  };
}

function generateEmailHtml(gameName: string, formattedDate: string, gameSlug: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${gameName} Release Alert</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0d1117; }
    .container { background: #161b22; border-radius: 12px; padding: 30px; border: 1px solid #30363d; }
    .logo { font-size: 24px; font-weight: bold; color: #7c3aed; margin-bottom: 20px; }
    .alert-badge { display: inline-block; background: #22c55e; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
    h1 { color: #e6edf3; font-size: 20px; margin-bottom: 16px; }
    p { color: #8b949e; font-size: 14px; line-height: 1.6; margin-bottom: 12px; }
    .release-date { background: #21262d; padding: 12px; border-radius: 8px; margin: 16px 0; }
    .release-date strong { color: #22c55e; }
    .button { display: inline-block; background: linear-gradient(135deg, #7c3aed, #8b5cf6); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">GameHub</div>
    <div class="alert-badge">RELEASE DAY</div>
    <h1>${gameName} Releases Today!</h1>
    <p>Your subscribed game is now available!</p>
    <div class="release-date">
      <p><strong>Release Date:</strong> ${formattedDate}</p>
    </div>
    <a href="${process.env.NEXT_PUBLIC_APP_URL}/games/${gameSlug}" class="button">View Game Page</a>
    <p>Stay tuned for more updates on your favorite games!</p>
  </div>
</body>
</html>
`;
}
