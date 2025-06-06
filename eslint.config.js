/**
 * IntegridAI MVP 2025 - Configuración ESLint v9
 * © 2025 IntegridAI - Ignacio Adrián Lerer
 */

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        // Node.js globals
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly"
      }
    },
    rules: {
      // Posibles errores
      "no-console": "off", // Permitimos console para logging MCP
      "no-debugger": "warn",
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-undef": "error",
      
      // Mejores prácticas
      "eqeqeq": "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-proto": "error",
      "no-script-url": "error",
      "no-sequences": "error",
      "no-throw-literal": "error",
      "no-unmodified-loop-condition": "error",
      "no-unused-expressions": "error",
      "no-useless-call": "error",
      "no-useless-concat": "error",
      "no-useless-return": "error",
      "no-void": "error",
      "prefer-promise-reject-errors": "error",
      "radix": "error",
      "wrap-iife": ["error", "inside"],
      
      // Estilo de código
      "camelcase": ["warn", { "properties": "never" }],
      "comma-spacing": ["error", { "before": false, "after": true }],
      "comma-style": ["error", "last"],
      "eol-last": "error",
      "key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
      "keyword-spacing": "error",
      "no-multiple-empty-lines": ["error", { "max": 2 }],
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "semi": ["error", "always"],
      "space-before-blocks": "error",
      "space-before-function-paren": ["error", {
        "anonymous": "always",
        "named": "never",
        "asyncArrow": "always"
      }],
      "space-in-parens": ["error", "never"],
      "space-infix-ops": "error",
      
      // ES6+
      "arrow-spacing": "error",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "error",
      "prefer-template": "error"
    }
  },
  {
    files: ["tests/**/*.js", "**/*.test.js", "**/*.spec.js"],
    languageOptions: {
      globals: {
        // Jest globals
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        jest: "readonly"
      }
    },
    rules: {
      // Relajar algunas reglas para tests
      "no-unused-expressions": "off"
    }
  },
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      "coverage/",
      "logs/",
      "legacy-rescue/"
    ]
  }
];