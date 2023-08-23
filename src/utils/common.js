/**
 * @export
 * @param min
 * @param max
 * @return {number}
 */
export const generateRandom = (min, max) => Math.floor(Math.random() * (max - min)) + min;
