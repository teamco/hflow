import React from 'react';
import { Tabs } from 'antd';
import { useIntl } from 'umi';
import classnames from 'classnames';

import RealEstate from './content/real.estate';

import styles from 'pages/landing/landing.module.less';

const { TabPane } = Tabs;

const LandingContent = props => {
  const intl = useIntl();
  const { className, data: { realEstate = {} } } = props;

  return (
      <div className={classnames(className, styles.landingTabs)}>
        <div className={styles.hr}/>
        <Tabs type={'card'} centered>
          <TabPane tab={intl.formatMessage({id: 'landing.realEstate', defaultMessage: 'Real Estate'})}
                   key={'realEstate'}>
            <RealEstate {...realEstate}/>
          </TabPane>
          <TabPane tab={intl.formatMessage({id: 'landing.lawyers', defaultMessage: 'Lawyers'})}
                   key={'lawyers'}>
            <p>lawyers</p>
          </TabPane>
          <TabPane tab={intl.formatMessage({id: 'landing.consultants', defaultMessage: 'Consultants'})}
                   key={'consultants'}>
            <p>consultants</p>
          </TabPane>
          <TabPane tab={intl.formatMessage({id: 'landing.agents', defaultMessage: 'Agents'})}
                   key={'agents'}>
            <p>agents</p>
          </TabPane>
          <TabPane tab={intl.formatMessage({id: 'landing.banks', defaultMessage: 'Banks'})}
                   key={'banks'}>
            <p>banks</p>
          </TabPane>
        </Tabs>
      </div>
  );
};

export default LandingContent;
