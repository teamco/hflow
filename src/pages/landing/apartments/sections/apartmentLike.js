import React from 'react';
import { useIntl } from '@umijs/max';
import { Tooltip } from 'antd';
import { HeartTwoTone } from '@ant-design/icons';
import classnames from 'classnames';

import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';
import Loader from '@/components/Loader';

import styles from '../apartment.module.less';
import landingStyles from '@/layouts/landing/landing.layout.module.less';

export const ApartmentLike = props => {
  const intl = useIntl();

  const {
    liked,
    apartment,
    className,
    loading,
    spinOn = [],
    onClick = stub
  } = props;

  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();

    onClick(apartment?.id);
  };

  return (
      <Loader loading={loading} spinOn={spinOn}
              wrapperClassName={styles.centered}>
        <div className={className} onClick={handleClick}>
          <Tooltip title={t(intl, !!liked?.content ? 'actions.unLike' : 'actions.like')}>
            <HeartTwoTone className={classnames(landingStyles.prettified, {
              [landingStyles.liked]: !!liked?.content
            })}/>
          </Tooltip>
        </div>
      </Loader>
  );
};