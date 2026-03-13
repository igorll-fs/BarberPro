#!/usr/bin/env node
/**
 * Script de configuração dos git hooks para o projeto BARBERPRO
 *
 * Este script configura automaticamente os hooks do git para usar
 * os hooks personalizados na pasta .githooks/
 *
 * Uso: node scripts/setup-git-hooks.js
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";

function log(message, type = "info") {
  const colors = { error: RED, warning: YELLOW, success: GREEN, info: BLUE };
  const prefix = { error: "❌", warning: "⚠️", success: "✅", info: "ℹ️" };
  console.log(`${colors[type] || ""}${prefix[type] || ""} ${message}${RESET}`);
}

function setupGitHooks() {
  log("Configurando git hooks...", "info");

  try {
    // Configura o git para usar a pasta .githooks
    execSync("git config core.hooksPath .githooks", { stdio: "inherit" });
    log("Git hooks configurados com sucesso!", "success");

    // Verifica se o hook pre-commit existe
    const preCommitPath = path.join(".githooks", "pre-commit");
    if (fs.existsSync(preCommitPath)) {
      log("Hook pre-commit encontrado", "success");

      // Torna o hook executável (Unix/Linux/Mac)
      try {
        execSync(`chmod +x ${preCommitPath}`);
        log("Hook pre-commit tornado executável", "success");
      } catch (error) {
        // No Windows, chmod pode falhar - isso é normal
        log(
          "Nota: chmod pode não funcionar no Windows - isso é normal",
          "warning",
        );
      }
    } else {
      log("Hook pre-commit não encontrado em .githooks/pre-commit", "error");
      return false;
    }

    return true;
  } catch (error) {
    log(`Erro ao configurar hooks: ${error.message}`, "error");
    return false;
  }
}

function verifySetup() {
  log("\nVerificando configuração...", "info");

  try {
    const hooksPath = execSync("git config core.hooksPath", {
      encoding: "utf8",
    }).trim();

    if (hooksPath === ".githooks") {
      log("✓ Git hooks path configurado corretamente", "success");
    } else {
      log("✗ Git hooks path não configurado corretamente", "error");
      return false;
    }

    // Verifica se o Node.js está disponível
    try {
      const nodeVersion = execSync("node --version", {
        encoding: "utf8",
      }).trim();
      log(`✓ Node.js encontrado: ${nodeVersion}`, "success");
    } catch (error) {
      log("✗ Node.js não encontrado", "error");
      return false;
    }

    return true;
  } catch (error) {
    log(`Erro na verificação: ${error.message}`, "error");
    return false;
  }
}

function main() {
  log("\n🚀 CONFIGURAÇÃO DE GIT HOOKS - BARBERPRO\n", "info");

  const setupSuccess = setupGitHooks();
  const verifySuccess = verifySetup();

  log("\n" + "=".repeat(50), "info");

  if (setupSuccess && verifySuccess) {
    log("CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!", "success");
    log("\nPróximos passos:", "info");
    log(
      '1. Faça um teste: git commit --allow-empty -m "test: verificar hooks"',
      "info",
    );
    log("2. Os hooks serão executados automaticamente em todo commit", "info");
    log(
      "3. Para pular os hooks em emergências: git commit --no-verify",
      "warning",
    );
  } else {
    log("CONFIGURAÇÃO INCOMPLETA!", "error");
    process.exit(1);
  }
}

main();
