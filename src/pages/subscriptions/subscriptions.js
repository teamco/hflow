import React  from 'react';
import { Button, PageHeader } from 'antd';
import { AppstoreAddOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import Page from '@/components/Page';
import EmptyData from '@/components/EmptyData';

import { Can } from '@/utils/auth/can';

import SubscriptionCard from 'pages/subscriptions/subscriptionCard';
import { subscriptionCardMetadata } from 'pages/subscriptions/subscriptions.metadata';

import styles from 'pages/subscriptions/subscriptions.module.less';
import userStyles from 'pages/users/users.module.less';
import ExportButton from '@/components/Buttons/export.button';
import { effectHook } from '@/utils/hooks';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const subscriptions = (props) => {
  const intl = useIntl();
  const {
    authModel,
    subscriptionModel,
    onQuery,
    onNew,
    onDeleteSubscription,
    style,
    loading
  } = props;

  const {
    subscriptions = [],
    colorsToType,
    features
  } = subscriptionModel;

  effectHook(() => {
    onQuery();
  }, [authModel.user]);

  const { ability } = authModel;
  const component = 'subscriptions';
  const disabled = ability.cannot('create', component);

  const subTitle = (
      <>
        <ShoppingCartOutlined style={{ marginRight: 10 }}/>
        {intl.formatMessage({id: 'menu.subscriptions', defaultMessage: 'Subscriptions'})}
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
              'subscriptionModel/prepareToSave'
            ]}>
        <div className={styles.subscriptionWrapper}
             style={style}>
          <PageHeader ghost={false}
                      subTitle={subTitle}
                      extra={[
                        <ExportButton key={'export'}
                                      disabled={disabled}
                                      component={component}
                                      json={subscriptions}/>,
                        <Can I={'create'} a={component} key={'add'}>
                          <Button size={'small'}
                                  loading={loading.effects['subscriptionModel/newSubscription']}
                                  disabled={disabled}
                                  icon={<AppstoreAddOutlined/>}
                                  onClick={() => onNew()}
                                  type={'primary'}>
                            {intl.formatMessage({id: 'actions.new', defaultMessage: 'New'})}
                          </Button>
                        </Can>
                      ]}>
          </PageHeader>
          <div className={styles.subscriptionCards}>
            {subscriptions?.length ? subscriptions?.map((data, idx) => {
              const props = {
                isEdit: true,
                colorsToType,
                features: {
                  all: features,
                  selected: data.featuresByRef
                },
                ...subscriptionCardMetadata({
                  data,
                  className: styles.subscriptionCard,
                  menuProps,
                  ...subscriptionProps
                })
              };

              return (<SubscriptionCard key={idx} {...props} />);
            }) : (
                <EmptyData />
            )}
          </div>
        </div>
      </Page>
  );
};
