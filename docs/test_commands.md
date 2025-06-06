# COMANDOS DE PRUEBA - INTEGRIDAI MVP 2025

## PASO 1: Copiar Archivos

Ejecuta estos comandos desde `/Users/adria1/Documents/IntegridAI-MCP-MVP-2025/`:

```bash
# Copiar entry point
cat > src/index.js << 'EOF'
[COPIAR CONTENIDO DEL ARTIFACT: src/index.js - Entry Point IntegridAI]
EOF

# Copiar servidor MCP
cat > src/server.js << 'EOF'
[COPIAR CONTENIDO DEL ARTIFACT: src/server.js - Servidor MCP IntegridAI]
EOF

# Copiar configuración ESLint
cat > eslint.config.js << 'EOF'
[COPIAR CONTENIDO DEL ARTIFACT: eslint.config.js - Configuración ESLint v9]
EOF

# Copiar tests básicos
cat > tests/unit/basic.test.js << 'EOF'
[COPIAR CONTENIDO DEL ARTIFACT: tests/unit/basic.test.js - Tests Básicos]
EOF
```

## PASO 2: Verificar Funcionamiento

```bash
# Ejecutar linting (debe pasar sin errores)
npm run lint

# Ejecutar tests (deben pasar todos)
npm test

# Verificar que el servidor inicia correctamente
npm start
```

## PASO 3: Probar Servidor MCP

```bash
# Iniciar servidor en terminal separado
npm start

# En otra terminal, probar JSON-RPC manualmente:
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' | npm start

echo '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' | npm start

echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"test_integridai","arguments":{"mensaje":"Hello IntegridAI!"}}}' | npm start
```

## PASO 4: Configurar Claude Desktop

Editar configuración Claude Desktop en:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "integridai-mvp": {
      "command": "/opt/homebrew/bin/node",
      "args": ["/Users/adria1/Documents/IntegridAI-MCP-MVP-2025/src/index.js"]
    }
  }
}
```

## PASO 5: Probar en Claude Desktop

1. Reiniciar Claude Desktop
2. Verificar conexión MCP en settings
3. Probar herramientas:

**Test básico:**
```
Usa la herramienta test_integridai con mensaje "¡IntegridAI funcionando!"
```

**Análisis compliance:**
```
Analiza este texto con analizar_cumplimiento_ley27401:

"Nuestra empresa cuenta con un sólido código de ética que guía todas nuestras operaciones. Hemos implementado un canal de denuncias confidencial para reportar irregularidades. Nuestro programa de capacitación asegura que todos los empleados conozcan nuestros valores y procedimientos."

Empresa: "TechCorp SA"
Industria: "Tecnología"
```

**Evaluación programa:**
```
Evalúa nuestro programa de integridad con evaluar_programa_integridad:

Elementos: ["Código de ética", "Canal de denuncias", "Capacitación", "Evaluación de riesgos"]
Empresa: "TechCorp SA"
Industria: "Tecnología"
```

## PASO 6: Comandos de Desarrollo

```bash
# Desarrollo con auto-reload
npm run dev

# Ejecutar tests en modo watch
npm run test:watch

# Validar compliance
npm run validate

# Migrar desde legacy (cuando esté listo)
npm run migrate
```

## TROUBLESHOOTING

### Si el servidor no inicia:
```bash
# Verificar Node.js version
node --version  # Debe ser >= 20

# Verificar dependencias
npm install

# Ver logs detallados
DEBUG=* npm start
```

### Si Claude Desktop no conecta:
1. Verificar ruta absoluta en config
2. Verificar permisos de ejecución: `chmod +x src/index.js`
3. Probar manualmente: `/opt/homebrew/bin/node src/index.js`
4. Revisar logs Claude Desktop

### Si tests fallan:
```bash
# Instalar Jest globalmente si es necesario
npm install -g jest

# Ejecutar test específico
npm test -- --testNamePattern="ScoringEngine"

# Ver coverage
npm test -- --coverage
```

## PRÓXIMOS PASOS

1. ✅ **Setup básico completado**
2. 🔄 **Configurar APIs IA** (editar `.env`)
3. 🔄 **Migrar código legacy validado**
4. 🔄 **Extender herramientas MCP**
5. 🔄 **Setup CI/CD pipeline**

---
**© 2025 IntegridAI - Ignacio Adrián Lerer**