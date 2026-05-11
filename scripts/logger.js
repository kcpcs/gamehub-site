/**
 * 日志系统 - AI工作流专用
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  SUCCESS: 4
};

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

let currentLogLevel = LOG_LEVELS.INFO;

export function setLogLevel(level) {
  if (LOG_LEVELS[level.toUpperCase()] !== undefined) {
    currentLogLevel = LOG_LEVELS[level.toUpperCase()];
  }
}

function getTimestamp() {
  return new Date().toISOString();
}

function formatMessage(prefix, message, color) {
  const timestamp = getTimestamp();
  const formattedMsg = Array.isArray(message) ? message.join(' ') : message;
  return `${COLORS.dim}[${timestamp}]${COLORS.reset} ${color}${prefix}${COLORS.reset} ${formattedMsg}`;
}

export function createLogger(context) {
  return {
    context,

    debug(...messages) {
      if (currentLogLevel <= LOG_LEVELS.DEBUG) {
        console.log(formatMessage('[DEBUG]', messages, COLORS.cyan));
      }
    },

    info(...messages) {
      if (currentLogLevel <= LOG_LEVELS.INFO) {
        console.log(formatMessage('[INFO]', messages, COLORS.blue));
      }
    },

    warn(...messages) {
      if (currentLogLevel <= LOG_LEVELS.WARN) {
        console.warn(formatMessage('[WARN]', messages, COLORS.yellow));
      }
    },

    error(...messages) {
      if (currentLogLevel <= LOG_LEVELS.ERROR) {
        console.error(formatMessage('[ERROR]', messages, COLORS.red));
      }
    },

    success(...messages) {
      if (currentLogLevel <= LOG_LEVELS.SUCCESS) {
        console.log(formatMessage('[SUCCESS]', messages, COLORS.green));
      }
    }
  };
}

export const logger = createLogger('system');

export const LOG_LEVELS_EXPORT = LOG_LEVELS;
