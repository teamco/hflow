/**
 * @export
 * @param onActiveTab
 */
export const handleActiveTab = (onActiveTab) => {
  window.addEventListener('focus', () => onActiveTab(true));
  window.addEventListener('blur', () => onActiveTab(false));
};

/**
 * @export
 * @param {string} id
 */
export const scrollToRef = ({ id }) => {
  const ref = document.querySelector(`#${id}`);
  ref && ref.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
};

/**
 * @export
 * @param useState
 * @param useLayoutEffect
 * @return {*}
 */
export function useWindowSize(useState, useLayoutEffect) {
  const event = 'orientationchange' in window ? 'orientationchange' : 'resize';
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    const { innerWidth, innerHeight, addEventListener, removeEventListener } = window;
    const updateSize = () => (setSize([innerWidth, innerHeight]));
    addEventListener(event, updateSize);
    updateSize();
    return () => removeEventListener(event, updateSize);
  }, []);

  return size;
}

/**
 * @export
 * @return {boolean}
 */
export function isLocalHost() {
  const { hostname } = window.location;
  return hostname === 'localhost' ||
    hostname.match(/^192\./) ||
    hostname.match(/^10\./);
}
