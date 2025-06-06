/**
 * IntegridAI MVP 2025 - Scoring Engine Básico
 * © 2025 IntegridAI - Ignacio Adrián Lerer
 */

export class ScoringEngine {
  analyze(texto, empresa = "la empresa", industria = "") {
    const textoLower = texto.toLowerCase();
    let score = 0;
    const elementos = [];

    // Análisis básico de elementos Ley 27401
    if (textoLower.includes('código de ética') || textoLower.includes('codigo de etica')) {
      elementos.push('código de ética (15pts)');
      score += 15;
    }

    if (textoLower.includes('canal de denuncias') || textoLower.includes('linea etica')) {
      elementos.push('canal de denuncias (18pts)');
      score += 18;
    }

    if (textoLower.includes('capacitación') || textoLower.includes('capacitacion')) {
      elementos.push('capacitación (12pts)');
      score += 12;
    }

    if (textoLower.includes('evaluación de riesgos') || textoLower.includes('matriz de riesgos')) {
      elementos.push('evaluación de riesgos (14pts)');
      score += 14;
    }

    if (textoLower.includes('due diligence') || textoLower.includes('debida diligencia')) {
      elementos.push('due diligence (13pts)');
      score += 13;
    }

    if (textoLower.includes('monitoreo') || textoLower.includes('auditoría') || textoLower.includes('auditoria')) {
      elementos.push('monitoreo y auditoría (16pts)');
      score += 16;
    }

    if (textoLower.includes('sanciones') || textoLower.includes('régimen disciplinario') || textoLower.includes('disciplinario')) {
      elementos.push('régimen disciplinario (12pts)');
      score += 12;
    }

    let nivel;
    if (score >= 80) nivel = '🟢 EXCELENTE';
    else if (score >= 60) nivel = '🟡 BUENO';
    else if (score >= 40) nivel = '🟠 REGULAR';
    else nivel = '🔴 INSUFICIENTE';

    return {
      empresa,
      industria,
      nivel,
      score: `${score}/100`,
      elementos_detectados: elementos,
      factores_riesgo: [],
      recomendaciones: score < 60 ? [
        "Implementar código de ética formal",
        "Establecer canal de denuncias",
        "Desarrollar programa de capacitación"
      ] : ["Mantener programa vigente"],
      fecha_analisis: new Date().toISOString()
    };
  }
}