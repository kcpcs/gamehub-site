interface Alert {
  id: string
  type: 'error' | 'warning' | 'info' | 'critical'
  title: string
  message: string
  timestamp: string
  resolved: boolean
  metadata?: Record<string, any>
}

interface AlertConfig {
  email?: {
    enabled: boolean
    recipients: string[]
  }
  slack?: {
    enabled: boolean
    webhookUrl: string
  }
  discord?: {
    enabled: boolean
    webhookUrl: string
  }
}

class AlertManager {
  private alerts: Alert[] = []
  private config: AlertConfig = {}
  private alertHistory: Alert[] = []
  private maxHistorySize = 100

  constructor() {
    this.loadConfig()
  }

  private loadConfig() {
    this.config = {
      email: {
        enabled: process.env.ALERT_EMAIL_ENABLED === 'true',
        recipients: (process.env.ALERT_EMAIL_RECIPIENTS || '').split(',').filter(Boolean),
      },
      slack: {
        enabled: process.env.ALERT_SLACK_ENABLED === 'true',
        webhookUrl: process.env.ALERT_SLACK_WEBHOOK_URL || '',
      },
      discord: {
        enabled: process.env.ALERT_DISCORD_ENABLED === 'true',
        webhookUrl: process.env.ALERT_DISCORD_WEBHOOK_URL || '',
      },
    }
  }

  async send(alert: Omit<Alert, 'id' | 'timestamp' | 'resolved'>) {
    const newAlert: Alert = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      resolved: false,
    }

    this.alerts.push(newAlert)
    this.alertHistory.push(newAlert)

    if (this.alertHistory.length > this.maxHistorySize) {
      this.alertHistory.shift()
    }

    console.log(`[ALERT] ${alert.type.toUpperCase()}: ${alert.title}`)
    console.log(`[ALERT] Message: ${alert.message}`)

    await this.notify(newAlert)

    return newAlert.id
  }

  async notify(alert: Alert) {
    const tasks: Promise<void>[] = []

    if (this.config.slack?.enabled && this.config.slack.webhookUrl) {
      tasks.push(this.sendToSlack(alert))
    }

    if (this.config.discord?.enabled && this.config.discord.webhookUrl) {
      tasks.push(this.sendToDiscord(alert))
    }

    if (this.config.email?.enabled && this.config.email.recipients.length > 0) {
      tasks.push(this.sendEmail(alert))
    }

    await Promise.allSettled(tasks)
  }

  private async sendToSlack(alert: Alert): Promise<void> {
    try {
      const payload = {
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `🚨 ${alert.title}`,
              emoji: true,
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: alert.message,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `*Type:* ${alert.type} | *Time:* ${alert.timestamp}`,
              },
            ],
          },
        ],
      }

      await fetch(this.config.slack!.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('[ALERT] Slack notification sent')
    } catch (error) {
      console.error('[ALERT] Failed to send Slack notification:', error)
    }
  }

  private async sendToDiscord(alert: Alert): Promise<void> {
    try {
      const colorMap: Record<string, number> = {
        critical: 15158332,
        error: 15105570,
        warning: 16776960,
        info: 3447003,
      }

      const payload = {
        embeds: [
          {
            title: alert.title,
            description: alert.message,
            color: colorMap[alert.type] || colorMap.info,
            timestamp: alert.timestamp,
            fields: [
              {
                name: 'Type',
                value: alert.type,
                inline: true,
              },
              {
                name: 'Status',
                value: alert.resolved ? '✅ Resolved' : '❌ Active',
                inline: true,
              },
            ],
          },
        ],
      }

      await fetch(this.config.discord!.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('[ALERT] Discord notification sent')
    } catch (error) {
      console.error('[ALERT] Failed to send Discord notification:', error)
    }
  }

  private async sendEmail(alert: Alert): Promise<void> {
    console.log(`[ALERT] Email notification would be sent to: ${this.config.email?.recipients.join(', ')}`)
  }

  resolve(alertId: string) {
    const alert = this.alerts.find((a) => a.id === alertId)
    if (alert) {
      alert.resolved = true
      console.log(`[ALERT] Alert resolved: ${alertId}`)
    }
  }

  getActive(): Alert[] {
    return this.alerts.filter((a) => !a.resolved)
  }

  getHistory(limit: number = 50): Alert[] {
    return this.alertHistory.slice(-limit)
  }

  clear() {
    this.alerts = []
  }
}

export const alertManager = new AlertManager()

export function logAlert(
  type: 'error' | 'warning' | 'info' | 'critical',
  title: string,
  message: string,
  metadata?: Record<string, any>
) {
  alertManager.send({ type, title, message, metadata }).catch(console.error)
}

export function logErrorAlert(error: Error, context?: Record<string, any>) {
  logAlert(
    'error',
    'Error Occurred',
    error.message,
    { ...context, stack: error.stack, name: error.name }
  )
}

export function logWarningAlert(warning: string, context?: Record<string, any>) {
  logAlert('warning', 'Warning', warning, context)
}

export function logCriticalAlert(message: string, context?: Record<string, any>) {
  logAlert('critical', 'Critical Issue', message, context)
}

export function logInfoAlert(message: string, context?: Record<string, any>) {
  logAlert('info', 'Information', message, context)
}
