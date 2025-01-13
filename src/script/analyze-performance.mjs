/**
 * This script analyzes the performance of HTML pages with and without comments.
 * It uses Lighthouse to measure performance metrics and Chrome to run the tests.
 * The result report is saved in `report/__generated__/performance-report.md`.
 */

import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import {
  PORT,
  BASE_URL,
  FILES_TO_TEST,
  LIGHTHOUSE_CONFIGS,
  CHROME_FLAGS,
  SERVER_CONFIG,
} from '../config/test-config.mjs';

const CONFIGS = LIGHTHOUSE_CONFIGS;

/**
 * Calculates the median of an array of numbers.
 * @param {number[]} numbers - The array of numbers.
 * @returns {number} The median value.
 */
function median(numbers) {
  const sorted = numbers.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

/**
 * Runs Lighthouse on a given URL with specified configuration.
 * @param {string} url - The URL to test.
 * @param {Object} config - The Lighthouse configuration.
 * @returns {Promise<Object>} The Lighthouse report.
 */
async function runLighthouse(url, config) {
  const chrome = await chromeLauncher.launch({
    chromeFlags: CHROME_FLAGS,
  });

  const options = {
    logLevel: 'info',
    output: 'json',
    port: chrome.port,
    ...config,
  };

  try {
    const NUM_RUNS = 3;
    const results = [];

    for (let i = 0; i < NUM_RUNS; i++) {
      console.log(chalk.cyan(`  Run ${i + 1}/${NUM_RUNS}`));
      const result = await lighthouse(url, options);
      results.push(result.lhr);

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await chrome.kill();

    return {
      categories: {
        performance: {
          score: median(results.map(r => r.categories.performance.score)),
        },
      },
      audits: {
        'first-contentful-paint': {
          numericValue: median(results.map(r => r.audits['first-contentful-paint'].numericValue)),
        },
        'largest-contentful-paint': {
          numericValue: median(results.map(r => r.audits['largest-contentful-paint'].numericValue)),
        },
        'total-blocking-time': {
          numericValue: median(results.map(r => r.audits['total-blocking-time'].numericValue)),
        },
        'speed-index': {
          numericValue: median(results.map(r => r.audits['speed-index'].numericValue)),
        },
        interactive: {
          numericValue: median(results.map(r => r.audits['interactive'].numericValue)),
        },
      },
    };
  } catch (error) {
    await chrome.kill();
    throw error;
  }
}

/**
 * Generates a markdown report from Lighthouse results.
 * @param {Object} results - The Lighthouse results.
 * @returns {string} The markdown report.
 */
async function generateMarkdownReport(results) {
  const date = new Date().toISOString().split('T')[0];
  const time = new Date().toTimeString().split(' ')[0];

  let markdown = `# HTML Comments Performance Test Results
> Generated on ${date} at ${time}

This report compares the performance metrics of HTML pages with varying amounts of comments across desktop and mobile devices.

`;

  for (const device of ['Desktop', 'Mobile']) {
    markdown += `## ${device} Performance Comparison

| File | Performance Score | FCP (ms) | LCP (ms) | TBT (ms) | Speed Index | TTI (ms) |
|------|------------------|-----------|-----------|-----------|-------------|-----------|
`;

    for (const [file, metrics] of Object.entries(results[device.toLowerCase()])) {
      markdown += `| ${file} | ${metrics.performance.toFixed(1)}% | ${metrics.firstContentfulPaint.toFixed(0)} | ${metrics.largestContentfulPaint.toFixed(0)} | ${metrics.totalBlockingTime.toFixed(0)} | ${metrics.speedIndex.toFixed(0)} | ${metrics.timeToInteractive.toFixed(0)} |\n`;
    }
    markdown += '\n';
  }

  markdown += `## Metrics Explanation
- **Performance Score**: Overall Lighthouse performance score (0-100)
- **FCP (First Contentful Paint)**: Time when the first content appears
- **LCP (Largest Contentful Paint)**: Time when the largest content element becomes visible
- **TBT (Total Blocking Time)**: Sum of all time periods where the main thread was blocked
- **Speed Index**: How quickly the page contents are visually populated
- **TTI (Time to Interactive)**: Time until the page becomes fully interactive

## Analysis

The results show the impact of HTML comments on page performance across different scenarios and devices:
- \`with-huge-comments.html\`: Page with extensive comments
- \`with-medium-comments.html\`: Page with moderate amount of comments
- \`with-normal-comments.html\`: Page with typical amount of comments
- \`without-comments.html\`: Page with no comments

### Testing Conditions
- **Desktop**: 1350x940 viewport, no throttling
- **Mobile**: 360x640 viewport with mobile emulation, 4G throttling

Lower values indicate better performance for all metrics except Performance Score.`;

  return markdown;
}

/**
 * Runs Lighthouse on all test URLs and generates a markdown report.
 * @returns {Promise<void>}
 */
async function analyzeAll() {
  console.clear();
  console.log(chalk.cyan('\n🚀 Starting performance analysis...'));

  await fs.mkdir(path.join(process.cwd(), 'src', '__generated__'), { recursive: true });
  await fs.mkdir(path.join(process.cwd(), 'report', '__generated__'), { recursive: true });

  const results = {
    desktop: {},
    mobile: {},
  };

  for (const [deviceType, deviceConfig] of Object.entries(CONFIGS)) {
    console.log(chalk.yellow(`\n📱 Testing ${deviceConfig.name} configuration:`));

    for (const [index, file] of FILES_TO_TEST.entries()) {
      console.clear();
      const progress = `[${index + 1}/${FILES_TO_TEST.length}]`;
      console.log(chalk.cyan(`\n🚀 Performance Analysis in Progress - ${deviceConfig.name}`));
      console.log(chalk.blue(`\n📄 ${progress} Analyzing ${file}...`));
      const url = `${BASE_URL}/${file}`;

      const result = await runLighthouse(url, deviceConfig.config);

      results[deviceType][file] = {
        performance: result.categories.performance.score * 100,
        firstContentfulPaint: result.audits['first-contentful-paint'].numericValue,
        largestContentfulPaint: result.audits['largest-contentful-paint'].numericValue,
        totalBlockingTime: result.audits['total-blocking-time'].numericValue,
        speedIndex: result.audits['speed-index'].numericValue,
        timeToInteractive: result.audits['interactive'].numericValue,
      };

      console.log(chalk.green(`\n✨ Results for ${file}:`));
      console.log(
        chalk.cyan(`   Performance Score: ${results[deviceType][file].performance.toFixed(1)}%`)
      );

      await fs.writeFile(
        path.join(
          process.cwd(),
          'src',
          '__generated__',
          `${deviceType}-${file.replace('.html', '')}-results.json`
        ),
        JSON.stringify(results[deviceType][file], null, 2)
      );
    }
  }

  const markdownReport = await generateMarkdownReport(results);
  await fs.writeFile(
    path.join(process.cwd(), 'report', '__generated__', 'performance-report.md'),
    markdownReport
  );

  console.clear();
  console.log(chalk.green('\n✨ Analysis complete! Results have been saved.'));
  console.log(
    chalk.cyan(
      `📊 See the final report in ${chalk.underline('report/__generated__/performance-report.md')}`
    )
  );
}

/**
 * Waits for the server to start.
 * @param {string} url - The URL to wait for.
 * @param {number} [maxAttempts=SERVER_CONFIG.maxAttempts] - The maximum number of attempts.
 * @param {number} [delayMs=SERVER_CONFIG.delayMs] - The delay between attempts in milliseconds.
 * @returns {Promise<boolean>} True if the server started, false otherwise.
 */
async function waitForServer(
  url,
  maxAttempts = SERVER_CONFIG.maxAttempts,
  delayMs = SERVER_CONFIG.delayMs
) {
  console.log(chalk.yellow('\n⏳ Waiting for server to start...'));

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log(chalk.green('✅ Server is ready!'));
        return true;
      }
    } catch (error) {
      if (attempt === maxAttempts) {
        console.error(chalk.red(`❌ Server failed to start after ${maxAttempts} attempts`));
        return false;
      }
      console.log(
        chalk.yellow(`⏳ Attempt ${attempt}/${maxAttempts} - Retrying in ${delayMs}ms...`)
      );
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  return false;
}

// Check if server is running
try {
  const serverReady = await waitForServer(BASE_URL);
  if (!serverReady) {
    console.error(
      chalk.red('❌ Failed to connect to server. Please ensure the server is running on port 8080')
    );
    process.exit(1);
  }
  await analyzeAll();
} catch (error) {
  console.error(chalk.red('❌ Error during analysis:'), error);
  process.exit(1);
}