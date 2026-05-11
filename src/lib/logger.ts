const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
} as const

type LogLevel = keyof typeof LOG_LEVELS

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, any>
  error?: {
    message: string
    stack?: string
    name: string
  }
  request?: {
    method: string
    url: string
    userAgent?: string
    ip?: string
  }
  response?: {
    statusCode: number
    duration: number
  }
}

const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'info'

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] <= LOG_LEVELS[currentLevel]
}

function formatLog(entry: LogEntry): string {
  const base = `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`

  if (entry.context) {
    return `${base} ${JSON.stringify(entry.context)}`
  }

  if (entry.error) {
    return `${base}\nError: ${entry.error.message}\nStack: ${entry.error.stack}`
  }

  return base
}

function createLogEntry(
  level: LogLevel,
  message: string,
  context?: Record<string, any>
): LogEntry {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
  }
}

export const logger = {
  error(message: string, error?: Error, context?: Record<string, any>) {
    if (!shouldLog('error')) return

    const entry: LogEntry = {
      ...createLogEntry('error', message, context),
      error: error
        ? {
            message: error.message,
            stack: error.stack,
            name: error.name,
          }
        : undefined,
    }

    console.error(formatLog(entry))

    if (process.env.NODE_ENV === 'production') {
      saveLogToDatabase(entry).catch(console.error)
    }
  },

  warn(message: string, context?: Record<string, any>) {
    if (!shouldLog('warn')) return

    const entry = createLogEntry('warn', message, context)
    console.warn(formatLog(entry))
  },

  info(message: string, context?: Record<string, any>) {
    if (!shouldLog('info')) return

    const entry = createLogEntry('info', message, context)
    console.log(formatLog(entry))
  },

  http(message: string, context?: Record<string, any>) {
    if (!shouldLog('http')) return

    const entry = createLogEntry('http', message, context)
    console.log(formatLog(entry))
  },

  debug(message: string, context?: Record<string, any>) {
    if (!shouldLog('debug')) return

    const entry = createLogEntry('debug', message, context)
    console.log(formatLog(entry))
  },

  logRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    userAgent?: string,
    ip?: string
  ) {
    if (!shouldLog('http')) return

    const entry: LogEntry = {
      ...createLogEntry('http', `${method} ${url}`),
      request: { method, url, userAgent, ip },
      response: { statusCode, duration },
    }

    const color = statusCode >= 500 ? '\x1b[31m' : statusCode >= 400 ? '\x1b[33m' : '\x1b[32m'
    console.log(`${color}${formatLog(entry)}\x1b[0m`)
  },

  logError(error: Error, context?: Record<string, any>) {
    this.error(error.message, error, context)
  },
}

async function saveLogToDatabase(entry: LogEntry): Promise<void> {
  // No-op: database logging disabled
}

export async function getLogs(
  limit: number = 100,
  level?: LogLevel
): Promise<LogEntry[]> {
  return []
}

export function logPerformance(
  operation: string,
  duration: number,
  context?: Record<string, any>
) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: 'info',
    message: `Performance: ${operation}`,
    context: {
      duration_ms: duration,
      ...context,
    },
  }

  if (duration > 1000) {
    logger.warn(`Slow operation: ${operation} took ${duration}ms`, context)
  } else {
    logger.debug(formatLog(entry))
  }
}

export function logApiCall(
  method: string,
  endpoint: string,
  statusCode: number,
  duration: number,
  error?: Error
) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: error ? 'error' : statusCode >= 400 ? 'warn' : 'info',
    message: `API: ${method} ${endpoint} - ${statusCode}`,
    context: {
      method,
      endpoint,
      statusCode,
      duration_ms: duration,
      success: statusCode >= 200 && statusCode < 300,
    },
    error: error
      ? {
          message: error.message,
          stack: error.stack,
          name: error.name,
        }
      : undefined,
  }

  const color =
    error || statusCode >= 500
      ? '\x1b[31m'
      : statusCode >= 400
        ? '\x1b[33m'
        : '\x1b[32m'

  console.log(`${color}${formatLog(entry)}\x1b[0m`)
}

export default logger
