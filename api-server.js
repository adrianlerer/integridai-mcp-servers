// api-server.js
import express from 'express';
import { MCPServer } from './src/server.js';

const app = express();
app.use(express.json());

const mcpServer = new MCPServer();

async function main() {
  await mcpServer.start();

  app.post('/test', async (req, res) => {
    const result = await mcpServer.toolTestIntegridai(req.body);
    res.json(result);
  });

  app.post('/analizar', async (req, res) => {
    const result = await mcpServer.toolAnalizarCumplimiento(req.body);
    res.json(result);
  });

  app.post('/evaluar', async (req, res) => {
    const result = await mcpServer.toolEvaluarProgramaIntegridad(req.body);
    res.json(result);
  });

  app.listen(3000, () => {
    console.log('🎉 IntegridAI API funcionando en http://localhost:3000');
    console.log(`📦 Probar: curl -X POST http://localhost:3000/test -H "Content-Type: application/json" -d '{"mensaje": "API Test"}'`);
  });
}

main().catch((err) => {
  console.error("❌ Error al iniciar IntegridAI API:", err);
});
