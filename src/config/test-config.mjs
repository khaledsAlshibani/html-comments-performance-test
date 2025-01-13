/**
 * This file handles configuration for the test in the script `./src/script/analyze-performance.mjs`.
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../../.env') });

export const PORT = process.env.PORT || 8080;
export const BASE_URL = `http://localhost:${PORT}/src/test-files`;

export const FILES_TO_TEST = [
  'with-huge-comments.html',
  'with-medium-comments.html',
  'with-normal-comments.html',
  'without-comments.html',
];

export const LIGHTHOUSE_CONFIGS = {
  desktop: {
    name: 'Desktop',
    config: {
      extends: 'lighthouse:default',
      settings: {
        formFactor: 'desktop',
        throttling: {
          rttMs: 0,
          throughputKbps: 0,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
        emulatedUserAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      },
    },
  },
  // mobile: {
  //   name: 'Mobile',
  //   config: {
  //     extends: 'lighthouse:default',
  //     settings: {
  //       formFactor: 'mobile',
  //       throttling: {
  //         rttMs: 150,
  //         throughputKbps: 1638.4,
  //         cpuSlowdownMultiplier: 4,
  //         requestLatencyMs: 150,
  //         downloadThroughputKbps: 1638.4,
  //         uploadThroughputKbps: 675,
  //       },
  //       screenEmulation: {
  //         mobile: true,
  //         width: 360,
  //         height: 640,
  //         deviceScaleFactor: 2.625,
  //         disabled: false,
  //       },
  //       emulatedUserAgent:
  //         'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36',
  //     },
  //   },
  // },
};

export const CHROME_FLAGS = [
  '--headless',
  '--disable-extensions', // Disable all extensions
  '--disable-component-extensions-with-background-pages',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding',
  '--disable-dev-shm-usage', // Disable /dev/shm usage
  '--no-sandbox', // Required for some CI environments
  '--disable-gpu', // Disable GPU hardware acceleration
  '--enable-precise-memory-info', // Enable more precise memory metrics
  '--no-default-browser-check', // Skip default browser check
  '--no-first-run', // Skip first run wizards
  '--deterministic-fetch', // Make network fetches deterministic
  '--incognito', // Use incognito mode for clean state
  '--disk-cache-size=0', // Disable disk cache
  '--media-cache-size=0', // Disable media cache
];

export const SERVER_CONFIG = {
  maxAttempts: 10, // Maximum number of attempts for server to start
  delayMs: 1000, // Delay between connection attempts in milliseconds
};
