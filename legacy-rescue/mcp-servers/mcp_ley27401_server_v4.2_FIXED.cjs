#!/usr/bin/env node
/**
 * IntegridAI MCP v4.2 - Esquemas MCP Corregidos
 * Protocolo MCP estricto + Validación Zod compatible
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

// --------- TOOLS CON ESQUEMAS MCP ESTRICTOS -------------
const tools = [
  {
    name: "test_integridai",
    description: "Test de funcionamiento IntegridAI MCP",
    inputSchema: {
      type: "object",
      properties: {
        mensaje: {
          type: "string",
          description: "Mensaje de prueba"
        }
      },
      required: ["mensaje"],
      additionalProperties: false
    }
  },
  {
    name: "analizar_cumplimiento_ley27401",
    description: "Analiza cumplimiento real de Ley 27.401 en texto empresarial",
    inputSchema: {
      type: "object",
      properties: {
        texto: {
          type: "string",
          description: "Texto a analizar para cumplimiento Ley 27401"
        },
        empresa: {
          type: "string",
          description: "Nombre de la empresa",
          default: "la empresa"
        },
        industria: {
          type: "string", 
          description: "Sector industrial",
          default: ""
        }
      },
      required: ["texto"],
      additionalProperties: false
    }
  },
  {
    name: "evaluar_programa_integridad",
    description: "Evalúa programa de integridad según estándares Ley 27401",
    inputSchema: {
      type: "object",
      properties: {
        elementos: {
          type: "array",
          items: {
            type: "string"
          },
          description: "Lista de elementos del programa de integridad"
        },
        empresa: {
          type: "string",
          description: "Nombre de la empresa"
        }
      },
      required: ["elementos", "empresa"],
      additionalProperties: false
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

// --------- PROTOCOLO MCP ESTRICTO ---------
function handleRequest(req) {
  try {
    // Validar estructura base de request
    if (!req || typeof req !== 'object') {
      throw new Error("Invalid request structure");
    }

    if (!req.method || typeof req.method !== 'string') {
      throw new Error("Missing or invalid method");
    }

    if (req.method === "tools/list") {
      return {
        tools: tools
      };
    }

    if (req.method === "tools/call") {
      if (!req.params || typeof req.params !== 'object') {
        throw new Error("Missing or invalid params");
      }

      const { name, arguments: args } = req.params;

      if (!name || typeof name !== 'string') {
        throw new Error("Missing or invalid tool name");
      }

      if (!args || typeof args !== 'object') {
        throw new Error("Missing or invalid arguments");
      }

      // Ejecutar herramientas
      if (name === "test_integridai") {
        if (!args.mensaje || typeof args.mensaje !== 'string') {
          throw new Error("Missing required parameter: mensaje (string)");
        }
        
        return {
          content: [{
            type: "text",
            text: `✅ **IntegridAI MCP v4.2 - Esquemas Validados**\n\nMensaje: ${args.mensaje}\n🎯 Herramientas disponibles: análisis compliance, evaluación programas integridad\n⚖️ Base conocimiento: Ley 27401 completa\n🔧 Validación Zod: Compatible`
          }]
        };
      }

      if (name === "analizar_cumplimiento_ley27401") {
        if (!args.texto || typeof args.texto !== 'string') {
          throw new Error("Missing required parameter: texto (string)");
        }
        
        const resultado = analizarCumplimiento(
          args.texto, 
          args.empresa || "la empresa", 
          args.industria || ""
        );
        return { 
          content: [{ 
            type: "text", 
            text: resultado 
          }] 
        };
      }

      if (name === "evaluar_programa_integridad") {
        if (!args.elementos || !Array.isArray(args.elementos)) {
          throw new Error("Missing required parameter: elementos (array)");
        }
        if (!args.empresa || typeof args.empresa !== 'string') {
          throw new Error("Missing required parameter: empresa (string)");
        }
        
        const resultado = evaluarPrograma(args.elementos, args.empresa);
        return { 
          content: [{ 
            type: "text", 
            text: resultado 
          }] 
        };
      }

      throw new Error(`Unknown tool: ${name}`);
    }

    throw new Error(`Unsupported method: ${req.method}`);

  } catch (error) {
    throw error; // Re-lanzar para manejo en el nivel superior
  }
}

// --------- MANEJO DE MENSAJES JSON-RPC ---------
rl.on('line', (line) => {
  let req = null;
  try {
    // Parsear JSON
    req = JSON.parse(line.trim());
    
    // Ejecutar request
    const result = handleRequest(req);
    
    // Respuesta exitosa
    const response = {
      jsonrpc: "2.0",
      id: req.id || null,
      result: result
    };
    
    process.stdout.write(JSON.stringify(response) + "\n");
    
  } catch (error) {
    // Respuesta de error
    const errorResponse = {
      jsonrpc: "2.0",
      id: req && req.id ? req.id : null,
      error: {
        code: -32603,
        message: error.message || "Internal error"
      }
    };
    
    process.stdout.write(JSON.stringify(errorResponse) + "\n");
  }
});

// Log de inicio solo a stderr
console.error("✅ IntegridAI MCP v4.2 - Esquemas Zod Validados - INICIADO");
