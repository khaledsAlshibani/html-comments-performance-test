/**
 * This script runs the server and performs the performance analysis.
 * It starts the server using `pnpm serve`, waits for the server to start,
 * and then performs the analysis using `pnpm analyze`.
 */

import { spawn } from 'child_process';
import waitOn from 'wait-on';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../../.env') });

const PORT = process.env.PORT || 8080;

async function runTests() {
  // Start the server
  const server = spawn('pnpm', ['serve'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env },
  });

  try {
    // Wait for the server to be ready
    await waitOn({
      resources: [`http://localhost:${PORT}`],
      timeout: 10000,
    });

    // Run the analysis
    const analyze = spawn('pnpm', ['analyze'], {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env },
    });

    // Wait for analysis to complete
    await new Promise((resolve, reject) => {
      analyze.on('close', code => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Analysis failed with code ${code}`));
        }
      });
    });
  } catch (error) {
    console.error('Error during test execution:', error);
  } finally {
    // Kill the server process and any child processes
    if (process.platform === 'win32') {
      spawn('taskkill', ['/F', '/T', '/PID', server.pid], { shell: true });
    } else {
      server.kill('SIGTERM');
    }
    process.exit(0);
  }
}

runTests();
