import React, {useState} from 'react';
import {effectHook} from '@/utils/hooks';
import {logger} from '@/utils/console';

/**
 * @export
 * @param props
 * @returns {JSX.Element|null}
 * @constructor
 */
export const CountryFlag = props => {
  const {country, title, className} = props;

  const [flag, updateFlag] = useState(null);

  effectHook(() => {
    country && import(`country-flag-icons/string/3x2`).then(flags => {
      try {
        const buff = new Buffer(flags[country]);
        const base64data = buff.toString('base64');
        updateFlag(base64data);
      } catch(e) {
        logger({type: 'warn', e});
      }
    });
  }, [country]);

  return flag ? (
      <div title={title} className={className}>
        <img src={`data:image/svg+xml;base64,${flag}`} alt={country}/>
      </div>
  ) : null;
};
