import capitalize from 'capitalize-first-letter';

/**
 * Define reset matrix css
 * @param domElement
 */
export function resetMatrix(domElement) {
  const _style = domElement.getAttribute('style');
  _style &&
  domElement.setAttribute(
      'style',
      _style.replace(
          /matrix\(([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+), ([+\-\d.]+)\) /g,
          ''
      )
  );
}

/**
 * Define element css
 * @param domElement
 * @param {string} value
 * @param {string} type
 */
export function defineCss(type, domElement, value) {
  if (!domElement) {
    return false;
  }

  /**
   * @function
   * @param css
   * @private
   */
  function _updateCss(css) {
    // Define css
    let style = {};

    style[type] = css;
    style[`-webkit-${type}`] = css;

    return style;
  }

  let _f = domElement.style[type],
      _wf = domElement.style[`webkit${capitalize(type)}`];

  const _filter = _f.length ? _f : _wf.length ? _wf : 0;

  if (!_filter) {
    _updateCss(value);
    return false;
  }

  let _css = _filter.split(/ /g),
      _value = [],
      i = 0,
      l = _css.length,
      _updated = false;

  for (; i < l; i++) {
    let filter = _css[i];
    if (filter.indexOf(value.match(/\w+/)[0]) > -1) {
      filter = value;
      _updated = true;
    }

    _value.push(filter);
  }

  if (!_updated) {
    _value.push(value);
  }

  _updateCss(_value.join(' '));
}

/**
 * @static
 * @param target
 * @param css
 */
export function toggle(target, css) {
  const _css = typeof css === 'string' ? css.split(' ') : css;
  for (let i in _css) {
    if (_css.hasOwnProperty(i)) {
      target.classList.toggle(_css[i]);
    }
  }
}
