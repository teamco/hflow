import React, { useRef } from 'react';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';

import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';
import { componentAbilities } from '@/utils/auth/component.setting';

import SubscriptionCard from '@/pages/subscriptions/subscriptionCard';
import { subscriptionCardMetadata } from '@/pages/subscriptions/subscriptions.metadata';

import Page from '@/components/Page/page.connect';
import EmptyData from '@/components/EmptyData';
import { SubHeader } from '@/components/Page/page.subheader';

import styles from '@/pages/subscriptions/subscriptions.module.less';
import userStyles from '@/pages/users/users.module.less';

const MODEL_NAME = 'subscriptionModel';

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

  const refTarget = useRef(null);

  effectHook(() => {
    authModel.user && onQuery();
  }, [authModel.user]);

  const component = 'subscriptions';
  const {
    ability,
    disabled,
    canUpdate,
    canDelete,
    canExport
  } = componentAbilities(authModel, component, true);

  const subTitle = (
      <>
        <ShoppingCartOutlined style={{ marginRight: 10 }}/>
        {t(intl, 'menu.subscriptions')}
      </>
  );

  const subscriptionProps = {
    loading,
    ability
  };

  const menuProps = {
    isEdit: false,
    intl,
    ability,
    loading,
    component,
    canUpdate,
    canDelete,
    onDeleteSubscription
  };

  const pageHeaderProps = {
    subTitle,
    loading,
    disabled,
    MODEL_NAME,
    component,
    actions: {
      exportBtn: { refTarget, data: subscriptions, disabled: !canExport },
      newBtn: { onClick: onNew, spinOn: [`${MODEL_NAME}/newSubscription`] },
      closeBtn: false,
      saveBtn: false,
      menuBtn: false
    }
  };

  return (
      <Page className={userStyles.users}
            component={component}
            spinEffects={[
              `${MODEL_NAME}/query`,
              `${MODEL_NAME}/features`,
              `${MODEL_NAME}/newSubscription`,
              `${MODEL_NAME}/validateSubscription`
            ]}>
        <div className={styles.subscriptionWrapper}
             style={style}>
          <SubHeader {...pageHeaderProps}/>
          <div className={styles.subscriptionCards}
               ref={refTarget}>
            {subscriptions?.length ? subscriptions?.map((data, idx) => {
              const props = {
                isEdit: true,
                colorsToType,
                features: {
                  all: features,
                  selected: data.features
                },
                ...subscriptionCardMetadata({
                  data,
                  disabled,
                  loading,
                  className: styles.subscriptionCard,
                  menuProps,
                  ...subscriptionProps
                })
              };

              return (<SubscriptionCard key={idx} {...props}  />);
            }) : (
                <EmptyData/>
            )}
          </div>
        </div>
      </Page>
  );
};
