export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const resendApiKey = process.env.RESEND_API_KEY
    const mailgunApiKey = process.env.MAILGUN_API_KEY
    const mailgunDomain = process.env.MAILGUN_DOMAIN

    if (resendApiKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'GameHub <notifications@gamehub.pro>',
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text
        })
      })

      const data = await response.json()
      return data.id !== undefined
    } else if (mailgunApiKey && mailgunDomain) {
      const response = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`api:${mailgunApiKey}`).toString('base64')}`
        },
        body: new URLSearchParams({
          from: 'GameHub <notifications@gamehub.pro>',
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text || ''
        })
      })

      const data = await response.json()
      return data.id !== undefined
    } else {
      console.log('[Mailer] No email provider configured, skipping send:', options.subject)
      return true
    }
  } catch (error) {
    console.error('[Mailer] Send email failed:', error)
    return false
  }
}

export function generateUnsubscribeLink(token: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL || 'https://gamehub.pro'}/api/subscribe?token=${token}&action=unsubscribe`
}

export function generateSubscriptionEmail(email: string, token: string, games: string[] = []): { subject: string; html: string } {
  const unsubscribeLink = generateUnsubscribeLink(token)
  const gameList = games.length > 0 ? `<p class="game-list">You're subscribed for: ${games.map(g => `<strong>${g}</strong>`).join(', ')}</p>` : ''

  return {
    subject: 'Welcome to GameHub Notifications!',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to GameHub</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0d1117; }
          .container { background: #161b22; border-radius: 12px; padding: 30px; border: 1px solid #30363d; }
          .logo { font-size: 24px; font-weight: bold; color: #7c3aed; margin-bottom: 20px; }
          h1 { color: #e6edf3; font-size: 20px; margin-bottom: 16px; }
          p { color: #8b949e; font-size: 14px; line-height: 1.6; margin-bottom: 12px; }
          .game-list { background: #21262d; padding: 12px; border-radius: 8px; }
          .game-list strong { color: #7c3aed; }
          .button { display: inline-block; background: linear-gradient(135deg, #7c3aed, #8b5cf6); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
          .unsubscribe { color: #8b949e; font-size: 12px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #30363d; }
          .unsubscribe a { color: #8b949e; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🎮 GameHub</div>
          <h1>Welcome to GameHub Notifications!</h1>
          <p>Thanks for subscribing! We'll send you updates when new codes, guides, and tier lists are available for your favorite games.</p>
          ${gameList}
          <p>Stay tuned for exclusive content and never miss a redeemable code!</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://gamehub.pro'}" class="button">Explore GameHub</a>
          <div class="unsubscribe">
            <p>To unsubscribe, click <a href="${unsubscribeLink}">here</a>.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}

export function generateNewCodeEmail(email: string, token: string, gameName: string, code: string, reward: string): { subject: string; html: string } {
  const unsubscribeLink = generateUnsubscribeLink(token)

  return {
    subject: `New ${gameName} Code Available!`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Code Alert</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0d1117; }
          .container { background: #161b22; border-radius: 12px; padding: 30px; border: 1px solid #30363d; }
          .logo { font-size: 24px; font-weight: bold; color: #7c3aed; margin-bottom: 20px; }
          .alert-badge { display: inline-block; background: #22c55e; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
          h1 { color: #e6edf3; font-size: 20px; margin-bottom: 16px; }
          p { color: #8b949e; font-size: 14px; line-height: 1.6; margin-bottom: 12px; }
          .code-box { background: linear-gradient(135deg, #7c3aed, #8b5cf6); color: white; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .code-box .code { font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; letter-spacing: 2px; }
          .code-box .reward { font-size: 14px; opacity: 0.9; margin-top: 8px; }
          .button { display: inline-block; background: #22c55e; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0; }
          .unsubscribe { color: #8b949e; font-size: 12px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #30363d; }
          .unsubscribe a { color: #8b949e; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🎮 GameHub</div>
          <div class="alert-badge">NEW CODE</div>
          <h1>New ${gameName} Code Available!</h1>
          <p>We've found a new redeemable code for ${gameName}. Claim it before it expires!</p>
          <div class="code-box">
            <div class="code">${code}</div>
            <div class="reward">Reward: ${reward}</div>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://gamehub.pro'}/codes/${gameName.toLowerCase().replace(/\s+/g, '-')}" class="button">Redeem Now</a>
          <p>Hurry, codes expire quickly!</p>
          <div class="unsubscribe">
            <p>To unsubscribe from ${gameName} updates, click <a href="${unsubscribeLink}">here</a>.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
}