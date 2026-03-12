#!/usr/bin/env node
/**
 * Script para gerar ícones do PWA
 * 
 * Requer: npm install sharp
 * Uso: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Cria SVG simples como placeholder
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const svgTemplate = (size) => `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#10B981"/>
      <stop offset="100%" style="stop-color:#059669"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)" rx="${size * 0.22}"/>
  <text x="50%" y="55%" font-size="${size * 0.5}" text-anchor="middle" dominant-baseline="middle">
    💈
  </text>
</svg>
`;

console.log('🎨 Gerando ícones do PWA...\n');

const iconsDir = path.join(__dirname, '../apps/web/public/icons');

// Cria pasta se não existir
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log('📁 Pasta icons criada');
}

// Gera SVGs para cada tamanho
sizes.forEach(size => {
  const svg = svgTemplate(size);
  const filePath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`✅ icon-${size}x${size}.svg`);
});

console.log('\n⚠️  NOTA: Estes são ícones SVG placeholders.');
console.log('   Para produção, substitua por PNGs reais:');
console.log('   - Use o Figma para criar o ícone');
console.log('   - Exporte em todos os tamanhos');
console.log('   - Ou use: https://www.pwabuilder.com/imageGenerator');
console.log('\n✨ Ícones gerados em: apps/web/public/icons/');
