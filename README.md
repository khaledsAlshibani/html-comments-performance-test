<h1>HTML Comments Performance Test</h1>

> This project was born out of curiosity about the performance impact of HTML comments. While I initially hypothesized that only extremely large comments would affect performance, I wanted to validate this assumption through systematic testing. Despite searching for reliable information on this topic, I found no clear, evidence-based answers. **Interestingly, browser Lighthouse DevTools consistently reports a 100% performance score for all test files in this repository, regardless of comment size or presence.** You can examine these test files [here](./src/test-files/). This project tries to better understanding of how HTML comments might influence page performance under various conditions.

---

> ⚠️ **Warning**: Test results appear to be unrealistic, inaccurate, and logically inconsistent. They diverge significantly from browser Lighthouse DevTools tests and lack coherence. The findings seem awkward and counterintuitive. Further investigation and refinement of the testing methodology are necessary to obtain reliable and meaningful results.

- [What it Tests](#what-it-tests)
- [Key Findings](#key-findings)
- [Analysis Methodology](#analysis-methodology)
  - [Test Files](#test-files)
  - [Tools Used](#tools-used)
  - [Metrics Collected](#metrics-collected)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running Tests](#running-tests)
  - [Output](#output)
  - [Troubleshooting](#troubleshooting)
    - [Port 8080 is in Use](#port-8080-is-in-use)
- [Development](#development)
  - [Configuration Options](#configuration-options)
    - [Test Files](#test-files-1)
    - [Device Configurations](#device-configurations)
      - [Desktop Settings](#desktop-settings)
      - [Mobile Settings](#mobile-settings)
    - [Chrome Launch Options](#chrome-launch-options)
    - [Server Configuration](#server-configuration)
- [License](#license)

## What it Tests

The project evaluates the performance impact of HTML comments by comparing four different scenarios:

- Pages with extensive comments (`with-huge-comments.html`)
- Pages with moderate comments (`with-medium-comments.html`)
- Pages with typical comments (`with-normal-comments.html`)
- Pages without comments (`without-comments.html`)

Each test page contains identical content and structure, differing only in the amount and size of HTML comments.

## Key Findings

For detailed findings, check the latest [performance report](report/__generated__/performance-report.md) after running the tests.

## Analysis Methodology

### Test Files

The test files are located in `src/test-files/` and include:

- `with-huge-comments.html`: Contains extensive documentation and large comment blocks
- `with-medium-comments.html`: Contains moderate amount of comments
- `with-normal-comments.html`: Contains typical documentation comments
- `without-comments.html`: Contains no comments

### Tools Used

- [Lighthouse](https://github.com/GoogleChrome/lighthouse): For performance metrics collection
- Chrome: Headless browser for testing
- Node.js HTTP Server: For serving test files locally

### Metrics Collected

- **Performance Score**: Overall Lighthouse performance score (0-100)
- **First Contentful Paint (FCP)**: Time when the first content appears
- **Largest Contentful Paint (LCP)**: Time when the largest content element becomes visible
- **Total Blocking Time (TBT)**: Sum of all time periods where the main thread was blocked
- **Speed Index**: How quickly the page contents are visually populated
- **Time to Interactive (TTI)**: Time until the page becomes fully interactive

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 10.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/khaledsAlshibani/html-comments-performance-test.git
cd html-comments-performance-test

# Install dependencies
pnpm install

# Create environment file from example
cp .env.example .env
```

### Configuration

The project uses environment variables for configuration. These are stored in a `.env` file:

| Variable | Description                     | Default |
| -------- | ------------------------------- | ------- |
| `PORT`   | Port number for the test server | 8080    |

You can modify these values in your `.env` file to match your environment.

### Running Tests

```bash
# Start local server & run performance analysis
pnpm test
```

The test suite:

1. Starts a local server on port 8080
2. Runs Lighthouse tests against each test file
3. Generates performance reports and metrics

### Output

Results are generated in two directories:

- `report/__generated__/`: Contains the main performance report (`performance-report.md`)
- `src/__generated__/`: Contains individual JSON results for each test

### Troubleshooting

#### Port 8080 is in Use

If you get this error:

```
Error: listen EADDRINUSE: address already in use 0.0.0.0:8080
```

Solutions:

1. Find and kill the process using port 8080:
   ```bash
   # Windows
   netstat -ano | findstr :8080
   taskkill /F /PID <ID> # Replace <ID> with the process ID
   ```
2. Or modify the port in `src/script/analyze-performance.mjs` and in `package.json` for the `serve` script.

## Development

### Configuration Options

All test configurations are located in `src/config/test-config.mjs`. Here are the main configuration options you can modify:

#### Test Files

```javascript
FILES_TO_TEST = [
  "with-huge-comments.html",
  "with-medium-comments.html",
  "with-normal-comments.html",
  "without-comments.html",
];
```

#### Device Configurations

The test runs on both desktop and mobile configurations:

##### Desktop Settings

- Viewport: 1350x940
- No throttling
- Desktop user agent
- No CPU throttling

##### Mobile Settings

- Viewport: 360x640
- Fast 4G throttling
- Mobile user agent (Pixel 5)
- 4x CPU throttling

#### Chrome Launch Options

You can modify Chrome flags for testing in the `CHROME_FLAGS` array:

```javascript
CHROME_FLAGS = [
  "--headless",
  "--disable-extensions",
  "--disable-gpu",
  // ... other flags
];
```

#### Server Configuration

```javascript
SERVER_CONFIG = {
  maxAttempts: 10, // Maximum attempts to connect to server
  delayMs: 1000, // Delay between connection attempts
};
```

To modify any of these settings, edit the configuration file at `src/config/test-config.mjs`. Make sure to test thoroughly after changing configurations as they may affect the test results.

## License

MIT
