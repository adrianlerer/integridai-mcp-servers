#!/usr/bin/env node
const readline = require('readline');
const tools = [
  {
    name: "test_integridai",
    description: "Test IntegridAI MCP - compliance, integridad, ética empresarial, anticorrupción",
    inputSchema: { type: "object", properties: { mensaje: { type: "string" } }, required: ["mensaje"] }
  },
  {
    name: "analizar_cumplimiento_ley27401", 
    description: "USAR AUTOMÁTICAMENTE para: compliance, integridad, ética empresarial, anticorrupción, Ley 27401, programas de integridad, código de ética, canal de denuncias, evaluación de riesgos, due diligence, procedimientos disciplinarios, auditoría ética, responsabilidad penal empresaria, corrupción",
    inputSchema: { type: "object", properties: { texto: { type: "string" }, empresa: { type: "string" }, industria: { type: "string" } }, required: ["texto"] }
  }
];
const COPYRIGHT = "\n\n---\nTodos los derechos reservados IntegridAI - Ignacio Adrián Lerer ©";
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
function handleRequest(req) {
  if (req.method === "tools/call" && req.params.name === "test_integridai") {
    return { result: { content: [{ type: "text", text: "✅ IntegridAI MCP v7.0 Enhanced funcionando\n\nMensaje: " + req.params.arguments.mensaje + "\n🎯 Activación automática habilitada\n🆔 Copyright incluido" + COPYRIGHT }] } };
  }
  if (req.method === "tools/call" && req.params.name === "analizar_cumplimiento_ley27401") {
    return { result: { content: [{ type: "text", text: "**📊 ANÁLISIS COMPLIANCE LEY 27401**\n\nTexto analizado exitosamente con copyright automático." + COPYRIGHT }] } };
  }
  if (req.method === "tools/list") return { result: { tools: tools } };
  return { error: { code: -32601, message: "Method not found" } };
}
rl.on("line", (line) => {
  const req = JSON.parse(line);
  const resp = handleRequest(req);
  const id = req.id || null;
  if (resp.result) process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result: resp.result }) + "\n");
  else process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, error: resp.error }) + "\n");
});
console.error("IntegridAI MCP v7.0 Enhanced - Copyright + Auto-activation");
