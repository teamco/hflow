import React from 'react';
import { matchPath, withRouter } from 'umi';

/**
 * Combine paths.
 * @param {string} parent
 * @param {string} child
 * @returns {string}
 */
export const combinePaths = (parent = '', child = '') =>
    `${parent.replace(/\/$/, '')}/${child.replace(/^\//, '')}`;

/**
 * Recursively build paths for each navigation item.
 * @param routes
 * @param {string} parentPath
 * @returns {*}
 */
export const buildPaths = (routes, parentPath = '') =>
    routes.map(route => {
      const path = combinePaths(parentPath, route.path);

      return route.path ? {
        ...route,
        path,
        ...(route.routes && { routes: buildPaths(route.routes, path) })
      } : {
        ...route,
        ...(route.routes && { routes: buildPaths(route.routes, path) })
      };
    });

/**
 * Recursively provide parent reference for each navigation item.
 * @param routes
 * @param parentRoute
 * @returns {*}
 */
export const setupParents = (routes, parentRoute = null) =>
    routes.map(route => {
      const withParent = {
        ...route,
        ...(parentRoute && { parent: parentRoute })
      };

      return {
        ...withParent,
        ...(withParent.routes && {
          routes: setupParents(withParent.routes, withParent)
        })
      };
    });

/**
 * Convert navigation tree into flat array.
 * @param routes
 * @returns {any[]}
 */
export const flattenRoutes = routes =>
    routes.map(route => [route.routes ? flattenRoutes(route.routes) : [], route]).flat(Infinity);

/**
 * Combine all the above functions together.
 * @param routes
 * @returns {any[]}
 */
export const generateRoutes = routes => {
  const _routes = flattenRoutes(setupParents(buildPaths(routes)));
  return _routes.map(route => {
    const _matcher = /\/admin\/admin/;
    return route?.path?.match(_matcher) ? {
      ...route,
      path: route?.path?.replace(_matcher, '/admin')
    } : route;
  });
};

/**
 * Provides path from root to the element
 * @param route
 * @returns {any[]}
 */
export const pathTo = route => {
  if (!route.parent) {
    return [route];
  }

  return [...pathTo(route.parent), route];
};

/**
 * @constant
 * @type {{exact: boolean}}
 */
const DEFAULT_MATCH_OPTIONS = { exact: true };

/**
 * If user is passing a function (component) as a breadcrumb, make sure we
 * pass the match object into it. Else just return the string.
 * @param breadcrumb
 * @param match
 * @return {*}
 */
const renderer = ({ breadcrumb, match }) => {
  if (typeof breadcrumb === 'function') { return breadcrumb({ match }); }
  return breadcrumb;
};

/**
 * @export
 * @param routes
 * @param pathname
 * @return {{_isRouted: boolean, matches: *[]}}
 */
export const getBreadcrumbs = ({ routes, pathname }) => {
  const matches = [];
  let _isRouted = false;

  pathname
      // remove trailing slash "/" from pathname (avoids multiple of the same match)
      .replace(/\/$/, '')
      // split pathname into sections
      .split('/')
      // reduce over the sections and find matches from `routes` prop
      .reduce((previous, current) => {
        // combine the last route section with the current
        // ex `pathname = /1/2/3 results in match checks for
        // `/1`, `/1/2`, `/1/2/3`
        const pathSection = `${previous}/${current}`;

        let breadcrumbMatch;

        _isRouted = generateRoutes(routes).some((data = {}) => {
          const { breadcrumb, path, ...rest } = data;
          const matchOptions = rest.exact === 'boolean' ? { exact: rest.exact } : DEFAULT_MATCH_OPTIONS;
          const match = matchPath(pathSection, { ...matchOptions, path });

          // if a route match is found ^ break out of the loop with a rendered breadcrumb
          // and match object to add to the `matches` array
          if (match) {
            breadcrumbMatch = {
              breadcrumb: renderer({ breadcrumb, match }),
              path,
              match
            };
            return true;
          }

          return true;
        });

        breadcrumbMatch && matches.push(breadcrumbMatch);

        return pathSection;
      });

  return { matches, _isRouted };
};

/**
 * @export
 * @param routes
 * @return {function(*): *}
 */
export const withBreadcrumbs = routes => Component => withRouter(props => {

  /**
   * @constant
   * @type {{_isRouted: boolean, matches: *[]}}
   */
  const breadcrumbs = getBreadcrumbs({
    pathname: props.location.pathname,
    routes
  });

  return (<Component{...props}
                    is404={!breadcrumbs?._isRouted}
                    breadcrumbs={breadcrumbs?.matches}/>);
});
