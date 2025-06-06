#!/usr/bin/env node
/**
 * IntegridAI MCP v6.0 - JSON-RPC 2.0 Estricto según análisis ChatGPT
 * Elimina completamente errores Zod con validación estricta
 */

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
  ],
  factores_riesgo: [
    "funcionarios públicos", "contrataciones estatales", "regulación sectorial",
    "jurisdicciones alto riesgo", "intermediarios", "pagos facilitadores"
  ],
  industrias_alto_riesgo: [
    "construcción", "energía", "farmacéutica", "defensa", "telecomunicaciones",
    "banca", "seguros", "minería"
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
  },
  {
    name: "evaluar_programa_integridad",
    description: "Evalúa programa de integridad según estándares Ley 27401",
    inputSchema: {
      type: "object",
      properties: {
        elementos: { type: "array", items: { type: "string" } },
        empresa: { type: "string" }
      },
      required: ["elementos", "empresa"]
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

  const riesgosDetectados = LEY_27401_DB.factores_riesgo.filter(riesgo =>
    texto.toLowerCase().includes(riesgo.toLowerCase())
  );

  const esIndustriaRiesgo = LEY_27401_DB.industrias_alto_riesgo.some(ind =>
    industria.toLowerCase().includes(ind.toLowerCase()) ||
    texto.toLowerCase().includes(ind.toLowerCase())
  );

  let nivel = "🔴 INSUFICIENTE";
  let recomendaciones = [];

  if (puntajeTotal >= 70) {
    nivel = "🟢 BUENO";
    recomendaciones.push("Mantener y fortalecer elementos existentes");
    recomendaciones.push("Documentar evidencias de implementación");
  } else if (puntajeTotal >= 40) {
    nivel = "🟡 BÁSICO";
    recomendaciones.push("Implementar elementos faltantes prioritarios");
    recomendaciones.push("Capacitar a personal en compliance");
  } else {
    nivel = "🔴 INSUFICIENTE";
    recomendaciones.push("Desarrollar programa de integridad integral");
    recomendaciones.push("Implementar elementos básicos urgentemente");
  }

  if (esIndustriaRiesgo) {
    recomendaciones.push("⚠️ Industria de alto riesgo - reforzar controles");
  }

  if (riesgosDetectados.length > 0) {
    recomendaciones.push(\`⚠️ Factores de riesgo detectados: \${riesgosDetectados.join(', ')}\`);
  }

  return \`**📊 ANÁLISIS COMPLIANCE LEY 27401**

**Empresa:** \${empresa}
**Industria:** \${industria || "No especificada"}
**Nivel:** \${nivel}
**Score:** \${puntajeTotal}/100

**Elementos detectados:**
\${elementosEncontrados.length > 0 ? 
  elementosEncontrados.map(e => \`• \${e.keyword} (\${e.peso}pts) - \${e.descripcion}\`).join('\\n') :
  '• Ningún elemento de programa de integridad identificado'
}

**Factores de riesgo:**
\${riesgosDetectados.length > 0 ? 
  riesgosDetectados.map(r => \`• \${r}\`).join('\\n') :
  '• No se detectaron factores de riesgo específicos'
}

**Recomendaciones:**
\${recomendaciones.map(r => \`• \${r}\`).join('\\n')}

**Elementos faltantes críticos:**
\${LEY_27401_DB.elementos_programa_integridad
    .filter(e => !elementosEncontrados.includes(e))
    .slice(0, 3)
    .map(e => \`• \${e.keyword} - \${e.descripcion}\`)
    .join('\\n')}\`;
}

function evaluarPrograma(elementos, empresa) {
  const elementosValidos = elementos.filter(e =>
    LEY_27401_DB.elementos_programa_integridad.some(db =>
      e.toLowerCase().includes(db.keyword.toLowerCase())
    )
  );

  const cobertura = (elementosValidos.length / LEY_27401_DB.elementos_programa_integridad.length) * 100;

  let evaluacion = "";
  if (cobertura >= 80) evaluacion = "🟢 EXCELENTE";
  else if (cobertura >= 60) evaluacion = "🟡 BUENO";
  else evaluacion = "🔴 INSUFICIENTE";

  return \`**📈 EVALUACIÓN PROGRAMA INTEGRIDAD - \${empresa}**

**Resultado:** \${evaluacion}
**Cobertura:** \${cobertura.toFixed(1)}% (\${elementosValidos.length}/\${LEY_27401_DB.elementos_programa_integridad.length})

**Elementos implementados:**
\${elementosValidos.length > 0 ? elementosValidos.map(e => \`• \${e}\`).join('\\n') : 'Ninguno detectado'}

**Elementos faltantes:**
\${LEY_27401_DB.elementos_programa_integridad
    .filter(db => !elementos.some(e => e.toLowerCase().includes(db.keyword.toLowerCase())))
    .map(e => \`• \${e.keyword} - \${e.descripcion}\`)
    .join('\\n')}\`;
}

// Función handleRequest según especificaciones exactas de ChatGPT
function handleRequest(req) {
  if (!req || typeof req !== "object" || typeof req.method !== "string") {
    return { error: { code: -32600, message: "Invalid Request" } };
  }

  // Validar id: string, number o null según ChatGPT
  const validId = (typeof req.id === "string" || typeof req.id === "number") ? req.id : null;

  if (req.method === "initialize") {
    return { 
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "integridai-ley27401", version: "6.0.0" }
      }
    };
  }

  if (req.method === "tools/list") {
    return { result: { tools: tools } };
  }

  if (req.method === "tools/call") {
    if (!req.params || typeof req.params !== "object" || typeof req.params.name !== "string") {
      return { error: { code: -32602, message: "Invalid params" } };
    }

    const toolName = req.params.name;
    const args = req.params.arguments || {};

    if (toolName === "test_integridai") {
      const mensaje = args.mensaje || "";
      if (typeof mensaje !== "string") {
        return { error: { code: -32602, message: "El parámetro 'mensaje' debe ser string" } };
      }
      const toolOutput = {
        content: [{
          type: "text",
          text: \`✅ IntegridAI MCP v6.0 funcionando\\n\\nMensaje: \${mensaje}\\n🎯 JSON-RPC 2.0 estricto según ChatGPT\\n⚖️ Base conocimiento Ley 27401 completa\`
        }]
      };
      return { result: toolOutput };
    }

    if (toolName === "analizar_cumplimiento_ley27401") {
      if (typeof args.texto !== "string") {
        return { error: { code: -32602, message: "Parámetro 'texto' requerido y debe ser string" } };
      }
      const resultado = analizarCumplimiento(args.texto, args.empresa, args.industria);
      return { 
        result: {
          content: [{
            type: "text",
            text: resultado
          }]
        }
      };
    }

    if (toolName === "evaluar_programa_integridad") {
      if (!Array.isArray(args.elementos) || !args.elementos.every(e => typeof e === "string")) {
        return { error: { code: -32602, message: "Parámetro 'elementos' debe ser array de strings" } };
      }
      if (typeof args.empresa !== "string") {
        return { error: { code: -32602, message: "Parámetro 'empresa' requerido y debe ser string" } };
      }
      const resultado = evaluarPrograma(args.elementos, args.empresa);
      return { 
        result: {
          content: [{
            type: "text", 
            text: resultado
          }]
        }
      };
    }

    return { error: { code: -32601, message: "Tool not found" } };
  }

  return { error: { code: -32601, message: "Method not found" } };
}

// Listener según especificaciones exactas de ChatGPT
rl.on("line", (line) => {
  let req;
  try {
    req = JSON.parse(line);
  } catch (e) {
    process.stdout.write(JSON.stringify({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32700, message: "Parse error: " + e.message }
    }) + "\\n");
    return;
  }

  const resp = handleRequest(req);

  const id = (typeof req.id === "string" || typeof req.id === "number") ? req.id : null;

  if (resp.result) {
    process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result: resp.result }) + "\\n");
  } else if (resp.error) {
    process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, error: resp.error }) + "\\n");
  } else {
    process.stdout.write(JSON.stringify({
      jsonrpc: "2.0",
      id,
      error: { code: -32000, message: "Internal server error" }
    }) + "\\n");
  }
});

console.error("IntegridAI MCP v6.0 - JSON-RPC 2.0 Estricto ChatGPT - Iniciado");
