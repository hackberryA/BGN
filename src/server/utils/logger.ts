export const logger = {
  info: (...args: any[]) => console.log("ℹ️", ...args),
  warn: (...args: any[]) => console.warn("⚠️", ...args),
  error: (...args: any[]) => console.error("❌", ...args),
  debug: (...args: any[]) => console.debug(...args)
};
