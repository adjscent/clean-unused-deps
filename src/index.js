import depcheck from 'depcheck';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * Detect the package manager based on npm_config_user_agent or lockfiles
 * @param {string} cwd - Current working directory
 * @returns {string} - The detected package manager ('pnpm', 'bun', or 'npm')
 */
export function detectPackageManager(cwd = process.cwd()) {
  // First, check npm_config_user_agent environment variable
  const userAgent = process.env.npm_config_user_agent;
  if (userAgent) {
    if (userAgent.startsWith('pnpm/')) {
      return 'pnpm';
    }
    if (userAgent.startsWith('bun/')) {
      return 'bun';
    }
    if (userAgent.startsWith('npm/')) {
      return 'npm';
    }
  }

  // Fallback: check lockfiles
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (existsSync(join(cwd, 'bun.lockb')) || existsSync(join(cwd, 'bun.lock'))) {
    return 'bun';
  }
  if (existsSync(join(cwd, 'package-lock.json'))) {
    return 'npm';
  }

  // Default to npm if nothing detected
  return 'npm';
}

/**
 * Get the uninstall command for a package manager
 * @param {string} packageManager - The package manager name
 * @returns {string} - The uninstall command
 */
export function getUninstallCommand(packageManager) {
  switch (packageManager) {
    case 'pnpm':
      return 'pnpm remove';
    case 'bun':
      return 'bun remove';
    case 'npm':
    default:
      return 'npm uninstall';
  }
}

/**
 * Find unused dependencies using depcheck
 * @param {string} cwd - Current working directory
 * @returns {Promise<string[]>} - Array of unused dependency names
 */
export async function findUnusedDeps(cwd = process.cwd()) {
  const options = {
    ignoreBinPackage: false,
    skipMissing: false,
  };

  const result = await depcheck(cwd, options);
  return result.dependencies;
}

/**
 * Remove unused dependencies
 * @param {string[]} deps - Array of dependency names to remove
 * @param {string} packageManager - The package manager to use
 * @param {string} cwd - Current working directory
 */
export function removeUnusedDeps(deps, packageManager, cwd = process.cwd()) {
  if (deps.length === 0) {
    return;
  }

  const uninstallCmd = getUninstallCommand(packageManager);
  const command = `${uninstallCmd} ${deps.join(' ')}`;

  console.log(`Running: ${command}`);
  execSync(command, { cwd, stdio: 'inherit' });
}

/**
 * Main function to clean unused dependencies
 * @param {string} cwd - Current working directory
 */
export async function cleanUnusedDeps(cwd = process.cwd()) {
  const packageManager = detectPackageManager(cwd);
  console.log(`Detected package manager: ${packageManager}`);

  const unusedDeps = await findUnusedDeps(cwd);

  if (unusedDeps.length === 0) {
    console.log('No unused dependencies found.');
    return;
  }

  console.log(`Unused dependencies: ${unusedDeps.join(', ')}`);

  removeUnusedDeps(unusedDeps, packageManager, cwd);

  console.log('Unused dependencies removed successfully.');
}
