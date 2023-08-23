import React from 'react';

import googleConfig from '@/services/config/google.config';

import styles from '@/components/Map/Google/googleMap.module.less';

const { MAP_STATIC_API, MAP_KEY } = googleConfig;

export const googleStaticMap = props => {

  const {
    size = '600x400',
    type = 'roadmap',
    zoom = 12,
    marker = {
      color: 'red',
      label: 'L'
    },
    address = { coordinate: {} }
  } = props;

  const { coordinate: { longitude, latitude } } = address;
  const position = `${latitude},${longitude}`;

  const _markers = marker ? `&markers=color:${marker.color}|label:${marker.label}|${position}` : '';
  const _size = `size=${size}`;
  const _type = `maptype=${type}`;
  const _center = `center=${position}`;
  const _zoom = `zoom=${zoom}`;
  const _key = `key=${MAP_KEY}`;

  return (
      <div className={styles.googleMap}>
        <img src={`${MAP_STATIC_API}?${_size}${_markers}&${_type}&${_center}&${_zoom}&${_key}`}
             alt={type}/>
      </div>
  );
};