type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

const isDev = process.env.NODE_ENV === "development";

function createLogEntry(level: LogLevel, message: string, context?: Record<string, unknown>): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  };
}

function formatLogEntry(entry: LogEntry): string {
  const { level, message, timestamp, context } = entry;
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  const contextStr = context ? ` ${JSON.stringify(context)}` : "";
  return `${prefix} ${message}${contextStr}`;
}

export const logger = {
  debug(message: string, context?: Record<string, unknown>) {
    if (isDev) {
      const entry = createLogEntry("debug", message, context);
      console.debug(formatLogEntry(entry));
    }
  },

  info(message: string, context?: Record<string, unknown>) {
    const entry = createLogEntry("info", message, context);
    if (isDev) {
      console.info(formatLogEntry(entry));
    }
  },

  warn(message: string, context?: Record<string, unknown>) {
    const entry = createLogEntry("warn", message, context);
    console.warn(formatLogEntry(entry));
  },

  error(message: string, context?: Record<string, unknown>) {
    const entry = createLogEntry("error", message, context);
    console.error(formatLogEntry(entry));
  },
};
