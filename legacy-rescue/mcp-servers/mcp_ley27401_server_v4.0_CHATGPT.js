#!/usr/bin/env node
/**
 * IntegridAI MCP Claude-Compatible v4.0
 * Protocolo MCP ortodoxo + Lógica real de Ley 27.401
 */

const readline = require('readline');

// --------- BASE DE CONOCIMIENTO LEY 27.401 -------------
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
  delitos_ley27401: [
    "cohecho", "tráfico de influencias", "negociaciones incompatibles",
    "concusión", "enriquecimiento ilícito", "balances falsos"
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

// --------- TOOLS DEFINICIÓN ORTODOXA -------------
const tools = [
  {
    name: "test_integridai",
    description: "Test de funcionamiento IntegridAI MCP",
    inputSchema: {
      type: "object",
      properties: { mensaje: { type: "string" } },
      required: ["mensaje"]
    }
  },
  {
    name: "analizar_cumplimiento_ley27401",
    description: "Analiza cumplimiento real de Ley 27.401 en texto empresarial",
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

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

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
    recomendaciones.push(`⚠️ Factores de riesgo detectados: ${riesgosDetectados.join(', ')}`);
  }

  return `**📊 ANÁLISIS COMPLIANCE LEY 27401**

**Empresa:** ${empresa}
**Industria:** ${industria || "No especificada"}
**Nivel de Cumplimiento:** ${nivel}
**Score:** ${puntajeTotal}/100

**✅ Elementos Detectados:**
${elementosEncontrados.length > 0 ?
    elementosEncontrados.map(e => `• ${e.keyword} (${e.peso}pts) - ${e.descripcion}`).join('\n') :
    '• Ningún elemento de programa de integridad identificado'
  }

**⚠️ Factores de Riesgo:**
${riesgosDetectados.length > 0 ?
    riesgosDetectados.map(r => `• ${r}`).join('\n') :
    '• No se detectaron factores de riesgo específicos'
  }

**🎯 Recomendaciones:**
${recomendaciones.map(r => `• ${r}`).join('\n')}

**📋 Elementos Faltantes Críticos:**
${LEY_27401_DB.elementos_programa_integridad
      .filter(e => !elementosEncontrados.includes(e))
      .slice(0, 3)
      .map(e => `• ${e.keyword} - ${e.descripcion}`)
      .join('\n')}`;
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

  return `**📈 EVALUACIÓN PROGRAMA INTEGRIDAD - ${empresa}**

**Resultado:** ${evaluacion}
**Cobertura:** ${cobertura.toFixed(1)}% (${elementosValidos.length}/${LEY_27401_DB.elementos_programa_integridad.length})

**✅ Elementos Implementados:**
${elementosValidos.length > 0 ? elementosValidos.map(e => `• ${e}`).join('\n') : 'Ninguno detectado'}

**❌ Elementos Faltantes:**
${LEY_27401_DB.elementos_programa_integridad
      .filter(db => !elementos.some(e => e.toLowerCase().includes(db.keyword.toLowerCase())))
      .map(e => `• ${e.keyword} - ${e.descripcion}`)
      .join('\n')}`;
}

// --------- MCP ORTODOXO ---------
function handleRequest(req) {
  if (req.method === "tools/list") {
    return { tools };
  }
  if (req.method === "tools/call") {
    const { name, arguments: args } = req.params;

    if (name === "test_integridai") {
      return {
        content: [{
          type: "text",
          text: `✅ **IntegridAI MCP v2.0 - Análisis Real**\n\nMensaje: ${args.mensaje || ""}\n🎯 Herramientas disponibles: análisis compliance, evaluación programas integridad\n⚖️ Base conocimiento: Ley 27401 completa`
        }]
      };
    }
    if (name === "analizar_cumplimiento_ley27401") {
      const resultado = analizarCumplimiento(args.texto, args.empresa, args.industria);
      return { content: [{ type: "text", text: resultado }] };
    }
    if (name === "evaluar_programa_integridad") {
      const resultado = evaluarPrograma(args.elementos, args.empresa);
      return { content: [{ type: "text", text: resultado }] };
    }
    throw new Error("Tool no reconocida: " + name);
  }
  throw new Error("Método no soportado: " + req.method);
}

rl.on('line', (line) => {
  let req = null;
  try {
    req = JSON.parse(line);
    const result = handleRequest(req);
    process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: req.id, result }) + "\n");
  } catch (e) {
    process.stdout.write(JSON.stringify({
      jsonrpc: "2.0",
      id: req && req.id ? req.id : null,
      error: { code: -32603, message: e.message }
    }) + "\n");
  }
});

// Mensaje de log SOLO a stderr (no interfiere con protocolo MCP)
console.error("INICIANDO IntegridAI MCP Claude-Compatible v4.0");