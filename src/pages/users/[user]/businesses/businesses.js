import React, { useRef } from 'react';
import { useParams, useIntl } from '@umijs/max';
import { TrademarkOutlined } from '@ant-design/icons';

import Main from '@/components/Main';
import Page from '@/components/Page/page.connect';
import { SubHeader } from '@/components/Page/page.subheader';

import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';
import { componentAbilities } from '@/utils/auth/component.setting';

import { metadata } from '@/pages/users/[user]/businesses/businesses.metadata';

import userStyles from '@/pages/users/users.module.less';
import styles from '@/pages/users/[user]/businesses/businesses.module.less';

const { Table } = Main;

export const businesses = (props) => {
  const intl = useIntl();

  const {
    businessModel,
    authModel,
    loading,
    selectedUser,
    onNew,
    onGetBusinesses,
    onDeleteBusiness,
    onHoldBusiness,
    onActivateBusiness,
    style
  } = props;

  const {
    data = []
  } = businessModel;

  /**
   * @type {{user}}
   */
  const { user = authModel.user?.id } = useParams();

  effectHook(() => {
    authModel.user && onGetBusinesses(selectedUser, user);
  }, [authModel.user, user]);

  const subTitle = (
      <>
        <TrademarkOutlined style={{ marginRight: 10 }}/>
        {t(intl, 'business.meta')}
      </>
  );

  const component = 'businesses';
  const {
    ability,
    disabled,
    canUpdate,
    canDelete,
    canCreate,
    canExport
  } = componentAbilities(authModel, component, true);

  const MODEL_NAME = 'businessModel';
  const refTarget = useRef(null);

  const pageHeaderProps = {
    subTitle,
    loading,
    disabled,
    MODEL_NAME,
    component,
    actions: {
      exportBtn: { refTarget, data, disabled: !canExport },
      newBtn: {
        onClick: () => onNew(user),
        spinOn: [`${MODEL_NAME}/newBusiness`]
      },
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
              `${MODEL_NAME}/validateBusiness`
            ]}>
        <div className={styles.businessWrapper}
             style={style}>
          <SubHeader {...pageHeaderProps}/>
          <div ref={refTarget}>
            <Table data={data}
                   {...metadata({
                     data,
                     user,
                     disabled,
                     isEdit: false,
                     multiple: true,
                     ability,
                     loading,
                     onDeleteBusiness,
                     onHoldBusiness,
                     onActivateBusiness
                   })} />
          </div>
        </div>
      </Page>
  );
};
