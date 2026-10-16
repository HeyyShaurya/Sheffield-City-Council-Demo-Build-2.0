import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const archiverRaw = require('archiver');
const archiver = typeof archiverRaw === 'function' ? archiverRaw : (archiverRaw.default || archiverRaw.create || archiverRaw);

const ROOT_DIR = path.resolve('.');
const OUTPUT_ZIP = path.resolve('sheffield-connect-pme100113345.zip');

const EXCLUDED_DIRS = new Set([
  'node_modules',
  'dist',
  '.git',
  '.aistudio',
  'skills',
  '.vscode',
  '.idea'
]);

const EXCLUDED_FILES = new Set([
  'sheffield-connect-pme100113345.zip',
  'package-lock.json',
]);

function getFiles(dir: string, baseDir: string = ROOT_DIR): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files: string[] = [];
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) {
        files = files.concat(getFiles(path.join(dir, entry.name), baseDir));
      }
    } else {
      if (!EXCLUDED_FILES.has(entry.name) && !entry.name.endsWith('.zip')) {
        files.push(path.relative(baseDir, path.join(dir, entry.name)));
      }
    }
  }
  return files;
}

function computeSha256(filePath: string): string {
  const data = fs.readFileSync(path.join(ROOT_DIR, filePath));
  return crypto.createHash('sha256').update(data).digest('hex');
}

async function packageDeliverable() {
  console.log('Packaging Sheffield Connect Deliverable (PME Ref 100113345)...');

  // Step 1: Scan files & compute hashes
  const files = getFiles(ROOT_DIR).sort();
  const integrity: Record<string, string> = {};

  for (const file of files) {
    if (file !== 'docs/BUILD_MANIFEST.json') {
      integrity[file] = computeSha256(file);
    }
  }

  // Step 2: Write updated BUILD_MANIFEST.json
  const manifest = {
    name: 'Sheffield Connect: Opportunity-Specific Demonstration',
    reference: '100113345',
    version: '1.0.0',
    framework: 'React 18 + Vite 5 + TypeScript 5 (Single-Tenant Local Demonstration)',
    runtime: 'Node.js 22.x',
    port: 3000,
    test_suite: 'Automated Regression Suite (scripts/run_automated_tests.ts)',
    included_file_count: files.length,
    integrity,
    provenance: 'Authoritative opportunity demonstrator authored for Sheffield City Council PME 100113345 by PayrollCloud Limited. Contains self-contained synthetic datasets; mock integrations with contract verification; non-statutory explainable payroll engine; no third-party proprietary Oracle Cloud tenant required for sandbox evaluation.'
  };

  const manifestPath = path.join(ROOT_DIR, 'docs/BUILD_MANIFEST.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  integrity['docs/BUILD_MANIFEST.json'] = computeSha256('docs/BUILD_MANIFEST.json');
  console.log(`Updated docs/BUILD_MANIFEST.json with ${Object.keys(integrity).length} file integrity checksums.`);

  // Step 3: Create ZIP archive
  if (fs.existsSync(OUTPUT_ZIP)) {
    fs.unlinkSync(OUTPUT_ZIP);
  }

  const output = fs.createWriteStream(OUTPUT_ZIP);
  const archive = new archiverRaw.ZipArchive({ zlib: { level: 9 } });

  return new Promise<void>((resolve, reject) => {
    output.on('close', () => {
      const sizeMb = (archive.pointer() / 1024 / 1024).toFixed(2);
      console.log(`\n================================================================`);
      console.log(`✓ Package Generated: ${path.basename(OUTPUT_ZIP)}`);
      console.log(`  Total Compressed Size: ${sizeMb} MB (${archive.pointer()} bytes)`);
      console.log(`  Archived Files Count: ${files.length} verified files`);
      console.log(`================================================================\n`);
      resolve();
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    for (const file of files) {
      archive.file(path.join(ROOT_DIR, file), { name: file });
    }

    archive.finalize();
  });
}

packageDeliverable().catch((err) => {
  console.error('Packaging failed:', err);
  process.exit(1);
});
