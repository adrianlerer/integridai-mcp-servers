# INTEGRIDAI MVP 2025 - NUEVA ARQUITECTURA
## Estructura de Desarrollo y Migración desde Legacy

**Fecha:** 05 de junio de 2025  
**Proyecto:** IntegridAI - Compliance con IA  
**Fase:** Desarrollo MVP desde cero  
**Responsable:** Ignacio Adrián Lerer  

---

## 1. ESTRUCTURA DE ARCHIVOS PROPUESTA

```
IntegridAI-MCP-MVP-2025/
├── README.md                          # Documentación principal
├── CHANGELOG.md                       # Historial de cambios
├── LICENSE                            # MIT/Propietaria
├── package.json                       # Dependencias y scripts
├── .gitignore                         # Exclusiones Git
├── .env.example                       # Variables de entorno template
├── 
├── src/                               # CÓDIGO FUENTE PRINCIPAL
│   ├── index.js                       # Entry point principal
│   ├── server.js                      # Servidor MCP
│   ├── 
│   ├── core/                          # Módulos core
│   │   ├── iaOrchestrator.js          # Orquestador IA central
│   │   ├── mcpHandler.js              # Manejador protocolo MCP
│   │   ├── complianceEngine.js        # Motor análisis compliance
│   │   └── scoringEngine.js           # Motor scoring Ley 27401
│   │   
│   ├── ai-integrations/               # Integraciones IA
│   │   ├── openaiClient.js            # Cliente OpenAI
│   │   ├── claudeClient.js            # Cliente Claude (Anthropic)
│   │   ├── aiRouter.js                # Router/balanceador IA
│   │   └── promptTemplates.js         # Templates de prompts
│   │   
│   ├── mcp-tools/                     # Herramientas MCP
│   │   ├── complianceTools.js         # Tools compliance Ley 27401
│   │   ├── scoringTools.js            # Tools scoring empresarial
│   │   ├── reportingTools.js          # Tools reportes/auditoría
│   │   └── validationTools.js         # Tools validación datos
│   │   
│   ├── utils/                         # Utilidades
│   │   ├── logger.js                  # Sistema logging
│   │   ├── validators.js              # Validadores entrada
│   │   ├── errorHandler.js            # Manejo errores
│   │   └── helpers.js                 # Funciones auxiliares
│   │   
│   └── api/                           # Endpoints API (opcional)
│       ├── routes.js                  # Rutas principales
│       ├── middleware.js              # Middlewares
│       └── controllers.js             # Controladores
│       
├── config/                            # CONFIGURACIONES
│   ├── default.json                   # Config por defecto
│   ├── development.json               # Config desarrollo
│   ├── production.json                # Config producción
│   ├── scoringRules.json              # Reglas scoring Ley 27401
│   ├── complianceMatrix.json          # Matriz compliance
│   └── aiProviders.json               # Config proveedores IA
│   
├── tests/                             # TESTING
│   ├── unit/                          # Tests unitarios
│   │   ├── core/                      # Tests módulos core
│   │   ├── ai-integrations/           # Tests IA
│   │   └── mcp-tools/                 # Tests herramientas MCP
│   ├── integration/                   # Tests integración
│   ├── fixtures/                      # Datos de prueba
│   └── setup.js                       # Setup testing
│   
├── docs/                              # DOCUMENTACIÓN
│   ├── API.md                         # Documentación API
│   ├── MCP_PROTOCOL.md                # Documentación protocolo MCP
│   ├── COMPLIANCE.md                  # Guía compliance
│   ├── DEPLOYMENT.md                  # Guía despliegue
│   └── LEGAL.md                       # Aspectos legales DNDA
│   
├── scripts/                           # SCRIPTS AUTOMATIZACIÓN
│   ├── build.js                       # Script build
│   ├── deploy.js                      # Script despliegue
│   ├── validate-compliance.js         # Validación compliance
│   └── generate-docs.js               # Generación documentación
│   
└── legacy-rescue/                     # MATERIAL LEGACY (YA MIGRADO)
    ├── README.md                      # Inventario legacy
    └── [archivos legacy organizados]
```

---

## 2. ANÁLISIS MIGRACIÓN VS REESCRITURA

### 🟢 MIGRAR (Código Validado)

#### **Base de Conocimiento Ley 27401** → `config/scoringRules.json`
**Archivo origen:** `mcp_ley27401_server_v4.2_FIXED.cjs`
**Justificación:** Base de datos completa y validada
```javascript
// MIGRAR: LEY_27401_DB completa
{
  "elementos_programa_integridad": [...],
  "delitos_ley27401": [...],
  "factores_riesgo": [...],
  "industrias_alto_riesgo": [...]
}
```

#### **Lógica de Scoring** → `src/core/scoringEngine.js`
**Archivo origen:** Función `analizarCumplimiento()` de v4.2
**Justificación:** Algoritmo probado y funcional

#### **Esquemas MCP Tools** → `src/mcp-tools/complianceTools.js`
**Archivo origen:** Definiciones `tools[]` de v4.2
**Justificación:** Esquemas validados con Claude Desktop

### 🟡 REESCRIBIR (Arquitectura Mejorada)

#### **Servidor MCP** → `src/server.js` + `src/core/mcpHandler.js`
**Justificación:** 
- Separar protocolo de lógica de negocio
- Implementar modularidad y testing
- Corregir problemas de streams identificados

#### **Orquestador IA** → `src/core/iaOrchestrator.js`
**Justificación:**
- Integrar múltiples proveedores IA
- Implementar failover y load balancing
- Añadir caching y optimización

### 🔴 DESCARTAR (Problemático)

#### **mcp_integridai_FIXED.cjs**
**Justificación:** Problemas de conectividad irreparables

#### **Versiones experimentales**
**Justificación:** No están production-ready

---

## 3. TEMPLATES DE ARCHIVOS BASE

### **package.json**
```json
{
  "name": "integridai-mcp-mvp",
  "version": "1.0.0",
  "description": "IntegridAI - Compliance empresarial con IA y protocolo MCP",
  "main": "src/index.js",
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "build": "node scripts/build.js",
    "lint": "eslint src/",
    "validate": "node scripts/validate-compliance.js"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.24.3",
    "openai": "^4.52.7",
    "zod": "^3.23.8",
    "winston": "^3.13.0",
    "dotenv": "^16.4.5",
    "express": "^4.19.2"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "nodemon": "^3.1.4",
    "eslint": "^9.5.0"
  },
  "author": "Ignacio Adrián Lerer",
  "license": "PROPRIETARY",
  "copyright": "© 2025 IntegridAI - Todos los derechos reservados"
}
```

### **src/index.js** (Entry Point)
```javascript
#!/usr/bin/env node
/**
 * IntegridAI MVP 2025 - Entry Point
 * © 2025 IntegridAI - Ignacio Adrián Lerer
 */

import { config } from 'dotenv';
import { logger } from './utils/logger.js';
import { MCPServer } from './server.js';
import { IAOrchestrator } from './core/iaOrchestrator.js';

// Cargar configuración
config();

async function startIntegridAI() {
  try {
    logger.info('🚀 Iniciando IntegridAI MVP 2025...');
    
    // Inicializar componentes
    const iaOrchestrator = new IAOrchestrator();
    await iaOrchestrator.initialize();
    
    const mcpServer = new MCPServer(iaOrchestrator);
    await mcpServer.start();
    
    logger.info('✅ IntegridAI MVP iniciado correctamente');
    logger.info(`📊 Protocolo MCP activo en proceso ${process.pid}`);
    
  } catch (error) {
    logger.error('❌ Error iniciando IntegridAI:', error);
    process.exit(1);
  }
}

// Manejo de señales
process.on('SIGINT', async () => {
  logger.info('🔄 Cerrando IntegridAI MVP...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('🔄 Cerrando IntegridAI MVP...');
  process.exit(0);
});

// Iniciar aplicación
startIntegridAI();
```

### **src/core/iaOrchestrator.js**
```javascript
/**
 * IntegridAI - Orquestador de IA
 * Maneja múltiples proveedores IA con failover
 */

import { OpenAIClient } from '../ai-integrations/openaiClient.js';
import { ClaudeClient } from '../ai-integrations/claudeClient.js';
import { logger } from '../utils/logger.js';

export class IAOrchestrator {
  constructor() {
    this.providers = new Map();
    this.currentProvider = null;
    this.failoverQueue = [];
  }

  async initialize() {
    try {
      // Inicializar proveedores IA
      this.providers.set('openai', new OpenAIClient());
      this.providers.set('claude', new ClaudeClient());
      
      // Configurar prioridades
      this.failoverQueue = ['claude', 'openai'];
      this.currentProvider = this.failoverQueue[0];
      
      logger.info('🤖 Orquestador IA inicializado');
      logger.info(`🎯 Proveedor principal: ${this.currentProvider}`);
      
    } catch (error) {
      logger.error('❌ Error inicializando orquestador IA:', error);
      throw error;
    }
  }

  async processComplianceAnalysis(texto, empresa, industria) {
    const prompt = this.buildCompliancePrompt(texto, empresa, industria);
    
    for (const providerName of this.failoverQueue) {
      try {
        const provider = this.providers.get(providerName);
        const result = await provider.analyze(prompt);
        
        logger.info(`✅ Análisis completado con ${providerName}`);
        return result;
        
      } catch (error) {
        logger.warn(`⚠️ Fallo en ${providerName}, intentando siguiente...`);
        continue;
      }
    }
    
    throw new Error('Todos los proveedores IA fallaron');
  }

  buildCompliancePrompt(texto, empresa, industria) {
    return {
      role: 'system',
      content: `Analiza el siguiente texto empresarial para cumplimiento de Ley 27401...`,
      data: { texto, empresa, industria }
    };
  }
}
```

### **config/scoringRules.json** (Migrado desde Legacy)
```json
{
  "version": "1.0.0",
  "ley27401": {
    "elementos_programa_integridad": [
      {
        "id": "codigo_etica",
        "keyword": "código de ética",
        "peso": 15,
        "descripcion": "Conjunto de principios y valores organizacionales",
        "categoria": "documentacion"
      },
      {
        "id": "capacitacion",
        "keyword": "capacitación",
        "peso": 12,
        "descripcion": "Entrenamiento en integridad y compliance",
        "categoria": "formacion"
      },
      {
        "id": "canal_denuncias",
        "keyword": "canal de denuncias",
        "peso": 18,
        "descripcion": "Mecanismo seguro para reportar irregularidades",
        "categoria": "control"
      }
    ],
    "scoring": {
      "excelente": { "min": 80, "max": 100, "color": "verde" },
      "bueno": { "min": 60, "max": 79, "color": "amarillo" },
      "regular": { "min": 40, "max": 59, "color": "naranja" },
      "insuficiente": { "min": 0, "max": 39, "color": "rojo" }
    }
  }
}
```

### **tests/unit/core/scoringEngine.test.js**
```javascript
/**
 * Tests Unitarios - Scoring Engine
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import { ScoringEngine } from '../../../src/core/scoringEngine.js';

describe('ScoringEngine', () => {
  let scoringEngine;

  beforeEach(() => {
    scoringEngine = new ScoringEngine();
  });

  test('debería analizar texto con código de ética', () => {
    const texto = 'Nuestra empresa tiene un código de ética robusto';
    const result = scoringEngine.analyze(texto);
    
    expect(result.score).toBeGreaterThan(0);
    expect(result.elementos_detectados).toContain('código de ética');
  });

  test('debería retornar score 0 para texto sin elementos', () => {
    const texto = 'Texto sin elementos de compliance';
    const result = scoringEngine.analyze(texto);
    
    expect(result.score).toBe(0);
    expect(result.nivel).toBe('INSUFICIENTE');
  });
});
```

---

## 4. PROCEDIMIENTOS TESTING Y CI/CD

### **Testing Strategy**

#### **Nivel 1: Tests Unitarios**
```bash
# Ejecutar tests unitarios
npm test

# Coverage mínimo requerido: 80%
npm run test:coverage
```

#### **Nivel 2: Tests Integración**
```bash
# Test integración con IA providers
npm run test:integration

# Test protocolo MCP end-to-end
npm run test:mcp
```

#### **Nivel 3: Tests Compliance**
```bash
# Validar reglas de scoring
npm run validate:scoring

# Test casos reales empresariales
npm run test:compliance
```

### **CI/CD Pipeline**

#### **.github/workflows/main.yml**
```yaml
name: IntegridAI CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run validate:compliance
      
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit
      - run: npm run lint
```

---

## 5. COMPLIANCE LEGAL/TÉCNICO

### **Pre-commit Hooks**

#### **.pre-commit-config.yaml**
```yaml
repos:
  - repo: local
    hooks:
      - id: copyright-check
        name: Verificar copyright IntegridAI
        entry: scripts/check-copyright.js
        language: node
        
      - id: compliance-validation
        name: Validar reglas compliance
        entry: scripts/validate-compliance.js
        language: node
```

### **Checklist Push Relevante**

#### **scripts/compliance-checklist.md**
```markdown
## Checklist Compliance - Push Relevante

- [ ] **Copyright actualizado** en archivos nuevos/modificados
- [ ] **Tests unitarios** cubren nueva funcionalidad
- [ ] **Documentación** actualizada en `/docs/`
- [ ] **CHANGELOG.md** incluye cambios relevantes
- [ ] **Scoring rules** validadas contra casos test
- [ ] **Configuración** no expone secrets/tokens
- [ ] **Logs** no contienen información sensible
- [ ] **Versión** actualizada en package.json (si corresponde)

### Validación Legal DNDA:
- [ ] Código es 100% original o migrado desde legacy propio
- [ ] No hay dependencias con licencias incompatibles
- [ ] Headers de copyright presentes y correctos
```

### **Documentación Continua**

#### **scripts/generate-docs.js**
```javascript
/**
 * Generador automático de documentación
 * Se ejecuta en cada push a main
 */

import fs from 'fs';
import path from 'path';

// Generar API docs desde JSDoc
// Actualizar README con estadísticas
// Validar links y referencias
// Crear changelog automático desde commits
```

---

## 6. CRONOGRAMA DE IMPLEMENTACIÓN

### **Semana 1: Base Architecture**
- [ ] Estructura de directorios
- [ ] Package.json y dependencias
- [ ] Entry point y servidor MCP básico
- [ ] Tests unitarios setup

### **Semana 2: Core Modules**
- [ ] Migrar scoring engine desde legacy
- [ ] Implementar orquestador IA
- [ ] Configurar proveedores IA
- [ ] Tests integración básicos

### **Semana 3: MCP Tools**
- [ ] Migrar herramientas MCP validadas
- [ ] Implementar nuevas tools
- [ ] Documentación API completa
- [ ] CI/CD pipeline

### **Semana 4: Polish & Deploy**
- [ ] Compliance final validation
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentación legal DNDA

---

## 7. MÉTRICAS DE ÉXITO

### **Técnicas**
- ✅ Tests coverage > 80%
- ✅ Response time < 500ms
- ✅ Zero security vulnerabilities
- ✅ MCP protocol 100% compliant

### **Legales**
- ✅ Copyright en 100% archivos
- ✅ Documentación DNDA completa
- ✅ Trazabilidad de código fuente
- ✅ Compliance checklist automatizado

### **Funcionales**
- ✅ Análisis Ley 27401 funcional
- ✅ Integración multi-IA estable
- ✅ Scoring preciso y documentado
- ✅ Reportes auditables

---

**NOTA:** Esta arquitectura garantiza modularidad, testabilidad, compliance legal y escalabilidad para el crecimiento futuro de IntegridAI.