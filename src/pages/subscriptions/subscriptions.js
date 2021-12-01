import React, { useEffect } from 'react';
import { AppstoreAddOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Button, PageHeader } from 'antd';

import { Can } from 'utils/auth/can';

import Main from 'components/Main';
import Page from 'components/Page';
import { subscriptionCardMetadata } from 'pages/subscriptions/subscriptions.metadata';

import styles from 'pages/subscriptions/subscriptions.module.less';
import userStyles from 'pages/users/users.module.less';

const { Card } = Main;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const subscriptions = (props) => {
  const {
    t,
    authModel,
    subscriptionModel,
    onQuery,
    onNew,
    style,
    loading
  } = props;

  const {
    data = []
  } = subscriptionModel;

  useEffect(() => {
    onQuery();
  }, [authModel.user]);

  const { ability } = authModel;
  const component = 'subscriptions';
  const disabled = ability.cannot('create', component);

  const subTitle = (
      <>
        <ShoppingCartOutlined style={{ marginRight: 10 }}/>
        {t('menu:subscriptions')}
      </>
  );

  const subscriptionProps = {
    loading,
    ability
  };

  return (
      <Page className={userStyles.users}
            component={component}
            spinEffects={[
              'subscriptionModel/query',
              'subscriptionModel/save'
            ]}>
        <div className={styles.subscriptionWrapper}
             style={style}>
          <PageHeader ghost={false}
                      subTitle={subTitle}
                      extra={[
                        <Can I={'create'} a={component} key={'add'}>
                          <Button size={'small'}
                                  loading={loading.effects['subscriptionModel/newSubscription']}
                                  disabled={disabled}
                                  icon={<AppstoreAddOutlined/>}
                                  onClick={() => onNew()}
                                  type={'primary'}>
                            {t('actions:new')}
                          </Button>
                        </Can>
                      ]}>
          </PageHeader>
          <div className={styles.subscriptionCards}>
            {data?.length ? data?.map((user, idx) => {
              const props = {
                ...subscriptionCardMetadata(t, {
                  user,
                  className: styles.subscriptionCard,
                  ...subscriptionProps
                })
              };

              return (<Card key={idx} {...props} />);
            }) : (<Card noData/>)}
          </div>
        </div>
      </Page>
  );
};
