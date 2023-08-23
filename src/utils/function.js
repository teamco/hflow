/**
 * Empty function.
 * @export
 * @constant
 */
export const stub = () => {
};

/**
 * Empty async function.
 * @export
 * @constant
 */
export const asyncStub = async () => {
};

/**
 * @export
 * @param {number} [ts]
 * @return {Promise<unknown>}
 */
export const promisedStub = (ts = 300) => new Promise(resolve => {
  setTimeout(resolve, ts);
});
