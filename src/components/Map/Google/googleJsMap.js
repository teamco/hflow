import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

import styles from '@/components/Map/Google/googleMap.module.less';

const googleJsMap = props => {

  const {
    isMarkerShown = true,
    options = {
      fullscreenControl: false,
      scaleControl: false,
      mapTypeControl: false,
      draggable: false,
      scrollwheel: false,
      navigationControl: false,
      streetViewControl: false,
      disableDefaultUI: false,
      zoomControl: false
    },
    defaultZoom = 14,
    address = { coordinate: {} }
  } = props;

  const { coordinate: { longitude, latitude } } = address;
  const position = { lat: latitude, lng: longitude };

  return (
      <div className={styles.googleMap}>
        <GoogleMap defaultZoom={defaultZoom}
                   options={options}
                   defaultCenter={position}>
          {isMarkerShown && <Marker position={position}/>}
        </GoogleMap>
      </div>
  );
};

export default withScriptjs(withGoogleMap(googleJsMap));