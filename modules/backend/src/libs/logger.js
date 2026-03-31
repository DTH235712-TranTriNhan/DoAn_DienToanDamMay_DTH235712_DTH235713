// Logger đơn giản với structured output (JSON khi production)
const isProd = process.env.NODE_ENV === "production";

const formatMessage = (level, context, message, data) => {
  if (isProd) {
    // JSON format — cực kỳ quan trọng để Cloud Logging (như Render/Datadog) có thể filter/search
    return JSON.stringify({
      level,
      context,
      message,
      ...(data && { data }),
      timestamp: new Date().toISOString()
    });
  }
  // Dev (Local): Hiển thị màu sắc và định dạng dễ nhìn để Team Lead debug
  const prefix = `[${context}]`;
  return data ? `${prefix} ${message} ${JSON.stringify(data, null, 2)}` : `${prefix} ${message}`;
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

export default logger;
