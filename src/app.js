import { enableMapSet } from 'immer';

import { logger } from '@/utils/console';

export const request = {
  timeout: 20000,
  errorConfig: {
    errorHandler() {
    },
    errorThrower() {
    }
  },
  extraModels: [],
  requestInterceptors: [
    // Write a function directly as an interceptor
    (url, options) => {
      // Do something
      return { url, options };
    },
    // A 2-tuple, the first element is the request interceptor,
    // and the second element is the error handler
    [(url, options) => ({ url, options }), (error) => Promise.reject(error)],
    // Array, omitting error handling
    [(url, options) => ({ url, options })]
  ],
  responseInterceptors: [
    // Write a function directly as an interceptor
    (response) => {
      // Do something
      return response;
    },
    // A 2-tuple, the first element is the request interceptor,
    // and the second element is the error handler
    [(response) => response, (error) => Promise.reject(error)],
    // Array, omitting error handling
    [(response) => response]
  ]
};

enableMapSet();

/**
 * @export
 * @type {{config}}
 */
export const dva = {
  config: {
    // onAction: createLogger(),
    onError(e) {
      // message.error(e.message, 3).then((error) => {
      console.warn(e);
      // });
    }
  }
};

export function onRouteChange(router) {
  // const { matchedRoutes } = router;
  // const dispatch = useDispatch();
  // dispatch({
  //   type: 'appModel/updateReferrer',
  //   payload: { referrer: document.referrer }
  // });
}

(() => {
  // Define a new console
  window.console = ((oldCons => ({
    debug(...args) {
      oldCons.log(args);
    },
    trace(...args) {
      oldCons.trace(args);
    },
    log(...args) {
      logger({ type: 'log', args, echo: oldCons });
    },
    info(...args) {
      logger({ type: 'info', args, echo: oldCons });
    },
    warn(...args) {
      logger({ type: 'warn', args, echo: oldCons });
    },
    error(...args) {
      logger({ type: 'error', args, echo: oldCons });
    }
  }))(window.console));
})();

window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator && document.URL.split(':')[0] !== 'file') {
    navigator.serviceWorker.register('/worker/sw.js').then();
  }
};