import path from 'node:path';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const coreDir = path.join(process.cwd(), 'node_modules', 'venky-core');
const distMarker = path.join(coreDir, 'dist', 'venky-exports', 'core', 'ui', 'index.js');

function ensureCoreBuilt() {
  if (!fs.existsSync(coreDir)) {
    console.warn('⚠ venky-core not installed — skipping build');
    return;
  }

  if (fs.existsSync(distMarker)) {
    return;
  }

  console.info('Building venky-core (dist not in package — required for GitHub installs)...');
  const buildEnv = { ...process.env, NODE_ENV: 'development', npm_config_production: 'false' };
  execSync('npm install --include=dev', { cwd: coreDir, stdio: 'inherit', env: buildEnv });
  execSync('pnpm build', { cwd: coreDir, stdio: 'inherit', env: buildEnv });
}

async function copyMigrationsFromCore() {
  const targetDir = path.join(process.cwd(), 'migrations');
  const coreMigrationsDir = path.join(coreDir, 'migrations');

  if (!fs.existsSync(coreMigrationsDir)) {
    console.warn('⚠ Skipping migration copy: venky-core migrations directory not found');
    return { copied: [], skipped: [], errors: [] };
  }

  const copied = [];
  const skipped = [];
  const errors = [];

  await fs.promises.mkdir(targetDir, { recursive: true });

  const files = (await fs.promises.readdir(coreMigrationsDir)).filter(
    (file) => !file.startsWith('.') && file.endsWith('.sql'),
  );

  for (const file of files) {
    const sourcePath = path.join(coreMigrationsDir, file);
    const targetPath = path.join(targetDir, file);

    try {
      if (fs.existsSync(targetPath)) {
        skipped.push(file);
        continue;
      }

      await fs.promises.copyFile(sourcePath, targetPath);
      copied.push(file);
    } catch (error) {
      errors.push(`${file}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return { copied, skipped, errors };
}

try {
  ensureCoreBuilt();
  const result = await copyMigrationsFromCore();

  if (result.copied.length > 0) {
    console.info(`✔ Copied ${result.copied.length} migrations`);
  }
  if (result.errors.length > 0) {
    console.error('✖ Errors copying migrations:', result.errors);
    process.exit(1);
  }
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('✖ postinstall failed:', errorMessage);
  process.exit(1);
}
