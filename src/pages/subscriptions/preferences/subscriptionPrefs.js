import React, { useEffect } from 'react';
import { Button, PageHeader } from 'antd';
import { AppstoreAddOutlined, ControlOutlined } from '@ant-design/icons';

import Page from 'components/Page';
import Main from 'components/Main';
import { Can } from 'utils/auth/can';

import { metadata } from 'pages/subscriptions/preferences/preference.metadata';

import styles from 'pages/subscriptions/preferences/subscriptionPrefs.module.less';

const { Table } = Main;
// import { Table, Tag, Space } from 'antd';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const subscriptionPrefs = props => {
  const {
    t,
    authModel,
    subscriptionPrefsModel,
    loading,
    onQuery,
    onNew
  } = props;

  const {
    touched,
    data
  } = subscriptionPrefsModel;

  const tableProps = {
    pagination: false
  };

  useEffect(() => {
    onQuery();
  }, [authModel.user]);

  const subTitle = (
      <>
        <ControlOutlined style={{ marginRight: 10 }}/>
        {t('panel:preferenceConfig')}
      </>
  );

  const { ability } = authModel;
  const component = 'subscriptionPrefs';
  const disabled = ability.cannot('update', component);

  const userProps = {
    loading,
    ability
  };

  return (
      <Page touched={touched}
            component={component}
            spinEffects={[
              'subscriptionPrefsModel/query',
              'subscriptionPrefsModel/prepareToSave'
            ]}>
        <div className={styles.preferenceWrapper}>
          <PageHeader ghost={false}
                      subTitle={subTitle}
                      extra={[
                        <Can I={'create'} a={component} key={'add'}>
                          <Button size={'small'}
                                  loading={loading.effects['subscriptionPrefsModel/newPreference']}
                                  disabled={disabled}
                                  icon={<AppstoreAddOutlined/>}
                                  onClick={() => onNew()}
                                  type={'primary'}>
                            {t('actions:new')}
                          </Button>
                        </Can>
                      ]}>
          </PageHeader>
          <Table data={data}
                 {...tableProps}
                 {...metadata({ t, ...userProps })} />
        </div>
      </Page>
  );
};
