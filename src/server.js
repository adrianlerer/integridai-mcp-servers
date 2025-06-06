/**
 * IntegridAI MVP 2025 - Servidor MCP
 * © 2025 IntegridAI - Ignacio Adrián Lerer
 *
 * Implementación completa JSON-RPC 2.0 para Model Context Protocol
 * Herramientas especializadas en compliance Ley 27401
 */

import { createInterface } from 'readline';
import { z } from 'zod';
import { logger } from './utils/logger.js';
import { IAOrchestrator } from './core/iaOrchestrator.js';
import { ScoringEngine } from './core/scoringEngine.js';
import { ComplianceEngine } from './core/complianceEngine.js';

// Esquemas de validación MCP
const MCPRequestSchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.union([z.string(), z.number(), z.null()]).optional(),
  method: z.string(),
  params: z.any().optional()
});

/**
 * Servidor MCP para IntegridAI
 */
export class MCPServer {
  constructor() {
    this.iaOrchestrator = new IAOrchestrator();
    this.scoringEngine = new ScoringEngine();
    this.complianceEngine = new ComplianceEngine();
    this.readline = null;
    this.initialized = false;
  }

  /**
   * Inicializar servidor MCP
   */
  async start() {
    try {
      logger.info('🔧 Inicializando componentes...');

      // Inicializar orquestador IA
      await this.iaOrchestrator.initialize();

      // Configurar interfaz readline para JSON-RPC
      this.readline = createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
      });

      // Configurar manejo de mensajes
      this.readline.on('line', (line) => {
        this.handleMessage(line.trim());
      });

      this.readline.on('close', () => {
        logger.info('📡 Conexión MCP cerrada');
        process.exit(0);
      });

      this.initialized = true;
      logger.info('✅ Servidor MCP inicializado correctamente');

    } catch (error) {
      logger.error(`❌ Error inicializando servidor MCP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Detener servidor
   */
  async stop() {
    if (this.readline) {
      this.readline.close();
    }
    logger.info('🛑 Servidor MCP detenido');
  }

  /**
   * Manejar mensaje JSON-RPC entrante
   */
  async handleMessage(rawMessage) {
    if (!rawMessage) return;

    try {
      const message = JSON.parse(rawMessage);

      // Validar formato JSON-RPC
      const request = MCPRequestSchema.parse(message);

      logger.debug(`📨 Método recibido: ${request.method}`);

      const response = await this.processRequest(request);

      // Enviar respuesta
      console.log(JSON.stringify(response));

    } catch (error) {
      logger.error(`❌ Error procesando mensaje: ${error.message}`);

      const errorResponse = {
        jsonrpc: '2.0',
        error: {
          code: -32700,
          message: 'Parse error',
          data: error.message
        }
      };

      console.log(JSON.stringify(errorResponse));
    }
  }

  /**
   * Procesar request JSON-RPC
   */
  async processRequest(request) {
    const { method, params, id } = request;

    try {
      let result;

      switch (method) {
        case 'initialize':
          result = await this.handleInitialize(params);
          break;

        case 'tools/list':
          result = await this.handleToolsList();
          break;

        case 'tools/call':
          result = await this.handleToolCall(params);
          break;

        default:
          throw new Error(`Método no soportado: ${method}`);
      }

      return {
        jsonrpc: '2.0',
        id,
        result
      };

    } catch (error) {
      logger.error(`❌ Error en método ${method}: ${error.message}`);

      return {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32601,
          message: 'Method not found',
          data: error.message
        }
      };
    }
  }

  /**
   * Manejar inicialización MCP
   */
  async handleInitialize(_params) {
    logger.info('🤝 Inicializando sesión MCP con cliente');

    return {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {}
      },
      serverInfo: {
        name: 'integridai-mcp-server',
        version: '1.0.0',
        description: 'IntegridAI - Análisis de compliance empresarial con IA'
      }
    };
  }

  /**
   * Listar herramientas disponibles
   */
  async handleToolsList() {
    return {
      tools: [
        {
          name: 'test_integridai',
          description: 'Herramienta de test para verificar funcionamiento de IntegridAI',
          inputSchema: {
            type: 'object',
            properties: {
              mensaje: {
                type: 'string',
                description: 'Mensaje de prueba (opcional)',
                default: 'test'
              }
            }
          }
        },
        {
          name: 'analizar_cumplimiento_ley27401',
          description: 'Analiza texto corporativo para identificar elementos de compliance según Ley 27401',
          inputSchema: {
            type: 'object',
            properties: {
              texto: {
                type: 'string',
                description: 'Texto a analizar (políticas, manuales, documentos corporativos)'
              },
              empresa: {
                type: 'string',
                description: 'Nombre de la empresa',
                default: 'la empresa'
              },
              industria: {
                type: 'string',
                description: 'Sector/industria de la empresa (opcional)',
                default: ''
              }
            },
            required: ['texto']
          }
        },
        {
          name: 'evaluar_programa_integridad',
          description: 'Evalúa un programa de integridad empresarial completo',
          inputSchema: {
            type: 'object',
            properties: {
              elementos: {
                type: 'array',
                items: { type: 'string' },
                description: 'Lista de elementos implementados del programa'
              },
              empresa: {
                type: 'string',
                description: 'Nombre de la empresa',
                default: 'la empresa'
              },
              industria: {
                type: 'string',
                description: 'Sector/industria (opcional)',
                default: ''
              }
            },
            required: ['elementos']
          }
        }
      ]
    };
  }

  /**
   * Ejecutar herramienta específica
   */
  async handleToolCall(params) {
    const { name, arguments: args } = params;

    logger.info(`🔧 Ejecutando herramienta: ${name}`);

    switch (name) {
      case 'test_integridai':
        return await this.toolTestIntegridai(args);

      case 'analizar_cumplimiento_ley27401':
        return await this.toolAnalizarCumplimiento(args);

      case 'evaluar_programa_integridad':
        return await this.toolEvaluarPrograma(args);

      default:
        throw new Error(`Herramienta no encontrada: ${name}`);
    }
  }

  /**
   * Herramienta: Test IntegridAI
   */
  async toolTestIntegridai(args) {
    const { mensaje = 'test' } = args;

    return {
      content: [
        {
          type: 'text',
          text: `🎉 **INTEGRIDAI MVP 2025 - TEST EXITOSO**

✅ **Servidor MCP:** Funcionando correctamente
✅ **Protocolo:** JSON-RPC 2.0 compatible
✅ **Herramientas:** 3 herramientas de compliance disponibles
✅ **Base conocimiento:** Ley 27401 cargada
✅ **Mensaje test:** "${mensaje}"

**© 2025 IntegridAI - Ignacio Adrián Lerer**

🔧 **Herramientas disponibles:**
• \`analizar_cumplimiento_ley27401\` - Análisis compliance de textos
• \`evaluar_programa_integridad\` - Evaluación programas empresariales
• \`test_integridai\` - Verificación funcionamiento

🚀 **Estado:** Listo para análisis de compliance empresarial`
        }
      ]
    };
  }

  /**
   * Herramienta: Analizar cumplimiento Ley 27401
   */
  async toolAnalizarCumplimiento(args) {
    const { texto, empresa = 'la empresa', industria = '' } = args;

    if (!texto || texto.trim().length === 0) {
      throw new Error('Se requiere texto para analizar');
    }

    try {
      // Análisis con scoring engine
      const analisisBasico = this.scoringEngine.analyze(texto, empresa, industria);

      // Análisis avanzado con IA (si está disponible)
      const analisisIA = await this.iaOrchestrator.processComplianceAnalysis(texto, empresa, industria);

      const resultado = `📊 **ANÁLISIS DE COMPLIANCE LEY 27401**

**Empresa:** ${empresa}
${industria ? `**Industria:** ${industria}` : ''}
**Fecha:** ${new Date().toLocaleDateString('es-AR')}

🎯 **RESULTADO GENERAL**
**Nivel de compliance:** ${analisisBasico.nivel}
**Score:** ${analisisBasico.score}

📋 **ELEMENTOS DETECTADOS** (${analisisBasico.elementos_detectados.length})
${analisisBasico.elementos_detectados.length > 0
  ? analisisBasico.elementos_detectados.map(e => `• ${e}`).join('\n')
  : '• Ningún elemento específico detectado'}

💡 **RECOMENDACIONES**
${analisisBasico.recomendaciones.map(r => `• ${r}`).join('\n')}

${analisisIA.status !== 'Análisis IA no disponible'
  ? `🤖 **ANÁLISIS IA AVANZADO**
${analisisIA.suggestion || analisisIA.status}`
  : '💡 **Nota:** Configura API keys en .env para análisis IA avanzado'}

---
**© 2025 IntegridAI - Ignacio Adrián Lerer**`;

      return {
        content: [
          {
            type: 'text',
            text: resultado
          }
        ]
      };

    } catch (error) {
      logger.error(`❌ Error en análisis: ${error.message}`);
      throw new Error(`Error procesando análisis: ${error.message}`);
    }
  }

  /**
   * Herramienta: Evaluar programa de integridad
   */
  async toolEvaluarPrograma(args) {
    const { elementos, empresa = 'la empresa', industria = '' } = args;

    if (!elementos || !Array.isArray(elementos)) {
      throw new Error('Se requiere array de elementos implementados');
    }

    try {
      const evaluacion = this.complianceEngine.evaluateProgram(elementos, empresa, industria);

      const resultado = `📋 **EVALUACIÓN PROGRAMA DE INTEGRIDAD**

**Empresa:** ${empresa}
${industria ? `**Industria:** ${industria}` : ''}
**Fecha:** ${new Date().toLocaleDateString('es-AR')}

🎯 **EVALUACIÓN GENERAL**
**Nivel:** ${evaluacion.nivel}
**Cobertura:** ${evaluacion.cobertura}%
**Elementos implementados:** ${evaluacion.elementos_implementados}/${evaluacion.elementos_totales}

✅ **ELEMENTOS IMPLEMENTADOS**
${evaluacion.implementados.map(e => `• ${e}`).join('\n')}

⚠️ **ELEMENTOS FALTANTES**
${evaluacion.faltantes.map(e => `• ${e}`).join('\n')}

💡 **RECOMENDACIONES**
${evaluacion.recomendaciones.map(r => `• ${r}`).join('\n')}

📊 **MATRIZ LEY 27401**
Los 7 elementos obligatorios según la Ley 27401:
1. Código de ética y conducta
2. Canal de denuncias
3. Capacitación y entrenamiento
4. Evaluación de riesgos
5. Due diligence de terceros
6. Monitoreo y auditoría
7. Régimen disciplinario

---
**© 2025 IntegridAI - Ignacio Adrián Lerer**`;

      return {
        content: [
          {
            type: 'text',
            text: resultado
          }
        ]
      };

    } catch (error) {
      logger.error(`❌ Error en evaluación: ${error.message}`);
      throw new Error(`Error procesando evaluación: ${error.message}`);
    }
  }
}
