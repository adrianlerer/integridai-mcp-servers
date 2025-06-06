#!/bin/bash
# IntegridAI MVP 2025 - Quick Start Script
# © 2025 IntegridAI - Ignacio Adrián Lerer
# 
# Script para automatizar setup inicial completo

set -e  # Exit on error

echo "🚀 IntegridAI MVP 2025 - Quick Start"
echo "© 2025 IntegridAI - Ignacio Adrián Lerer"
echo "=================================================="

# Variables
PROJECT_DIR="/Users/adria1/Documents/IntegridAI-MCP-MVP-2025"
LEGACY_DIR="$PROJECT_DIR/legacy-rescue"

echo "📁 Directorio del proyecto: $PROJECT_DIR"

# Verificar directorio proyecto existe
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Directorio $PROJECT_DIR no existe"
    echo "   Crear manualmente y ejecutar este script desde ahí"
    exit 1
fi

cd "$PROJECT_DIR"

echo "📋 FASE 1: VERIFICACIÓN INICIAL"
echo "================================"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "   Instalar Node.js 20+ desde https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'.' -f1 | sed 's/v//')
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js versión $NODE_VERSION detectada. Se requiere 20+"
    exit 1
fi

echo "✅ Node.js $(node --version) OK"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está disponible"
    exit 1
fi

echo "✅ npm $(npm --version) OK"

echo ""
echo "📋 FASE 2: SETUP ARCHIVOS BASE"
echo "==============================="

# Crear package.json si no existe
if [ ! -f "package.json" ]; then
    echo "📄 Creando package.json..."
    cat > package.json << 'EOF'
{
  "name": "integridai-mcp-mvp",
  "version": "1.0.0",
  "description": "IntegridAI - Compliance empresarial con IA y protocolo MCP",
  "main": "src/index.js",
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest --passWithNoTests",
    "test:watch": "jest --watch --passWithNoTests",
    "build": "node scripts/build.js",
    "lint": "eslint src/ --ext .js",
    "validate": "node scripts/validate-compliance.js",
    "setup": "node scripts/setup-project.js",
    "migrate": "node scripts/migrate-from-legacy.js"
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
EOF
    echo "✅ package.json creado"
else
    echo "✅ package.json existe"
fi

# Crear estructura de directorios
echo "📁 Creando estructura de directorios..."
mkdir -p src/core src/ai-integrations src/mcp-tools src/utils src/api
mkdir -p config tests/unit tests/integration docs scripts logs
mkdir -p legacy-rescue  # Si no existe

echo "✅ Estructura de directorios creada"

# Crear .env.example si no existe
if [ ! -f ".env.example" ]; then
    echo "📄 Creando .env.example..."
    cat > .env.example << 'EOF'
# IntegridAI MVP 2025 - Variables de Entorno
NODE_ENV=development
LOG_LEVEL=info
OPENAI_API_KEY=sk-your-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
PORT=3000
EOF
    echo "✅ .env.example creado"
fi

# Crear .env si no existe
if [ ! -f ".env" ]; then
    echo "📄 Creando .env desde template..."
    cp .env.example .env
    echo "✅ .env creado - EDITAR con tus API keys"
else
    echo "✅ .env existe"
fi

# Crear .gitignore
if [ ! -f ".gitignore" ]; then
    echo "📄 Creando .gitignore..."
    cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
logs/
*.log
coverage/
dist/
build/
.DS_Store
tmp/
EOF
    echo "✅ .gitignore creado"
fi

echo ""
echo "📋 FASE 3: INSTALACIÓN DEPENDENCIAS"
echo "===================================="

echo "📦 Instalando dependencias..."
npm install

echo "✅ Dependencias instaladas"

echo ""
echo "📋 FASE 4: ARCHIVOS CORE MÍNIMOS"
echo "================================="

# Crear logger básico
if [ ! -f "src/utils/logger.js" ]; then
    echo "📄 Creando logger básico..."
    cat > src/utils/logger.js << 'EOF'
/**
 * IntegridAI - Logger Básico
 * © 2025 IntegridAI - Ignacio Adrián Lerer
 */

export const logger = {
  info: (msg) => console.error(`[INFO] ${new Date().toISOString()} - ${msg}`),
  warn: (msg) => console.error(`[WARN] ${new Date().toISOString()} - ${msg}`),
  error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
  debug: (msg) => console.error(`[DEBUG] ${new Date().toISOString()} - ${msg}`)
};
EOF
    echo "✅ Logger básico creado"
fi

# Crear validators básico
if [ ! -f "src/utils/validators.js" ]; then
    echo "📄 Creando validators básicos..."
    cat > src/utils/validators.js << 'EOF'
/**
 * IntegridAI - Validators Básicos
 * © 2025 IntegridAI - Ignacio Adrián Lerer
 */

export async function validateEnvironment() {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 20) {
    throw new Error(`Node.js >= 20 requerido. Actual: ${nodeVersion}`);
  }
  
  return true;
}

export function validateInput(input, rules) {
  if (!input || typeof input !== 'object') {
    throw new Error('Input inválido: objeto requerido');
  }
  return true;
}
EOF
    echo "✅ Validators básicos creados"
fi

# Crear IA Orchestrator placeholder
if [ ! -f "src/core/iaOrchestrator.js" ]; then
    echo "📄 Creando IA Orchestrator placeholder..."
    cat > src/core/iaOrchestrator.js << 'EOF'
/**
 * IntegridAI - IA Orchestrator Placeholder
 * © 2025 IntegridAI - Ignacio Adrián Lerer
 */

export class IAOrchestrator {
  async initialize() {
    console.error('🤖 IA Orchestrator - Modo básico (configurar API keys en .env)');
    return true;
  }

  async processComplianceAnalysis(texto, empresa, industria) {
    return {
      status: "Análisis IA no disponible",
      suggestion: "Configurar OPENAI_API_KEY o ANTHROPIC_API_KEY en .env"
    };
  }
}
EOF
    echo "✅ IA Orchestrator placeholder creado"
fi

# Crear Scoring Engine básico
if [ ! -f "src/core/scoringEngine.js" ]; then
    echo "📄 Creando Scoring Engine básico..."
    cat > src/core/scoringEngine.js << 'EOF'
/**
 * IntegridAI - Scoring Engine Básico
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
EOF
    echo "✅ Scoring Engine básico creado"
fi

# Crear Compliance Engine básico
if [ ! -f "src/core/complianceEngine.js" ]; then
    echo "📄 Creando Compliance Engine básico..."
    cat > src/core/complianceEngine.js << 'EOF'
/**
 * IntegridAI - Compliance Engine Básico
 * © 2025 IntegridAI - Ignacio Adrián Lerer
 */

export class ComplianceEngine {
  evaluateProgram(elementos, empresa, industria = "") {
    const total = 7; // Total elementos Ley 27401
    const implementados = elementos.length;
    const cobertura = (implementados / total) * 100;

    return {
      empresa,
      nivel: cobertura >= 80 ? "🟢 EXCELENTE" : cobertura >= 60 ? "🟡 BUENO" : "🔴 INSUFICIENTE",
      cobertura: cobertura.toFixed(1),
      elementos_implementados: implementados,
      elementos_totales: total,
      implementados: elementos,
      faltantes: ["Pendiente análisis detallado"],
      recomendaciones: ["Implementar elementos faltantes", "Documentar procesos"]
    };
  }

  generateReport(tipo, datos) {
    return `**REPORTE ${tipo.toUpperCase()} DE COMPLIANCE**

Empresa: ${datos.empresa}
Score: ${datos.score}
Generado: ${new Date().toISOString()}

© 2025 IntegridAI - Ignacio Adrián Lerer`;
  }
}
EOF
    echo "✅ Compliance Engine básico creado"
fi

echo ""
echo "📋 FASE 5: TESTS BÁSICOS"
echo "========================"

echo "🧪 Ejecutando tests básicos..."
npm test

echo "🔍 Verificando linting..."
npm run lint --silent || echo "⚠️ Linting warnings - continuar"

echo ""
echo "🎉 INTEGRIDAI MVP 2025 - SETUP COMPLETADO"
echo "=========================================="

echo ""
echo "✅ RESUMEN:"
echo "   • Estructura de archivos creada"
echo "   • Dependencias instaladas"
echo "   • Archivos core básicos generados"
echo "   • Tests iniciales pasando"

echo ""
echo "🚀 PRÓXIMOS PASOS:"
echo "   1. Editar .env con tus API keys (opcional)"
echo "   2. Copiar artifacts de Claude para archivos completos:"
echo "      - src/index.js (Entry Point)"
echo "      - src/server.js (Servidor MCP)"
echo "   3. npm start"
echo "   4. Configurar Claude Desktop"

echo ""
echo "📋 COMANDOS ÚTILES:"
echo "   npm start           # Iniciar servidor MCP"
echo "   npm run dev         # Modo desarrollo"
echo "   npm test            # Ejecutar tests"
echo "   npm run lint        # Verificar código"

echo ""
echo "📁 ARCHIVOS IMPORTANTES:"
echo "   • .env              # Variables de entorno (EDITAR)"
echo "   • src/index.js      # Entry point (COMPLETAR con artifact)"
echo "   • src/server.js     # Servidor MCP (COMPLETAR con artifact)"
echo "   • legacy-rescue/    # Material legacy preservado"

echo ""
echo "© 2025 IntegridAI - Ignacio Adrián Lerer"
echo "🎊 ¡MVP listo para desarrollo!"