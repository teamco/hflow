/**
 * Empty function.
 * @export
 * @constant
 */
export const stub = () => {
};

/**
 * @export
 * @param timeout
 * @return {Promise<unknown>}
 */
export const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
