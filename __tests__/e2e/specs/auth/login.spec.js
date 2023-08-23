const { test } = require('@playwright/test');

const {
  pressToLogin,
  navigateToLogin,
  doLogin
} = require('./helpers');

const {
  UI_SERVER,
  DEBUG_UI
} = process.env;

test.describe('Login suite', () => {
  const baseUrl = `${UI_SERVER}`;

  test(`Navigate to: ${baseUrl}`, async ({ page }, testInfo) => {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForURL(baseUrl);

    await pressToLogin({ page, testInfo });
  });

  test(`Fill login form`, async ({ page }, testInfo) => {
    await navigateToLogin({ page, testInfo });
    await doLogin({
      page,
      credentials: {
        login: 'login@email.com',
        password: 'password'
      },
      negative: true,
      testInfo
    });
  });
});
