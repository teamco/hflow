import React from 'react';
import { withTranslation } from 'react-i18next';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const LandingContent = props => {
  const { t, className } = props;

  return (
      <Tabs type={'card'}
            className={className}>
        <TabPane tab={t('landing:realEstate')}
                 key={'realEstate'}>
          <p>Content of Tab Pane 1</p>
          <p>Content of Tab Pane 1</p>
          <p>Content of Tab Pane 1</p>
        </TabPane>
        <TabPane tab={t('landing:realEstate11')}
                 key={'realEstate1'}>
          <p>Content of Tab Pane 1</p>
          <p>Content of Tab Pane 1</p>
          <p>Content of Tab Pane 1</p>
        </TabPane>
      </Tabs>
  );
};

export default withTranslation()(LandingContent);
