/**
 * IntegridAI MVP 2025 - Validators
 * © 2025 IntegridAI - Ignacio Adrián Lerer
 */

export async function validateEnvironment() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10);

  if (majorVersion < 20) {
    throw new Error(`Node.js >= 20 requerido. Actual: ${nodeVersion}`);
  }

  return true;
}

export function validateInput(input, _rules) {
  if (!input || typeof input !== 'object') {
    throw new Error('Input inválido: objeto requerido');
  }
  return true;
}
