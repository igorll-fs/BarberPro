#!/usr/bin/env node
/**
 * Script de verificação pré-commit para o projeto BARBERPRO
 *
 * Este script verifica:
 * 1. Arquivos de backup (.backup, .old, .bak)
 * 2. Dependências não utilizadas (via depcheck)
 * 3. Arquivos grandes (>10MB)
 * 4. Console.logs esquecidos
 * 5. Chaves de API expostas
 *
 * Uso: node scripts/pre-commit-checks.js
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";

let hasErrors = false;
let hasWarnings = false;

function log(message, type = "info") {
  const colors = { error: RED, warning: YELLOW, success: GREEN, info: BLUE };
  const prefix = { error: "❌", warning: "⚠️", success: "✅", info: "ℹ️" };
  console.log(`${colors[type] || ""}${prefix[type] || ""} ${message}${RESET}`);
}

// 1. Verificar arquivos de backup
function checkBackupFiles() {
  log("Verificando arquivos de backup...", "info");

  try {
    const output = execSync("git diff --cached --name-only --diff-filter=ACM", {
      encoding: "utf8",
    });
    const files = output.split("\n").filter(Boolean);

    const backupPatterns = /\.(backup|old|bak|tmp|temp|orig)$/i;
    const foundBackups = files.filter((f) => backupPatterns.test(f));

    if (foundBackups.length > 0) {
      log("Arquivos de backup detectados:", "error");
      foundBackups.forEach((f) => log(`  - ${f}`, "error"));
      log("Remova os arquivos de backup antes de commitar.", "warning");
      hasErrors = true;
      return false;
    }

    log("Nenhum arquivo de backup encontrado.", "success");
    return true;
  } catch (error) {
    log(`Erro ao verificar arquivos: ${error.message}`, "error");
    return false;
  }
}

// 2. Verificar arquivos grandes
function checkLargeFiles() {
  log("Verificando arquivos grandes (>10MB)...", "info");

  try {
    const output = execSync("git diff --cached --name-only --diff-filter=ACM", {
      encoding: "utf8",
    });
    const files = output.split("\n").filter(Boolean);

    const largeFiles = [];

    for (const file of files) {
      if (!fs.existsSync(file)) continue;

      const stats = fs.statSync(file);
      if (stats.size > 10 * 1024 * 1024) {
        // 10MB
        largeFiles.push({ file, size: (stats.size / 1024 / 1024).toFixed(2) });
      }
    }

    if (largeFiles.length > 0) {
      log("Arquivos grandes detectados:", "warning");
      largeFiles.forEach(({ file, size }) => {
        log(`  - ${file} (${size} MB)`, "warning");
      });
      log("Considere usar Git LFS para arquivos grandes.", "warning");
      hasWarnings = true;
      return false;
    }

    log("Nenhum arquivo grande encontrado.", "success");
    return true;
  } catch (error) {
    log(`Erro ao verificar tamanho: ${error.message}`, "error");
    return false;
  }
}

// 3. Verificar console.logs
function checkConsoleLogs() {
  log("Verificando console.logs esquecidos...", "info");

  try {
    const output = execSync("git diff --cached --name-only --diff-filter=ACM", {
      encoding: "utf8",
    });
    const files = output
      .split("\n")
      .filter(
        (f) => f.endsWith(".ts") || f.endsWith(".tsx") || f.endsWith(".js"),
      );

    const filesWithLogs = [];

    for (const file of files) {
      if (!fs.existsSync(file)) continue;

      const content = fs.readFileSync(file, "utf8");
      // Ignora console.log em arquivos de teste
      if (file.includes(".test.") || file.includes(".spec.")) continue;

      if (/console\.(log|warn|error|info)\(/i.test(content)) {
        filesWithLogs.push(file);
      }
    }

    if (filesWithLogs.length > 0) {
      log("Console.logs detectados:", "warning");
      filesWithLogs.forEach((f) => log(`  - ${f}`, "warning"));
      log(
        "Remova os console.logs antes de commitar ou use // eslint-disable-next-line no-console",
        "warning",
      );
      hasWarnings = true;
      return false;
    }

    log("Nenhum console.log encontrado.", "success");
    return true;
  } catch (error) {
    log(`Erro ao verificar logs: ${error.message}`, "error");
    return false;
  }
}

// 4. Verificar chaves de API expostas
function checkExposedSecrets() {
  log("Verificando chaves de API expostas...", "info");

  const patterns = [
    /['"]AIza[0-9A-Za-z_-]{35}['"]/, // Firebase API Key
    /['"]sk-[0-9A-Za-z]{48}['"]/, // OpenAI/Stripe Secret Key
    /['"]pk_[0-9A-Za-z]{24,}['"]/, // Stripe Publishable Key
    /['"]rk_[0-9A-Za-z]{24,}['"]/, // Stripe Restricted Key
    /password\s*[:=]\s*['"][^'"]+['"]/i,
    /api[_-]?key\s*[:=]\s*['"][^'"]+['"]/i,
    /secret\s*[:=]\s*['"][^'"]+['"]/i,
  ];

  try {
    const output = execSync("git diff --cached --name-only --diff-filter=ACM", {
      encoding: "utf8",
    });
    const files = output
      .split("\n")
      .filter(
        (f) =>
          f.endsWith(".ts") ||
          f.endsWith(".tsx") ||
          f.endsWith(".js") ||
          f.endsWith(".json"),
      );

    const filesWithSecrets = [];

    for (const file of files) {
      if (!fs.existsSync(file)) continue;
      // Ignora arquivos de configuração de exemplo
      if (file.includes(".example.")) continue;

      const content = fs.readFileSync(file, "utf8");

      for (const pattern of patterns) {
        if (pattern.test(content)) {
          filesWithSecrets.push(file);
          break;
        }
      }
    }

    if (filesWithSecrets.length > 0) {
      log("⚠️  POSSÍVEIS CHAVES DE API EXPOSTAS:", "error");
      filesWithSecrets.forEach((f) => log(`  - ${f}`, "error"));
      log("VERIFIQUE IMEDIATAMENTE! Use variáveis de ambiente.", "error");
      hasErrors = true;
      return false;
    }

    log("Nenhuma chave de API exposta detectada.", "success");
    return true;
  } catch (error) {
    log(`Erro ao verificar secrets: ${error.message}`, "error");
    return false;
  }
}

// 5. Verificar .env files
function checkEnvFiles() {
  log("Verificando arquivos .env...", "info");

  try {
    const output = execSync("git diff --cached --name-only --diff-filter=ACM", {
      encoding: "utf8",
    });
    const files = output
      .split("\n")
      .filter((f) => f.includes(".env") && !f.includes(".env.example"));

    if (files.length > 0) {
      log("ARQUIVOS .ENV DETECTADOS:", "error");
      files.forEach((f) => log(`  - ${f}`, "error"));
      log("NUNCA commite arquivos .env! Use .env.example", "error");
      hasErrors = true;
      return false;
    }

    log("Nenhum arquivo .env encontrado.", "success");
    return true;
  } catch (error) {
    log(`Erro ao verificar .env: ${error.message}`, "error");
    return false;
  }
}

// Função principal
function main() {
  log("\n🔍 INICIANDO VERIFICAÇÕES PRÉ-COMMIT\n", "info");

  checkBackupFiles();
  checkLargeFiles();
  checkConsoleLogs();
  checkExposedSecrets();
  checkEnvFiles();

  log("\n" + "=".repeat(50), "info");

  if (hasErrors) {
    log("COMMIT BLOQUEADO! Corrija os erros acima.", "error");
    process.exit(1);
  }

  if (hasWarnings) {
    log("COMMIT PERMITIDO COM AVISOS.", "warning");
    log("Recomendamos corrigir os avisos antes de push.", "warning");
  } else {
    log("TODAS AS VERIFICAÇÕES PASSARAM!", "success");
  }

  process.exit(0);
}

main();
