// Logger đơn giản với structured output (JSON khi production)
// Nếu sau này cần nâng cấp, thay bằng pino hoặc winston

const isProd = process.env.NODE_ENV === "production";

const formatMessage = (level, context, message, data) => {
  if (isProd) {
    // JSON format — dễ parse trên Render/Cloud logging
    return JSON.stringify({
      level,
      context,
      message,
      ...(data && { data }),
      timestamp: new Date().toISOString()
    });
  }
  // Dev: format dễ đọc
  const prefix = `[${context}]`;
  return data ? `${prefix} ${message} ${JSON.stringify(data)}` : `${prefix} ${message}`;
};

const logger = {
  info: (context, message, data) => {
    console.log(formatMessage("info", context, message, data));
  },
  warn: (context, message, data) => {
    console.warn(formatMessage("warn", context, message, data));
  },
  error: (context, message, data) => {
    console.error(formatMessage("error", context, message, data));
  }
};

module.exports = logger;
