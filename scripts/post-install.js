import path from 'node:path';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const siblingCoreDir = path.resolve(process.cwd(), '../venky-core');
const installedCoreDir = path.join(process.cwd(), 'node_modules', 'venky-core');

function resolveCoreDir() {
  if (!fs.existsSync(installedCoreDir)) {
    return null;
  }
  try {
    if (fs.existsSync(path.join(siblingCoreDir, 'package.json'))) {
      const installedReal = fs.realpathSync(installedCoreDir);
      const siblingReal = fs.realpathSync(siblingCoreDir);
      if (installedReal === siblingReal) {
        return siblingCoreDir;
      }
    }
  } catch {
    // fall through
  }
  return installedCoreDir;
}

function distMarker(coreDir) {
  return path.join(coreDir, 'dist', 'venky-exports', 'core', 'ui', 'index.js');
}

function copyDist(fromCore, toCore) {
  const fromDist = path.join(fromCore, 'dist');
  const toDist = path.join(toCore, 'dist');
  fs.rmSync(toDist, { recursive: true, force: true });
  fs.cpSync(fromDist, toDist, { recursive: true });
}

function ensureCoreBuilt() {
  const coreDir = resolveCoreDir();
  if (!coreDir) {
    console.warn('⚠ venky-core not installed — skipping build');
    return;
  }

  if (fs.existsSync(distMarker(coreDir))) {
    return;
  }

  const siblingHasDevDeps = fs.existsSync(path.join(siblingCoreDir, 'node_modules', 'rimraf'));

  if (siblingHasDevDeps) {
    console.info('Building venky-core from sibling checkout...');
    execSync('pnpm build', { cwd: siblingCoreDir, stdio: 'inherit' });
    if (coreDir !== siblingCoreDir && fs.existsSync(distMarker(siblingCoreDir))) {
      copyDist(siblingCoreDir, coreDir);
    }
    return;
  }

  console.info('Building venky-core in node_modules (GitHub install — installing dev deps first)...');
  const buildEnv = { ...process.env, NODE_ENV: 'development', npm_config_production: 'false' };
  execSync('npm install --include=dev', { cwd: coreDir, stdio: 'inherit', env: buildEnv });
  execSync('pnpm build', { cwd: coreDir, stdio: 'inherit', env: buildEnv });
}

async function copyMigrationsFromCore() {
  const coreDir = resolveCoreDir() ?? installedCoreDir;
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
