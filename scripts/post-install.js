import path from 'node:path';
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const coreDir = path.join(process.cwd(), 'node_modules', 'venky-core');
const distMarker = path.join(coreDir, 'dist', 'venky-exports', 'core', 'ui', 'index.js');

function copyDirRecursive(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function findCachedDistDir() {
  const pnpmDir = path.join(process.cwd(), 'node_modules', '.pnpm');
  if (!fs.existsSync(pnpmDir)) {
    return null;
  }

  for (const entry of fs.readdirSync(pnpmDir)) {
    if (!entry.startsWith('venky-core@')) {
      continue;
    }
    const candidate = path.join(
      pnpmDir,
      entry,
      'node_modules',
      'venky-core',
      'dist',
      'venky-exports',
      'core',
      'ui',
      'index.js',
    );
    if (fs.existsSync(candidate)) {
      return path.join(pnpmDir, entry, 'node_modules', 'venky-core', 'dist');
    }
  }

  return null;
}

function ensureCoreBuilt() {
  if (!fs.existsSync(coreDir)) {
    console.warn('⚠ venky-core not installed — skipping build');
    return;
  }

  if (fs.existsSync(distMarker)) {
    return;
  }

  const cachedDistDir = findCachedDistDir();
  if (cachedDistDir) {
    console.info('Restoring venky-core dist from pnpm cache...');
    copyDirRecursive(cachedDistDir, path.join(coreDir, 'dist'));
    return;
  }

  const buildConfig = path.join(coreDir, 'tsconfig.build.json');
  if (fs.existsSync(buildConfig)) {
    console.info('Building venky-core (dist not bundled — first install may take a few minutes)...');
    const buildEnv = { ...process.env, NODE_ENV: 'development', npm_config_production: 'false' };
    execSync('npm install --include=dev --legacy-peer-deps', { cwd: coreDir, stdio: 'inherit', env: buildEnv });
    execSync('pnpm build', { cwd: coreDir, stdio: 'inherit', env: buildEnv });
    if (fs.existsSync(distMarker)) {
      return;
    }
  }

  throw new Error(
    'venky-core dist is missing. Upgrade to venky-core v0.4.4+ (includes pre-built dist), ' +
      'or avoid `pnpm clean` / full node_modules deletes that wipe the pnpm dist cache.',
  );
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
