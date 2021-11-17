import { useEffect, useRef, useState } from 'react';

/**
 * @export
 * @constant
 * @param {number} [delay]
 * @return {function(*)}
 */
export const useDelayedRender = (delay = 500) => {
  const [delayed, setDelayed] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setDelayed(false), delay);
    return () => clearTimeout(timeout);
  }, []);

  return fn => !delayed && fn();
};

/**
 * @export
 * @return {[]}
 */
export function useFocus() {
  const htmlElRef = useRef(null);
  const setFocus = () => {
    htmlElRef.current?.focus();
  };

  return [htmlElRef, setFocus];
}