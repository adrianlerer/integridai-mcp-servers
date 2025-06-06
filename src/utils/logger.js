/**
 * IntegridAI MVP 2025 - Logger Básico
 * © 2025 IntegridAI - Ignacio Adrián Lerer
 */

export const logger = {
  info: (msg) => console.error(`[INFO] ${new Date().toISOString()} - ${msg}`),
  warn: (msg) => console.error(`[WARN] ${new Date().toISOString()} - ${msg}`),
  error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
  debug: (msg) => console.error(`[DEBUG] ${new Date().toISOString()} - ${msg}`)
};
