/**
 * IntegridAI MVP 2025 - Tests Básicos
 * © 2025 IntegridAI - Ignacio Adrián Lerer
 */

import { validateEnvironment, validateInput } from '../../src/utils/validators.js';
import { ScoringEngine } from '../../src/core/scoringEngine.js';
import { ComplianceEngine } from '../../src/core/complianceEngine.js';

describe('IntegridAI MVP - Tests Básicos', () => {
  
  describe('Validators', () => {
    test('validateEnvironment debe validar Node.js >= 20', async () => {
      await expect(validateEnvironment()).resolves.toBe(true);
    });

    test('validateInput debe validar objetos válidos', () => {
      const input = { text: 'test', empresa: 'Test Corp' };
      expect(validateInput(input, {})).toBe(true);
    });

    test('validateInput debe rechazar input inválido', () => {
      expect(() => validateInput(null, {})).toThrow('Input inválido');
      expect(() => validateInput('string', {})).toThrow('Input inválido');
    });
  });

  describe('ScoringEngine', () => {
    let scoringEngine;

    beforeEach(() => {
      scoringEngine = new ScoringEngine();
    });

    test('debe instanciarse correctamente', () => {
      expect(scoringEngine).toBeInstanceOf(ScoringEngine);
    });

    test('debe analizar texto básico sin elementos', () => {
      const resultado = scoringEngine.analyze('Este es un texto sin elementos de compliance', 'Test Corp');
      
      expect(resultado).toHaveProperty('empresa', 'Test Corp');
      expect(resultado).toHaveProperty('score', '0/100');
      expect(resultado).toHaveProperty('nivel', '🔴 INSUFICIENTE');
      expect(resultado.elementos_detectados).toHaveLength(0);
    });

    test('debe detectar código de ética', () => {
      const texto = 'La empresa cuenta con un código de ética bien definido';
      const resultado = scoringEngine.analyze(texto, 'Test Corp');
      
      expect(resultado.score).toBe('15/100');
      expect(resultado.elementos_detectados).toContain('código de ética (15pts)');
      expect(resultado.nivel).toBe('🔴 INSUFICIENTE');
    });

    test('debe detectar múltiples elementos', () => {
      const texto = `
        La empresa tiene un código de ética sólido,
        cuenta con un canal de denuncias confidencial,
        y desarrolla capacitación regular para empleados.
      `;
      const resultado = scoringEngine.analyze(texto, 'Test Corp');
      
      // 15 (código) + 18 (canal) + 12 (capacitación) = 45
      expect(resultado.score).toBe('45/100');
      expect(resultado.nivel).toBe('🟠 REGULAR');
      expect(resultado.elementos_detectados).toHaveLength(3);
    });

    test('debe clasificar nivel EXCELENTE', () => {
      const texto = `
        código de ética, canal de denuncias, capacitación,
        evaluación de riesgos, due diligence, monitoreo, sanciones
      `;
      const resultado = scoringEngine.analyze(texto, 'Test Corp');
      expect(resultado.nivel).toContain('🟢 EXCELENTE');
    });
  });

  describe('ComplianceEngine', () => {
    let complianceEngine;

    beforeEach(() => {
      complianceEngine = new ComplianceEngine();
    });

    test('debe instanciarse correctamente', () => {
      expect(complianceEngine).toBeInstanceOf(ComplianceEngine);
    });

    test('debe evaluar programa con pocos elementos', () => {
      const elementos = ['Código de ética', 'Canal de denuncias'];
      const resultado = complianceEngine.evaluateProgram(elementos, 'Test Corp');
      
      expect(resultado.empresa).toBe('Test Corp');
      expect(resultado.elementos_implementados).toBe(2);
      expect(resultado.elementos_totales).toBe(7);
      expect(parseFloat(resultado.cobertura)).toBeCloseTo(28.6, 1);
      expect(resultado.nivel).toBe('🔴 INSUFICIENTE');
    });

    test('debe evaluar programa completo', () => {
      const elementos = [
        'Código de ética',
        'Canal de denuncias', 
        'Capacitación',
        'Evaluación riesgos',
        'Due diligence',
        'Monitoreo',
        'Régimen disciplinario'
      ];
      const resultado = complianceEngine.evaluateProgram(elementos, 'Test Corp');
      
      expect(resultado.elementos_implementados).toBe(7);
      expect(parseFloat(resultado.cobertura)).toBe(100);
      expect(resultado.nivel).toBe('🟢 EXCELENTE');
    });

    test('debe generar reporte básico', () => {
      const datos = { empresa: 'Test Corp', score: '75/100' };
      const reporte = complianceEngine.generateReport('análisis', datos);
      
      expect(reporte).toContain('REPORTE ANÁLISIS DE COMPLIANCE');
      expect(reporte).toContain('Test Corp');
      expect(reporte).toContain('75/100');
      expect(reporte).toContain('© 2025 IntegridAI');
    });
  });

  describe('Integración básica', () => {
    test('debe procesar workflow completo básico', () => {
      const scoringEngine = new ScoringEngine();
      const complianceEngine = new ComplianceEngine();
      
      // Análisis texto
      const texto = 'Tenemos código de ética y canal de denuncias operativo';
      const analisis = scoringEngine.analyze(texto, 'Test Corp', 'Tecnología');
      
      // Evaluación programa
      const elementos = ['Código de ética', 'Canal de denuncias'];
      const evaluacion = complianceEngine.evaluateProgram(elementos, 'Test Corp', 'Tecnología');
      
      // Verificar consistency
      expect(analisis.empresa).toBe(evaluacion.empresa);
      expect(analisis.elementos_detectados.length).toBeGreaterThan(0);
      expect(evaluacion.elementos_implementados).toBe(2);
    });
  });
});