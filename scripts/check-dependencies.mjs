import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const required = Object.keys(packageJson.dependencies ?? {});
const missing = [];

for (const dependency of required) {
  const packagePath = join(root, 'node_modules', dependency, 'package.json');
  if (!existsSync(packagePath)) {
    missing.push(dependency);
  }
}

if (missing.length > 0) {
  console.error(`Missing installed dependencies: ${missing.join(', ')}`);
  console.error('Run `npm install` after pulling the repository, then run the command again.');
  process.exit(1);
}

const bitsPackagePath = join(root, 'node_modules', 'bits-ui', 'package.json');
try {
  const bitsPackage = JSON.parse(readFileSync(bitsPackagePath, 'utf8'));
  if (bitsPackage.name !== 'bits-ui' || !bitsPackage.version) {
    throw new Error('invalid package metadata');
  }
} catch {
  console.error('The Bits UI package is not available in this checkout.');
  console.error('Run `npm install` after pulling the repository, then run the command again.');
  process.exit(1);
}

const registryPath = join(root, "src", "lib", "icons", "registry.ts");
if (!existsSync(registryPath)) {
  console.log("Generating Iconoir icon registry...");
  const { execSync } = await import("node:child_process");
  execSync("node scripts/generate-icons.mjs", { stdio: "inherit", cwd: root });
}

console.log("Dependency preflight passed.");
