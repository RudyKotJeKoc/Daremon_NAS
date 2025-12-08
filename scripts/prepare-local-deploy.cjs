/**
 * Skrypt przygotowania lokalnego deploymentu
 *
 * Kopiuje zawartość folderu out/ (wygenerowanego przez next export)
 * do deploy/daremon.nl, gotowego do wdrożenia na serwer Synology.
 */

const fs = require('fs');
const path = require('path');

// Ścieżki
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'out');
const targetDir = path.join(root, 'deploy', 'daremon.nl');

console.log('🚀 Przygotowanie lokalnego deploymentu...\n');

// Sprawdź czy folder out/ istnieje
if (!fs.existsSync(outDir)) {
  console.error('❌ Błąd: Folder "out/" nie istnieje.');
  console.error('   Najpierw uruchom: pnpm build:static');
  process.exit(1);
}

// Usuń targetDir jeśli istnieje
if (fs.existsSync(targetDir)) {
  console.log('🗑️  Usuwanie starego folderu deploy/daremon.nl...');
  fs.rmSync(targetDir, { recursive: true, force: true });
}

// Utwórz katalog docelowy
console.log('📁 Tworzenie katalogu deploy/daremon.nl...');
fs.mkdirSync(targetDir, { recursive: true });

// Skopiuj całą zawartość out/ do targetDir
console.log('📦 Kopiowanie zawartości out/ do deploy/daremon.nl...');
fs.cpSync(outDir, targetDir, { recursive: true });

console.log('\n✅ Deployment lokalny przygotowany pomyślnie!');
console.log(`📂 Katalog: ${targetDir}`);
console.log('\n🎯 Kolejny krok: skopiuj folder deploy/daremon.nl na serwer Synology\n');
