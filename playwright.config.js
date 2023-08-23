// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const { resolve } = require('path');
const fs = require('fs');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require('dotenv').config();

const { REPORT_FOLDER, CICD } = process.env;

const ts = REPORT_FOLDER ?? +new Date;
const testDir = resolve(__dirname, '__tests__/e2e');
const reportDir = resolve(__dirname, '__report__');
const outputFolder = `${reportDir}/e2e/${ts}`;

/**
 * @description Move old reports to archive.
 * @constant
 * @return {boolean}
 */
const handleLogsRotation = () => {
  const _path = `${reportDir}/e2e`;
  const _archive = `${reportDir}/e2e/archive`;

  // Prevent log rotation on GitHub.
  if (CICD === '1') return false;

  if (_path.match(/archive/)) return false;

  if (!fs.existsSync(_archive)) {
    fs.mkdirSync(_archive);
  }

  fs.readdirSync(_path).forEach(folder => {
    if (folder.match(/archive/)) return false;
    let _ts = '';

    if (folder === REPORT_FOLDER) {
      _ts = `-${+new Date}`;
    }

    fs.rename(`${_path}/${folder}`, `${_archive}/${folder}${_ts}`, (err) => {
      if (err) throw err;
      console.log(`Successfully moved: ${_archive}/${folder}`);
    });
  });
};

handleLogsRotation();

global.sPath = `${outputFolder}/screenshots`;

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: `${testDir}/specs`,
  outputDir: `${outputFolder}/errors`,
  // snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['html', { outputFolder: `${outputFolder}/html` }],
    ['junit', { outputFile: `${outputFolder}/logs/junit/results.xml` }],
    ['json', { outputFile: `${outputFolder}/logs/json/test-results.json` }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    ignoreHTTPSErrors: true,
    bypassCSP: true,
    screenshot: 'only-on-failure',
    timeout: 10 * 60 * 1000
    // proxy: {
    //   server: 'http://genproxy:8080'
    // }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // headless: false,
        launchOptions: {
          // prefs: {
          //   credentials_enable_service: false,
          //   profile: {
          //     password_manager_enabled: false
          //   },
          //   download: {
          //     prompt_for_download: false,
          //     directory_upgrade: true,
          //     default_directory: path.join(__dirname, 'downloads')
          //   }
          // },
          args: [
            // Authentication Popups: https://www.lambdatest.com/blog/handle-alerts-popups-in-selenium-protractor/
            // The key usage of authentication popups is to authenticate user access. These popups are generally observed in password-protected pages and consist of a username and password dialogue boxes.
            // An authentication popup can be identified by the following characteristics:
            // - The elements of the authentication pop-up overlay cannot be inspected by the user.
            // - This pop-up is displayed on the occurrence of the loading of the web-page.
            // - The page can only be accessed through the input of valid credentials.
            // - The pop-up may or may not be movable as per the browser configuration.
            // - The UI of the pop-up is highly customizable.
            // - The solution to handle this type of alert in selenium is to enter valid credentials along with the URL. The syntax for password and username in authentication pop-ups are:
            //
            // driver.get(protocol://Usename:Password@URL Address);

            //'--incognito',

            // '--disable-cache',
            // '--disable-web-security',
            // '--disable-application-cache',
            // '--disable-offline-load-stale-cache',
            // '--disk-cache-size=0',
            // '--v8-cache-options=off',
            // '--no-sandbox',
            // '--test-type=browser',
            // Without a remote debugging port, Google Chrome exits immediately.
            // '--remote-debugging-port=9222',
            // '--test-type',
            // '--disable-web-security',
            '--allow-insecure-localhost',
            '--ignore-certificate-errors'
            // '--proxy-server=http://genproxy:8080'
            // '--disable-machine-cert-request',
            // '--ignore-certificate-errors-spki-list',
            // '--ignore-urlfetcher-cert-requests'
            // '--allow-running-insecure-content',
            // '--disable-proxy-certificate-handler',
            // '--disable-content-security-policy',
            // '--ignore-certificate-errors-spki-list=jc7r1tE54FOO=',
            // '--log-path=chromedriver.log'
          ]
        }
      }
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ]

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

