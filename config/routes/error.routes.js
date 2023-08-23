/**
 * @export
 * @param {string} [path]
 * @param {string} [page]
 * @param {string} [errorPath]
 * @returns {[]}
 */
const ERRORS = (path = '', page = '/landing/errors', errorPath = '/errors') => [
  {
    component: `@/pages${page}/warning`,
    breadcrumb: 'route.pageWarning',
    path: `${path}${errorPath}/warning`
  },
  {
    component: `@/pages${page}/500`,
    breadcrumb: 'route.page500',
    path: `${path}${errorPath}/500`
  },
  {
    component: `@/pages${page}/403`,
    breadcrumb: 'route.page403',
    path: `${path}${errorPath}/403`
  },
  {
    component: `@/pages${page}/404`,
    breadcrumb: 'route.page404',
    path: `${path}${errorPath}/404`
  },
  {
    component: `@/pages${page}/404`,
    breadcrumb: 'route.page404',
    path: `*`
  }
];

module.exports = { ERRORS };
