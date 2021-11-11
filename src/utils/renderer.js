import { useDelayedRender } from './hooks';

/**
 * @export
 * @param delay
 * @param children
 * @return {*}
 * @constructor
 */
export const DelayedRender = ({ delay, children }) => useDelayedRender(delay)(() => children);
