/**
 * Fix the Received "true" for a non-boolean attribute.
 * @export
 * @param {boolean} loading
 * @return {number}
 */
export const isLoading = loading => {
  return loading ? 1 : 0;
};

/**
 * @export
 * @param loading
 * @param {array} [spinEffects]
 * @param {boolean} [condition]
 * @param {boolean} [status]
 * @return {{effects: string[], status: boolean}|boolean}
 */
export const isSpinning = (
    loading = { effects: {} },
    spinEffects = [],
    condition = false,
    status = false
) => {
  const spinning = Object.keys(loading.effects).filter(effect =>
      spinEffects.indexOf(effect) > -1 &&
      loading.effects[effect]
  );

  if (status) {
    return (spinning.length > 0 || condition) ?
        { status: true, effects: spinning } : false;
  }

  return (spinning.length > 0 || condition);
};

/**
 * @export
 * @param [models]
 * @return {boolean}
 */
export const isTouched = (models = []) => {
  return !!models.some(model => model.touched);
};