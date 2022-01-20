import { useState } from 'react';
import { effectHook } from '@/utils/hooks';

/**
 * @constant
 * @type {{enableHighAccuracy: boolean, maximumAge: number, timeout: number}}
 */
const defaultSettings = {
  enableHighAccuracy: false,
  timeout: Infinity,
  maximumAge: 0
};

/**
 * @export
 * @param watch
 * @param settings
 * @return {{error: unknown}}
 */
export const useGeolocation = (watch = false, settings = defaultSettings) => {
  const { geolocation } = window.navigator;

  const [location, setLocation] = useState({});
  const [error, setError] = useState(null);

  /**
   * @constant
   * @param coords
   * @param timestamp
   */
  const onChange = ({ coords, timestamp }) => {
    setLocation({
      accuracy: coords.accuracy,
      altitude: coords.altitude,
      altitudeAccuracy: coords.altitudeAccuracy,
      latitude: coords.latitude,
      longitude: coords.longitude,
      speed: coords.speed,
      timestamp
    });
  };

  /**
   * @constant
   * @param error
   */
  const onError = error => {
    setError(error.message);
  };

  effectHook(() => {
    if (!geolocation) {
      return setError('Geolocation is not supported');
    }

    let watcher = null;
    if (watch) {
      watcher = geolocation.watchPosition(onChange, onError, settings);
    } else {
      geolocation.getCurrentPosition(onChange, onError, settings);
    }

    return () => watcher && geolocation.clearWatch(watcher);
  }, [
    settings.enableHighAccuracy,
    settings.timeout,
    settings.maximumAge
  ]);

  return { ...location, error };
};
