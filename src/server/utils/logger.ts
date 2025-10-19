import { getCuurrentTime } from "./StringUtils";

export const logger = {
  log: (...args: any[]) => console.log(`[${getCuurrentTime()}]`, ...args),
  info: (...args: any[]) => console.log(`[${getCuurrentTime()}]`, "ℹ️ ", ...args),
  warn: (...args: any[]) => console.warn(`[${getCuurrentTime()}]`, "⚠️ ", ...args),
  error: (...args: any[]) => console.error(`[${getCuurrentTime()}]`, "❌ ", ...args),
  debug: (...args: any[]) => console.debug(`[${getCuurrentTime()}]`, ...args)
};
