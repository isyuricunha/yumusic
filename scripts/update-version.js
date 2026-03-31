// Script called by @semantic-release/exec during the prepare phase.
// Updates the version field in both package.json and src-tauri/tauri.conf.json
// so that the installed app version matches the GitHub Release tag.
//
// Usage: node scripts/update-version.js <version>
const fs = require('fs');
const path = require('path');

const version = process.argv[2];
if (!version) {
  console.error('Usage: node scripts/update-version.js <version>');
  process.exit(1);
}

const root = path.resolve(__dirname, '..');

// ─── package.json ────────────────────────────────────────────────────────────
const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.version = version;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`✅  package.json → ${version}`);

// ─── src-tauri/tauri.conf.json ───────────────────────────────────────────────
const tauriPath = path.join(root, 'src-tauri', 'tauri.conf.json');
const tauri = JSON.parse(fs.readFileSync(tauriPath, 'utf8'));
tauri.version = version;
fs.writeFileSync(tauriPath, JSON.stringify(tauri, null, 2) + '\n');
console.log(`✅  tauri.conf.json → ${version}`);
