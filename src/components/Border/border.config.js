/**
 * @constant
 * @type {{'0': number, '1': number, '2': number, '3': number}}
 */
const offsetWidth = {
  0: 85,
  1: 77,
  2: 68,
  3: 60
};

/**
 * @export
 * @param [props]
 * @return {{dims: {left: {width: string}, bottom: {color: string, width: string, style: string}, right: {width: *}}, direction: string}}
 */
export const topProps = (props = {}) => {
  const {
    direction = 'top',
    offset = 1,
    width = 15,
    height = 10,
    color = 'rgb(241, 241, 241)',
    style = 'solid'
  } = props;

  return {
    direction,
    dims: {
      left: { width: `${width}vw` },
      right: { width: `${offsetWidth[offset]}vw` },
      bottom: { width: `${height}vw`, color, style }
    }
  };
};

/**
 * @export
 * @param [props]
 * @return {{dims: {left: {width: *}, bottom: {color: string, width: string, style: string}, right: {width: string}}, direction: string}}
 */
export const bottomProps = (props = {}) => {
  const {
    direction = 'bottom',
    offset = 1,
    width = 15,
    height = 10,
    color = 'rgb(241, 241, 241)',
    style = 'solid'
  } = props;

  return {
    direction,
    dims: {
      left: { width: `${offsetWidth[offset]}vw` },
      right: { width: `${width}vw` },
      top: { width: `${height}vw`, color, style }
    }
  };
};

/**
 * @export
 * @param [props]
 * @return {`polygon(0% 0%, 100% 0, 100% ${*}%, ${number}% 100%, 0 ${*}%)`}
 */
export const bottomPolygon = (props = {}) => {
  const {
    offset = 1,
    width = 15
  } = props;

  const oWidth = offsetWidth[offset];

  return `polygon(0% 0%, 100% 0, 100% ${oWidth}%, ${100 - width}% 100%, 0 ${oWidth}%)`;
};