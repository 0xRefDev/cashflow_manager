const isDev = process.env.NODE_ENV !== "production";

function fmt(level: string, message: string, meta?: Record<string, unknown>) {
  const entry = { level, message, ts: new Date().toISOString(), ...meta };
  return JSON.stringify(entry);
}

export const logger = {
  info(message: string, meta?: Record<string, unknown>) {
    console.log(fmt("info", message, meta));
  },
  warn(message: string, meta?: Record<string, unknown>) {
    console.warn(fmt("warn", message, meta));
  },
  error(message: string, err?: unknown, meta?: Record<string, unknown>) {
    const errMeta = isDev && err instanceof Error
      ? { error: err.message, stack: err.stack }
      : { error: "Internal error" };
    console.error(fmt("error", message, { ...errMeta, ...meta }));
  },
};
