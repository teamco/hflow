import React from 'react';
import { Tabs } from 'antd';
import { useIntl } from '@umijs/max';
import classnames from 'classnames';

import { t } from '@/utils/i18n';

import RealEstate from '@/pages/landing/sections/content/real.estate';

import styles from '@/pages/landing/landing.module.less';

const LandingContent = props => {
  const intl = useIntl();

  const {
    className,
    loading,
    apartmentModel,
    data: { realEstate = {} },
    onFetchCarousel,
    onLike
  } = props;

  const items = [
    {
      label: t(intl, 'landing.realEstate'),
      key: 'realEstate',
      children: (
          <RealEstate data={realEstate}
                      loading={loading}
                      model={apartmentModel}
                      onLike={onLike}
                      onFetchCarousel={onFetchCarousel}/>
      )
    },
    { label: t(intl, 'landing.lawyers'), key: 'lawyers', children: (<p>lawyers</p>) },
    { label: t(intl, 'landing.consultants'), key: 'consultants', children: (<p>consultants</p>) },
    { label: t(intl, 'landing.agents'), key: 'agents', children: (<p>agents</p>) },
    { label: t(intl, 'landing.banks'), key: 'banks', children: (<p>banks</p>) }
  ];

  return (
      <div className={classnames(className, styles.landingTabs)}>
        <div className={styles.hr}/>
        <Tabs type={'card'} centered items={items}/>
      </div>
  );
};

export default LandingContent;
