import React from 'react';
import { useIntl } from '@umijs/max';
import classnames from 'classnames';
import capitalize from 'capitalize-first-letter';

import * as Icons from '@/components/Icons';

import { t } from '@/utils/i18n';

import styles from '../apartment.module.less';

export const ApartmentFeature = props => {
  const intl = useIntl();

  const {
    icon,
    label,
    className
  } = props;

  let IconComponent = React.isValidElement(icon) ? icon : Icons[`${capitalize(label)}Icon`];

  if (IconComponent) {
    // TODO (teamco): Do something;
  } else {
    console.warn('Icon component must be exported', label);
    IconComponent = null;
  }

  return (
      <div className={classnames(styles.feature, className)}>
        <IconComponent/>
        <span>{t(intl, `apartment.${label}`)}</span>
      </div>
  );
};