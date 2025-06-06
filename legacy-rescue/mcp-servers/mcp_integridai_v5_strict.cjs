#!/usr/bin/env node

const readline = require('readline');

// Base de conocimiento Ley 27401
const LEY_27401_DB = {
  elementos_programa_integridad: [
    { keyword: "código de ética", peso: 15, descripcion: "Conjunto de principios y valores organizacionales" },
    { keyword: "capacitación", peso: 12, descripcion: "Entrenamiento en integridad y compliance" },
    { keyword: "canal de denuncias", peso: 18, descripcion: "Mecanismo seguro para reportar irregularidades" },
    { keyword: "evaluación de riesgos", peso: 20, descripcion: "Identificación y mapeo de riesgos de corrupción" },
    { keyword: "monitoreo", peso: 15, descripcion: "Supervisión continua del programa" },
    { keyword: "due diligence", peso: 10, descripcion: "Evaluación de terceros y socios comerciales" },
    { keyword: "procedimientos disciplinarios", peso: 10, descripcion: "Sanciones por incumplimiento" }
  ]
};

const tools = [
  {
    name: "test_integridai",
    description: "Test de funcionamiento IntegridAI MCP",
    inputSchema: {
      type: "object",
      properties: {
        mensaje: { type: "string" }
      },
      required: ["mensaje"]
    }
  },
  {
    name: "analizar_cumplimiento_ley27401",
    description: "Analiza cumplimiento Ley 27401 en texto empresarial",
    inputSchema: {
      type: "object", 
      properties: {
        texto: { type: "string" },
        empresa: { type: "string" },
        industria: { type: "string" }
      },
      required: ["texto"]
    }
  }
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

function analizarCumplimiento(texto, empresa = "la empresa", industria = "") {
  const elementosEncontrados = [];
  let puntajeTotal = 0;

  LEY_27401_DB.elementos_programa_integridad.forEach(elemento => {
    const regex = new RegExp(elemento.keyword.replace(/\s+/g, '\\s*'), 'i');
    if (regex.test(texto)) {
      elementosEncontrados.push(elemento);
      puntajeTotal += elemento.peso;
    }
  });

  let nivel = "🔴 INSUFICIENTE";
  if (puntajeTotal >= 70) nivel = "🟢 BUENO";
  else if (puntajeTotal >= 40) nivel = "🟡 BÁSICO";

  return `**📊 ANÁLISIS COMPLIANCE LEY 27401**

**Empresa:** ${empresa}
**Industria:** ${industria || "No especificada"}
**Nivel:** ${nivel}
**Score:** ${puntajeTotal}/100

**Elementos detectados:**
${elementosEncontrados.length > 0 ? 
  elementosEncontrados.map(e => `• ${e.keyword} (${e.peso}pts)`).join('\n') :
  '• Ningún elemento detectado'
}`;
}

function handleRequest(req) {
  // Validación estricta JSON-RPC 2.0
  if (
    !req ||
    typeof req !== 'object' ||
    !(typeof req.id === 'string' || typeof req.id === 'number' || req.id === null) ||
    typeof req.method !== 'string'
  ) {
    return {
      jsonrpc: '2.0',
      id: req?.id ?? null,
      error: {
        code: -32600,
        message: 'Invalid Request: missing or invalid id or method'
      }
    };
  }

  try {
    if (req.method === "initialize") {
      return {
        jsonrpc: '2.0',
        id: req.id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: "integridai-ley27401",
            version: "1.0.0"
          }
        }
      };
    }

    if (req.method === "tools/list") {
      return {
        jsonrpc: '2.0',
        id: req.id,
        result: {
          tools: tools
        }
      };
    }

    if (req.method === "tools/call") {
      if (!req.params || typeof req.params !== 'object') {
        return {
          jsonrpc: '2.0',
          id: req.id,
          error: {
            code: -32602,
            message: 'Invalid params'
          }
        };
      }

      const { name, arguments: args } = req.params;

      if (!name || typeof name !== 'string') {
        return {
          jsonrpc: '2.0',
          id: req.id,
          error: {
            code: -32602,
            message: 'Invalid tool name'
          }
        };
      }

      if (!args || typeof args !== 'object') {
        return {
          jsonrpc: '2.0',
          id: req.id,
          error: {
            code: -32602,
            message: 'Invalid arguments'
          }
        };
      }

      if (name === "test_integridai") {
        if (!args.mensaje || typeof args.mensaje !== 'string') {
          return {
            jsonrpc: '2.0',
            id: req.id,
            error: {
              code: -32602,
              message: 'Missing required parameter: mensaje (string)'
            }
          };
        }

        return {
          jsonrpc: '2.0',
          id: req.id,
          result: {
            content: [{
              type: "text",
              text: `✅ IntegridAI MCP v5.0 funcionando\n\nMensaje: ${args.mensaje}\n🎯 Protocolo JSON-RPC 2.0 estricto aplicado`
            }]
          }
        };
      }

      if (name === "analizar_cumplimiento_ley27401") {
        if (!args.texto || typeof args.texto !== 'string') {
          return {
            jsonrpc: '2.0',
            id: req.id,
            error: {
              code: -32602,
              message: 'Missing required parameter: texto (string)'
            }
          };
        }

        const resultado = analizarCumplimiento(
          args.texto,
          args.empresa || "la empresa", 
          args.industria || ""
        );

        return {
          jsonrpc: '2.0',
          id: req.id,
          result: {
            content: [{
              type: "text",
              text: resultado
            }]
          }
        };
      }

      return {
        jsonrpc: '2.0',
        id: req.id,
        error: {
          code: -32601,
          message: `Tool not found: ${name}`
        }
      };
    }

    return {
      jsonrpc: '2.0',
      id: req.id,
      error: {
        code: -32601,
        message: `Method not found: ${req.method}`
      }
    };

  } catch (error) {
    return {
      jsonrpc: '2.0',
      id: req.id,
      error: {
        code: -32603,
        message: error.message || 'Internal error'
      }
    };
  }
}

// Listener con validación estricta
rl.on('line', (line) => {
  let req;
  
  try {
    req = JSON.parse(line.trim());
  } catch (err) {
    process.stdout.write(JSON.stringify({
      jsonrpc: '2.0',
      id: null,
      error: { 
        code: -32700, 
        message: 'Parse error' 
      }
    }) + '\n');
    return;
  }

  const response = handleRequest(req);
  process.stdout.write(JSON.stringify(response) + '\n');
});

console.error("IntegridAI MCP v5.0 - JSON-RPC 2.0 Estricto - Iniciado");
