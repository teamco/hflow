import { stub } from '@/utils/function';
import { effectHook } from '@/utils/hooks';
import { useEffect, useState } from 'react';

/**
 * @export
 * @param {string} html Representing a single element
 * @return {ChildNode}
 */
export function htmlToElement(html) {
  const template = document.createElement('template');
  // Never return a text node of whitespace as the result
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

/**
 * @export
 * @param {string} html Representing any number of sibling elements
 * @return {NodeList}
 */
export function htmlToElements(html) {
  const template = document.createElement('template');
  // Never return a text node of whitespace as the result
  template.innerHTML = html.trim();
  return template.content.childNodes;
}

/**
 * @export
 * @description Handle DOM changes
 * @param css
 * @param [attrs]
 * @param [callback]
 * @param [disconnect]
 * @type {(function(*, *): (undefined|Window.MutationObserver|MutationObserver))|*}
 */
export const observeDOM = (
    css, attrs = {}, callback = stub, disconnect = true) => {
  let observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (!mutation.addedNodes) return;

      for (const element of mutation.addedNodes) {
        // Do things to your newly added nodes here
        let node = element;

        if (node['classList'] && node['classList'].contains(css)) {
          // Stop watching using:
          disconnect && observer.disconnect();
          callback();
        }
      }
    });
  });

  const observeProps = {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
    ...attrs
  };

  observer.observe(document.body, observeProps);
};

/**
 * @export
 * @param props
 */
export const focusAt = props => {
  const { condition = false, ref } = props;

  effectHook(() => {
    condition && ref?.current?.focus();
  }, [condition, ref?.current]);
};

/**
 * @export
 * @param {string} url
 * @return {string}
 */
export const useExternalScript = (url) => {
  let [state, setState] = useState(url ? 'loading' : 'idle');

  useEffect(() => {
    if (!url) {
      setState('idle');
      return;
    }

    let script = document.querySelector(`script[src="${url}"]`);

    const handleScript = (e) => {
      setState(e.type === 'load' ? 'ready' : 'error');
    };

    if (!script) {
      script = document.createElement('script');
      script.type = 'application/javascript';
      script.src = url;
      script.async = true;
      document.body.appendChild(script);
      script.addEventListener('load', handleScript);
      script.addEventListener('error', handleScript);
    }

    script.addEventListener('load', handleScript);
    script.addEventListener('error', handleScript);

    return () => {
      script.removeEventListener('load', handleScript);
      script.removeEventListener('error', handleScript);
    };
  }, [url]);

  return state;
};