/**
 * IntegridAI MVP 2025 - Entry Point
 * © 2025 IntegridAI - Ignacio Adrián Lerer
 *
 * Servidor MCP para análisis de compliance empresarial con IA
 * Ley 27401 - Responsabilidad Penal Empresaria Argentina
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { config } from 'dotenv';
import { logger } from './utils/logger.js';
import { validateEnvironment } from './utils/validators.js';
import { MCPServer } from './server.js';

// Configuración de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(__dirname);

// Cargar variables de entorno
config({ path: join(projectRoot, '.env') });

// Información del proyecto
const packageJson = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));

/**
 * Manejador de señales del sistema
 */
function setupSignalHandlers(server) {
  const gracefulShutdown = async (signal) => {
    logger.info(`📡 Señal ${signal} recibida. Iniciando shutdown graceful...`);

    try {
      if (server && server.stop) {
        await server.stop();
      }
      logger.info('✅ Servidor detenido correctamente');
      process.exit(0);
    } catch (error) {
      logger.error(`❌ Error durante shutdown: ${error.message}`);
      process.exit(1);
    }
  };

  // Manejadores de señales POSIX
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Manejador de errores no capturados
  process.on('uncaughtException', (error) => {
    logger.error(`💥 Excepción no capturada: ${error.message}`);
    logger.error(error.stack);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`💥 Promise rechazada no manejada en: ${promise}`);
    logger.error(`Razón: ${reason}`);
    process.exit(1);
  });
}

/**
 * Función principal de inicialización
 */
async function main() {
  try {
    // Banner de inicio
    console.error('');
    console.error('🚀 ===================================');
    console.error('   INTEGRIDAI MVP 2025');
    console.error('   Compliance Empresarial con IA');
    console.error('   © 2025 IntegridAI - Ignacio Adrián Lerer');
    console.error('🚀 ===================================');
    console.error('');

    logger.info(`📦 Iniciando ${packageJson.name} v${packageJson.version}`);
    logger.info(`🔧 Node.js ${process.version} | Entorno: ${process.env.NODE_ENV || 'development'}`);

    // Validaciones de entorno
    logger.info('🔍 Validando entorno...');
    await validateEnvironment();
    logger.info('✅ Entorno validado correctamente');

    // Verificar APIs disponibles
    const apisDisponibles = [];
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-openai-key-here') {
      apisDisponibles.push('OpenAI');
    }
    if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'sk-ant-your-anthropic-key-here') {
      apisDisponibles.push('Anthropic Claude');
    }

    if (apisDisponibles.length > 0) {
      logger.info(`🤖 APIs IA configuradas: ${apisDisponibles.join(', ')}`);
    } else {
      logger.warn('⚠️ No hay APIs IA configuradas - funcionando en modo básico');
      logger.warn('💡 Configura OPENAI_API_KEY o ANTHROPIC_API_KEY en .env para análisis avanzado');
    }

    // Inicializar servidor MCP
    logger.info('🌐 Inicializando servidor MCP...');
    const server = new MCPServer();

    // Configurar manejadores de señales
    setupSignalHandlers(server);

    // Iniciar servidor
    await server.start();

    logger.info('🎉 IntegridAI MVP iniciado correctamente');
    logger.info('📡 Servidor MCP escuchando en stdin/stdout (JSON-RPC 2.0)');
    logger.info('🔗 Conectar desde Claude Desktop para utilizar herramientas');
    logger.info('');
    logger.info('📋 Herramientas disponibles:');
    logger.info('   • test_integridai - Verificar funcionamiento');
    logger.info('   • analizar_cumplimiento_ley27401 - Análisis compliance texto');
    logger.info('   • evaluar_programa_integridad - Evaluación programa empresarial');
    logger.info('');

  } catch (error) {
    logger.error(`💥 Error fatal durante inicialización: ${error.message}`);
    logger.error(error.stack);
    process.exit(1);
  }
}

// Verificar si se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    logger.error(`💥 Error en main(): ${error.message}`);
    process.exit(1);
  });
}

export { main };
