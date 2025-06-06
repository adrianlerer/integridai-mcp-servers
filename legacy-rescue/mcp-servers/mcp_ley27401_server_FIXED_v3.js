#!/usr/bin/env node

/**
 * Servidor MCP para Ley 27401 - IntegridAI
 * Versión corregida - Protocolo MCP estándar
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// Datos Ley 27401
const LEY_27401_INFO = {
  elementos_programa_integridad: [
    "código de ética", "capacitaciones", "canal de denuncias",
    "evaluación de riesgos", "monitoreo y auditoría", "procedimientos disciplinarios"
  ]
};

function handleRequest(req) {
  const { method, params } = req;

  if (method === "tools/list") {
    return {
      tools: [
        {
          name: "test_integridai",
          description: "Test de funcionamiento IntegridAI MCP",
          inputSchema: {
            type: "object",
            properties: {
              mensaje: { type: "string", description: "Mensaje de prueba" }
            },
            required: ["mensaje"]
          }
        },
        {
          name: "analizar_cumplimiento_ley27401",
          description: "Analiza cumplimiento Ley 27401 en texto",
          inputSchema: {
            type: "object", 
            properties: {
              texto: { type: "string", description: "Texto a analizar" }
            },
            required: ["texto"]
          }
        }
      ]
    };
  }

  if (method === "tools/call") {
    const { name, arguments: args } = params;
    
    if (name === "test_integridai") {
      return {
        content: [
          {
            type: "text",
            text: `✅ IntegridAI MCP funcionando correctamente\n\nMensaje: ${args.mensaje || "Sin mensaje"}\nEstado: Operativo`
          }
        ]
      };
    }

    if (name === "analizar_cumplimiento_ley27401") {
      const texto = args.texto || "";
      const palabrasClave = ["integridad", "ética", "compliance", "código", "capacitación"];
      const encontradas = palabrasClave.filter(p => texto.toLowerCase().includes(p));
      const porcentaje = (encontradas.length / palabrasClave.length * 100).toFixed(1);
      
      return {
        content: [
          {
            type: "text",
            text: `📊 Análisis Ley 27401\n\nTexto analizado: ${texto.substring(0, 100)}...\nElementos encontrados: ${encontradas.join(', ')}\nCumplimiento: ${porcentaje}%`
          }
        ]
      };
    }

    throw new Error(`Tool desconocida: ${name}`);
  }

  throw new Error(`Método no soportado: ${method}`);
}

rl.on('line', (input) => {
  try {
    const req = JSON.parse(input);
    const result = handleRequest(req);
    
    const response = {
      jsonrpc: "2.0",
      id: req.id,
      result: result
    };
    
    console.log(JSON.stringify(response));
  } catch (error) {
    const errorResponse = {
      jsonrpc: "2.0", 
      id: req?.id || null,
      error: {
        code: -32603,
        message: error.message
      }
    };
    
    console.log(JSON.stringify(errorResponse));
  }
});

console.error("IntegridAI MCP Server v3.0 running");
