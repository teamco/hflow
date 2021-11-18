import React from 'react';
import { withTranslation } from 'react-i18next';
import { Tabs } from 'antd';
import classnames from 'classnames';

import RealEstate from './content/real.estate';

import styles from 'pages/landing/landing.module.less';

const { TabPane } = Tabs;

const LandingContent = props => {
  const { t, className, data: { realEstate = [] } } = props;

  return (
      <div className={classnames(className, styles.landingTabs)}>
        <div className={styles.hr}/>
        <Tabs type={'card'} centered>
          <TabPane tab={t('landing:realEstate')}
                   key={'realEstate'}>
            <RealEstate {...realEstate}/>
          </TabPane>
          <TabPane tab={t('landing:lawyers')}
                   key={'lawyers'}>
            <p>lawyers</p>
          </TabPane>
          <TabPane tab={t('landing:consultants')}
                   key={'consultants'}>
            <p>consultants</p>
          </TabPane>
          <TabPane tab={t('landing:agents')}
                   key={'agents'}>
            <p>agents</p>
          </TabPane>
          <TabPane tab={t('landing:banks')}
                   key={'banks'}>
            <p>banks</p>
          </TabPane>
        </Tabs>
      </div>
  );
};

export default withTranslation()(LandingContent);
