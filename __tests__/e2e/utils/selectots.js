export const SELECTORS = {
  landing: '#root > div[class^="landing"]',
  page404: 'div[class*="page404"]',
  headerSignIn: 'div[class^="actions"] div[class^="auth"] a',
  loginForm: 'form#landing_login',
  loginFormUser: 'input#landing_login_email',
  loginFormPassword: 'input#landing_login_password',
  loginFormError: 'div.ant-modal-wrap[class*="error"]'
};