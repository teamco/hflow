import React, { useEffect } from 'react';
import { Button, PageHeader } from 'antd';
import { AppstoreAddOutlined, ShoppingCartOutlined } from '@ant-design/icons';

import Page from 'components/Page';
import { Can } from 'utils/auth/can';

import SubscriptionCard from 'pages/subscriptions/subscriptionCard';
import { subscriptionCardMetadata } from 'pages/subscriptions/subscriptions.metadata';

import styles from 'pages/subscriptions/subscriptions.module.less';
import userStyles from 'pages/users/users.module.less';

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
    onDeleteSubscription,
    style,
    loading
  } = props;

  const {
    subscriptions = { data: [] },
    subscriptionPeriod,
    colorsToType
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

  const menuProps = {
    isEdit: false,
    ability,
    loading,
    component,
    onDeleteSubscription
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
                                  loading={loading.effects['businessModel/newBusiness']}
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
            {subscriptions?.data?.length ? subscriptions?.data?.map((data, idx) => {
              const props = {
                t,
                isEdit: true,
                subscriptionPeriod,
                colorsToType,
                ...subscriptionCardMetadata(t, {
                  data,
                  className: styles.subscriptionCard,
                  menuProps,
                  ...subscriptionProps
                })
              };

              return (<SubscriptionCard key={idx} {...props} />);
            }) : null}
          </div>
        </div>
      </Page>
  );
};
