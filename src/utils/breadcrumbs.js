/**
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * This script exports a hook that accepts a routes array of objects
 * and an options object.
 *
 * API:
 *
 * useBreadcrumbs(
 *   routes?: Array<Route>,
 *   options? Object<Options>,
 * ): Array<BreadcrumbData>
 *
 * More Info:
 *
 * https://github.com/icd2k3/use-react-router-breadcrumbs
 *
 */
import React, { createElement } from 'react';
import { matchPath, useLocation } from '@umijs/max';

const joinPaths = (paths) => paths.join('/').replace(/\/\/+/g, '/');

const paramRe = /^:\w+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = (s) => s === '*';

function computeScore(path, index) {
  const segments = path.split('/');
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }

  if (index) {
    initialScore += indexRouteValue;
  }

  return segments.filter((s) => !isSplat(s)).reduce((score, segment) => {
    if (paramRe.test(segment)) {
      return score + dynamicSegmentValue;
    }
    if (segment === '') {
      return score + emptySegmentValue;
    }
    return score + staticSegmentValue;
  }, initialScore);
}

function compareIndexes(a, b) {
  const siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
  return siblings ? a[a.length - 1] - b[b.length - 1] : 0;
}

function flattenRoutes(
    routes = [],
    branches = [],
    parentsMeta = [],
    parentPath = ''
) {
  routes.forEach((item, index) => {
    const route = item.path ? item : item.route;
    const meta = {
      relativePath: route?.path || '',
      childrenIndex: index,
      route
    };

    if (meta.relativePath.charAt(0) === '/') {
      if (!meta.relativePath.startsWith(parentPath)) {
        throw new Error('useBreadcrumbs: The absolute path of the child route must start with the parent path');
      }

      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }

    const path = joinPaths([parentPath, meta.relativePath]);
    const routesMeta = parentsMeta.concat(meta);

    if (item?.route?.children && item?.route?.children.length) {
      if (item?.route?.index) {
        throw new Error('useBreadcrumbs: Index route cannot have child routes');
      }
      flattenRoutes(item?.route?.children, branches, routesMeta, path);
    }

    branches.push({
      path,
      score: computeScore(path, item?.route?.index),
      routesMeta
    });
  });
  return branches;
}

function rankRouteBranches(branches) {
  return branches.sort((a, b) => (
      a.score !== b.score ?
          // Higher score first
          b.score - a.score :
          compareIndexes(
              a.routesMeta.map((meta) => meta.childrenIndex),
              b.routesMeta.map((meta) => meta.childrenIndex)
          )));
}

// Begin: useBreadcrumbs
const NO_BREADCRUMB = Symbol('NO_BREADCRUMB');

/**
 * Renders and returns the breadcrumb complete
 * with `match`, `location`, and `key` props.
 */
const render = ({ Breadcrumb, match, location, props = {} }) => {
  const componentProps = {
    match,
    location,
    key: match.pathname,
    ...props
  };

  return {
    ...componentProps,
    breadcrumb: typeof Breadcrumb === 'string' ? (
        createElement('span', { ...componentProps }, Breadcrumb)
    ) : (
        <Breadcrumb {...componentProps} />
    )
  };
};

/**
 * Small helper method to get a default breadcrumb if the user hasn't provided one.
 */
const getDefaultBreadcrumb = (props) => {
  const {
    currentSection,
    location,
    pathSection,
    defaultFormatter
  } = props;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const match = matchPath({
        end: true,
        path: pathSection
      },
      pathSection
  );

  return render({
    Breadcrumb: defaultFormatter ? defaultFormatter(currentSection) : currentSection,
    match,
    location
  });
};

/**
 * Loops through the route array (if provided) and returns either a
 * user-provided breadcrumb OR a sensible default (if enabled)
 */
const getBreadcrumbMatch = (props) => {
  const {
    currentSection,
    disableDefaults,
    defaultFormatter,
    excludePaths,
    location,
    pathSection,
    branches
  } = props;

  let breadcrumb;

  // Check the optional `excludePaths` option in `options` to see if the
  // current path should not include a breadcrumb.
  const getIsPathExcluded = (path) => matchPath({
        path,
        end: true
      },
      pathSection
  ) !== null;

  if (excludePaths && excludePaths.some(getIsPathExcluded)) {
    return NO_BREADCRUMB;
  }

  // Loop through the route array and see if the user has provided a custom breadcrumb.
  branches.some(({ path, routesMeta }) => {
    const { route = {} } = routesMeta[routesMeta.length - 1];
    let userProvidedBreadcrumb = route?.breadcrumb;

    // If the route is an index, but no breadcrumb is set,
    // We try to use the breadcrumbs of the parent route instead
    if (!userProvidedBreadcrumb && route?.index) {
      const parentMeta = routesMeta[routesMeta.length - 2];
      if (parentMeta && parentMeta.route.breadcrumb) {
        userProvidedBreadcrumb = parentMeta.route.breadcrumb;
      }
    }

    const { caseSensitive, props } = route;
    const match = matchPath({
          path,
          end: true,
          caseSensitive
        },
        pathSection
    );

    // If user passed breadcrumb: null
    // we need to know NOT to add it to the matches array
    // see: `if (breadcrumb !== NO_BREADCRUMB)` below.
    if (match && userProvidedBreadcrumb === null) {
      breadcrumb = NO_BREADCRUMB;
      return true;
    }

    if (match) {
      // This covers the case where a user may be extending their react-router route
      // config with breadcrumbs, but also does not want default breadcrumbs to be
      // automatically generated (opt-in).
      if (!userProvidedBreadcrumb && disableDefaults) {
        breadcrumb = NO_BREADCRUMB;
        return true;
      }

      if (!userProvidedBreadcrumb) {
        const idx = routesMeta[1]?.relativePath ? 1 : 0;
        userProvidedBreadcrumb = routesMeta[idx]?.route?.breadcrumb ||
            routesMeta[idx]?.route?.children[0]?.breadcrumb;
      }

      breadcrumb = render({
        // Although we have a match, the user may be passing their react-router config object
        // which we support. The route config object may not have a `breadcrumb` param specified.
        // If this is the case, we should provide a default via `humanize`.
        Breadcrumb: userProvidedBreadcrumb
            || (defaultFormatter ? defaultFormatter(currentSection) : currentSection),
        match: { ...match, route },
        location,
        props
      });

      return true;
    }

    return false;
  });

  // User provided a breadcrumb prop, or we generated one above.
  if (breadcrumb) {
    return breadcrumb;
  }

  // If there was no breadcrumb provided and user has disableDefaults turned on.
  if (disableDefaults) {
    return NO_BREADCRUMB;
  }

  // If the above conditionals don't fire, generate a default breadcrumb based on the path.
  return getDefaultBreadcrumb({
    pathSection,
    // include a "Home" breadcrumb by default (can be overrode or disabled in config).
    currentSection: pathSection === '/' ? 'Home' : currentSection,
    location,
    defaultFormatter
  });
};

/**
 * Splits the pathname into sections, then search for matches in the routes
 * a user-provided breadcrumb OR a sensible default.
 */
export const getBreadcrumbs = (props) => {
  const { routes, location, options = {} } = props;
  const { pathname } = location;

  const branches = rankRouteBranches(flattenRoutes(routes));
  const breadcrumbs = [];
  pathname.split('?')[0].split('/').reduce(
      (previousSection, currentSection, index) => {
        // Combine the last route section with the currentSection.
        // For example, `pathname = /1/2/3` results in match checks for
        // `/1`, `/1/2`, `/1/2/3`.
        const pathSection = currentSection ? `${previousSection}/${currentSection}` : '/';

        // Ignore trailing slash or double slashes in the URL
        if (pathSection === '/' && index !== 0) {
          return '';
        }

        const breadcrumb = getBreadcrumbMatch({
          currentSection,
          location,
          pathSection,
          branches,
          ...options
        });

        // Add the breadcrumb to the matches array
        // unless the user has explicitly passed.
        // { path: x, breadcrumb: null } to disable.
        if (breadcrumb !== NO_BREADCRUMB) {
          breadcrumbs.push(breadcrumb);
        }

        return pathSection === '/' ? '' : pathSection;
      },
      ''
  );

  return breadcrumbs;
};

/**
 * Default hook function export.
 */
const useReactRouterBreadcrumbs = (routes = [], options) => getBreadcrumbs({
  routes,
  options,
  location: useLocation()
});

export default useReactRouterBreadcrumbs;