import inRange from 'lodash/inRange';
import memoize from 'lodash/memoize';

/**
 * @export
 * @param [width]
 * @return {string}
 */
export const getBreakPoint = width => {
  width = isNaN(parseInt(width, 10)) ? window.innerWidth : width;
  return inRange(width, 0, 576) ? 'xs' :
      inRange(width, 576, 768) ? 'sm' :
          inRange(width, 768, 992) ? 'md' :
              inRange(width, 992, 1200) ? 'lg' :
                  inRange(width, 1200, 1600) ? 'xl' : 'xxl';
};

/**
 * @export
 */
export const calculatePadding = memoize((columns, width) => {
  const breakPoint = getBreakPoint(width);
  if (columns > 1) {
    const gutter = (layout.rowProps[columns] || {})[breakPoint] || {};
    return ({
      paddingLeft : gutter / 2,
      paddingRight: gutter / 2
    });
  }
});

/**
 * @export
 * @param colProps
 * @param [span]
 * @param [width]
 * @return {*}
 */
export const calculateColProps = memoize((colProps, span, width) => {
  if (span) {
    const breakPoint = getBreakPoint(width);
    const _colProps = { ...colProps };
    _colProps[breakPoint] = span;
    return _colProps;
  } else {
    return colProps;
  }
});

/**
 * @export
 * @type {*}
 */
export const layout = {
  rowProps: {
    0: {},
    1: {},
    2: {
      xs : 8,
      sm : 16,
      md : 24,
      lg : 24,
      xl : 32,
      xxl: 32
    },
    3: {
      xs : 0,
      sm : 16,
      md : 24,
      lg : 24,
      xl : 32,
      xxl: 32
    }
  },
  colsSpan: {
    1 : 24,
    2 : 12,
    3 : 8,
    4 : 6,
    6 : 4,
    8 : 3,
    12: 2
  },
  colProps: {
    0: {},
    1: {
      xs : 24,
      sm : 24,
      md : 24,
      lg : 24,
      xl : 24,
      xxl: 24
    },
    2: {
      xs : 24,
      sm : 24,
      md : 12,
      lg : 8,
      xl : 8,
      xxl: 8
    },
    3: {
      xs : 24,
      sm : 24,
      md : 8,
      lg : 8,
      xl : 8,
      xxl: 8
    }
  }
};
