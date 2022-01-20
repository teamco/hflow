import { useCallback, useEffect, useRef, useState } from 'react';
import { asyncStub, promisedStub, stub } from '@/utils/function';

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

/**
 * React 💘 localStorage: persisting state with a custom hook.
 * @link https://levelup.gitconnected.com/react-localstorage-persisting-state-with-a-custom-hook-98f9a88ae7a9
 * @export
 * @param defaultValue
 * @param localStorageKey
 */
export const usePersistedState = (defaultValue, localStorageKey) => {
  const [value, setValue] = useState(() => {
    const localStorageItem = localStorage.getItem(localStorageKey);
    if (localStorageItem === null) return defaultValue;
    try {
      return JSON.parse(localStorageItem);
    } catch (err) {
      return defaultValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  }, [value]);

  // Expose the value and the updater function.
  return [value, setValue];
};

/**
 * A hook to fetch async data.
 * @export
 * @param {function} [asyncFunc]                  Promise like async function
 * @param {boolean} [immediate=false]             Invoke the function immediately
 * @param {object} [funcParams]                   Function initial parameters
 * @param {object} [initialData]                  Initial data
 * @returns {{ execute, loading, data, error }}   Async object
 * @example
 *   const { execute, loading, data, error } = useAsync({
 *    asyncFunc: async () => { return 'data' },
 *    immediate: false,
 *    funcParams: { data: '1' },
 *    initialData: 'Hello'
 *  })
 */
export const useAsync = ({
  asyncFunc = asyncStub,
  immediate = false,
  funcParams = {},
  initialData = {}
}) => {
  const [loading, setLoading] = useState(immediate);
  const [data, setData] = useState(initialData);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const execute = useCallback(params => {
    setLoading(true);
    return asyncFunc({ ...funcParams, ...params }).then(res => {
      if (!mountedRef.current) return null;
      setData(res);
      setError(null);
      setLoading(false);
      return res;
    }).catch(err => {
      if (!mountedRef.current) return null;
      setError(err);
      setLoading(false);
      throw err;
    });
  }, [asyncFunc, funcParams]);

  useEffect(() => {
    if (immediate) {
      execute(funcParams);
    }
    return () => {
      mountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    execute,
    loading,
    data,
    error
  };
};

/**
 * @export
 * @return {React.MutableRefObject<null>}
 */
export function useIsMountedRef() {
  const isMountedRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  });

  return isMountedRef;
}

/**
 * @export
 * @param effect
 * @param [dependencies]
 * @example
 * useAbortableEffect((status) => {
 *    if (pets.selectedPet) {
 *      dispatch({ type: "FETCH_PET" });
 *      getPet(pets.selectedPet).then(data => {
 *        if (!status.aborted) {
 *          dispatch({ type: "FETCH_PET_SUCCESS", payload: data });
 *        }
 *      });
 *    } else {
 *      dispatch({ type: "RESET" });
 *    }
 * }, [pets.selectedPet]);
 */
export function useAbortableEffect(effect, dependencies = []) {

  /**
   * Mutable status object.
   * @type {{aborted}}
   */
  const status = {};
  useEffect(() => {
    status.aborted = false;

    /**
     * Pass the mutable object to the effect callback.
     * Store the returned value for cleanup.
     * @constant
     * @function
     */
    const cleanUpFn = effect(status);

    return () => {

      /**
       * Mutate the object to signal the consumer.
       * This effect is cleaning up.
       * @type {boolean}
       */
      status.aborted = true;
      if (typeof cleanUpFn === 'function') {

        /**
         * Run the cleanup function.
         */
        cleanUpFn();
      }
    };
  }, [...dependencies]);
}

/**
 * @export
 * @param {function} [effect]
 * @param {array} [deps]
 * @param {function} [apiCall]
 * @param {number} [ts]
 */
export function effectHook(effect = stub, deps = [], apiCall = promisedStub, ts = 10) {
  useEffect(() => {
    let isMounted = true;

    apiCall(ts).then(() => {
      if (isMounted) {
        console.log('mounted', effect, deps)
        effect();
      }
    });

    return () => {
      console.log('unmounted', effect, deps)
      isMounted = false;
    };
  }, [...deps]);
}

