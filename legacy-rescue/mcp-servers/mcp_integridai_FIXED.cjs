#!/usr/bin/env node
const readline = require('readline');

function log(message) {
  process.stderr.write(`[IntegridAI MCP] ${new Date().toISOString()} - ${message}\n`);
}

function sendResponse(response) {
  process.stdout.write(JSON.stringify(response) + '\n');
}

function generateValidId() {
  return Date.now().toString();
}

function createSuccessResponse(result, requestId) {
  return { jsonrpc: "2.0", result, id: requestId || generateValidId() };
}

function createErrorResponse(code, message, requestId = null) {
  return { jsonrpc: "2.0", error: { code, message }, id: requestId };
}

function analizarCumplimientoLey27401(params) {
  const { empresa, industria, texto } = params;
  if (!texto || typeof texto !== 'string') {
    throw new Error("Parámetro 'texto' requerido y debe ser string");
  }
  const elementos = [];
  let score = 0;
  const textoLower = texto.toLowerCase();

  if (textoLower.includes('código de ética') || textoLower.includes('codigo de etica')) {
    elementos.push('código de ética (15pts)');
    score += 15;
  }
  if (textoLower.includes('canal de denuncias') || textoLower.includes('linea etica')) {
    elementos.push('canal de denuncias (18pts)');
    score += 18;
  }
  if (textoLower.includes('capacitación') || textoLower.includes('capacitacion') || textoLower.includes('entrenamiento')) {
    elementos.push('capacitación (12pts)');
    score += 12;
  }

  let nivel;
  if (score >= 80) nivel = '🟢 EXCELENTE';
  else if (score >= 60) nivel = '🟡 BUENO';
  else if (score >= 40) nivel = '🟠 REGULAR';
  else nivel = '🔴 INSUFICIENTE';

  return {
    empresa: empresa || "No especificada",
    industria: industria || "No especificada",
    nivel,
    score: `${score}/100`,
    elementos_detectados: elementos,
    fecha_analisis: new Date().toISOString(),
    recomendaciones: score < 60
      ? [
          "Implementar código de ética formal",
          "Establecer canal de denuncias independiente",
          "Desarrollar programa de capacitación",
          "Documentar políticas anticorrupción"
        ]
      : [
          "Mantener programa vigente",
          "Revisar anualmente efectividad",
          "Actualizar según cambios normativos"
        ]
  };
}

function testIntegridai(params) {
  return {
    status: "✅ IntegridAI MCP v5.1 funcionando correctamente",
    mensaje: params?.mensaje || "Test ejecutado exitosamente",
    protocolo: "JSON-RPC 2.0 estricto",
    timestamp: new Date().toISOString(),
    version: "5.1.0"
  };
}

const TOOLS = [
  {
    name: "test_integridai",
    description: "Verifica el funcionamiento del servidor IntegridAI",
    inputSchema: {
      type: "object",
      properties: { mensaje: { type: "string" } }
    }
  },
  {
    name: "analizar_cumplimiento_ley27401",
    description: "Analiza el cumplimiento de la Ley 27401 de Responsabilidad Penal Empresaria",
    inputSchema: {
      type: "object",
      properties: {
        empresa: { type: "string" },
        industria: { type: "string" },
        texto: { type: "string" }
      },
      required: ["texto"]
    }
  }
];

const rl = readline.createInterface({ input: process.stdin, output: process.stderr });

log('Servidor MCP IntegridAI iniciado');
log('Protocolo JSON-RPC 2.0 estricto activado');
log('Herramientas disponibles: test_integridai, analizar_cumplimiento_ley27401');
log('Esperando solicitudes JSON-RPC...');

rl.on('line', (line) => {
  try {
    const request = JSON.parse(line.trim());

    if (!request.jsonrpc || request.jsonrpc !== "2.0") {
      sendResponse(createErrorResponse(-32600, "Invalid Request - jsonrpc debe ser '2.0'", request.id));
      log(`Error: Versión JSON-RPC inválida - ${JSON.stringify(request)}`);
      return;
    }

    if (!request.method || typeof request.method !== 'string') {
      sendResponse(createErrorResponse(-32600, "Invalid Request - method requerido", request.id));
      log(`Error: Método faltante o inválido - ${JSON.stringify(request)}`);
      return;
    }

    const validKeys = ["jsonrpc", "method", "params", "id"];
    for (const key of Object.keys(request)) {
      if (!validKeys.includes(key)) {
        sendResponse(createErrorResponse(-32600, `Unrecognized key '${key}' in request`, request.id));
        log(`Error: Clave no reconocida '${key}' en solicitud`);
        return;
      }
    }

    if (request.id === null || request.id === undefined) {
      request.id = generateValidId();
    } else if (typeof request.id !== "string" && typeof request.id !== "number") {
      sendResponse(createErrorResponse(-32600, "Invalid id - debe ser string o number", request.id));
      log(`Error: id inválido - ${request.id}`);
      return;
    }

    const requestId = request.id;
    log(`Procesando solicitud: ${request.method} (ID: ${requestId})`);

    if (request.method === 'initialize') {
      sendResponse(createSuccessResponse({
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "integridai-ley27401", version: "5.1.0" }
      }, requestId));
      return;
    }

    if (request.method === 'tools/list') {
      sendResponse(createSuccessResponse({ tools: TOOLS }, requestId));
      return;
    }

    if (request.method === 'tools/call') {
      const toolName = request.params?.name;
      const toolArgs = request.params?.arguments || {};

      if (!toolName) {
        sendResponse(createErrorResponse(-32602, "Invalid params - tool name requerido", requestId));
        log("Error: Nombre de herramienta faltante");
        return;
      }

      log(`Ejecutando herramienta: ${toolName}`);

      try {
        let result;
        if (toolName === 'test_integridai') {
          result = testIntegridai(toolArgs);
        } else if (toolName === 'analizar_cumplimiento_ley27401') {
          result = analizarCumplimientoLey27401(toolArgs);
        } else {
          sendResponse(createErrorResponse(-32601, `Tool not found: ${toolName}`, requestId));
          log(`Error: Herramienta no encontrada - ${toolName}`);
          return;
        }

        sendResponse(createSuccessResponse({ content: [{ type: "text", text: JSON.stringify(result, null, 2) }] }, requestId));
        log(`Herramienta ${toolName} ejecutada exitosamente`);
      } catch (error) {
        sendResponse(createErrorResponse(-32603, `Internal error - ${error.message}`, requestId));
        log(`Error interno en ${toolName}: ${error.message}`);
      }
      return;
    }

    sendResponse(createErrorResponse(-32601, `Method not found: ${request.method}`, requestId));
    log(`Error: Método no soportado - ${request.method}`);
  } catch (error) {
    sendResponse(createErrorResponse(-32700, `Parse error: ${error.message}`, null));
    log(`Error de parsing JSON: ${error.message} - Línea: ${line}`);
  }
});

rl.on("close", () => {
  log("Servidor MCP cerrado correctamente");
  process.exit(0);
});

process.on("SIGINT", () => {
  log("Recibida señal SIGINT, cerrando servidor...");
  rl.close();
});

process.on("SIGTERM", () => {
  log("Recibida señal SIGTERM, cerrando servidor...");
  rl.close();
});

log("Servidor listo para recibir solicitudes JSON-RPC 2.0");
