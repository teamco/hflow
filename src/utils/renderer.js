import { useDelayedRender } from './hooks';

/**
 * @export
 * @param {number} delay
 * @param children
 * @return {*}
 * @example
 * const Component = lazy(() => import("./some-large-component"));
 * <Suspense fallback={<DelayedRender delay={500}>Loading...</DelayedRender>}>
 *    <Component />
 * </Suspense>
 */
export const DelayedRender = ({ delay, children }) => useDelayedRender(delay)(() => children);
