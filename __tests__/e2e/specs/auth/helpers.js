import { expect } from '@playwright/test';

import { SELECTORS } from '../../utils/selectots';
import { attachThumb } from '../../utils/helpers';

const {
  UI_SERVER,
  AUTH_LOGIN,
  AUTH_PASSWORD
} = process.env;

const baseUrl = `${UI_SERVER}`;

/**
 * @async
 * @param page
 * @param testInfo
 * @return {Promise<void>}
 */
const expectForm = async ({ page, testInfo }) => {
  const loginForm = page.locator(SELECTORS.loginForm);
  await expect(loginForm).toBeVisible();

  await attachThumb({ locator: loginForm, testInfo, name: 'form' });
};

/**
 * @export
 * @async
 * @param page
 * @param testInfo
 * @return {Promise<void>}
 */
export const pressToLogin = async ({ page, testInfo }) => {
  const signIn = page.locator(SELECTORS.headerSignIn);
  await expect(signIn).toBeVisible();

  await signIn.click();
  await page.waitForURL(`${baseUrl}/login`);

  await expectForm({ page, testInfo });
};

/**
 * @export
 * @async
 * @param page
 * @param testInfo
 * @return {Promise<void>}
 */
export const navigateToLogin = async ({ page, testInfo }) => {
  await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
  await page.waitForURL(`${baseUrl}/login`);

  await expectForm({ page, testInfo });
};

/**
 * @export
 * @async
 * @param page
 * @param testInfo
 * @param {{login: string, password: string}} [credentials]
 * @param {boolean} [negative]
 * @return {Promise<void>}
 */
export const doLogin = async ({ page, credentials, negative = false, testInfo }) => {
  const _username = page.locator(SELECTORS.loginFormUser);
  const _password = page.locator(SELECTORS.loginFormPassword);
  const _submit = page.getByRole('button', { name: 'Sign in' });

  await expect(_username).toBeDefined();
  await expect(_password).toBeDefined();
  await expect(_submit).toBeDefined();

  await _username.fill(credentials?.login ?? AUTH_LOGIN);
  await _password.fill(credentials?.password ?? AUTH_PASSWORD);

  await attachThumb({ locator: page, testInfo, name: 'credentials' });

  await _submit.click();

  if (negative) {
    // Handle error.
    const _error = page.locator(SELECTORS.loginFormError);

    await expect(_error).toBeDefined();
    await expect(_error).toBeVisible();
    await expect(_error).toContainText('Error: auth/user-not-found');

    await attachThumb({ locator: page, testInfo, name: 'user-not-found' });

  } else {

  }
};