import React, { useRef, useState } from 'react';
import {Modal} from "antd";
import { UserSwitchOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';

import { t } from '@/utils/i18n';
import { effectHook } from '@/utils/hooks';
import { componentAbilities } from '@/utils/auth/component.setting';

import Page from '@/components/Page/page.connect';
import Main from '@/components/Main';
import LayoutButton from '@/components/Buttons/layout.button';
import { SubHeader } from '@/components/Page/page.subheader';

import SendMessage from '@/pages/users/metadata/send.message';
import { metadata } from '@/pages/users/users.metadata';
import { userCardMetadata } from '@/pages/users/metadata/user.card';

import styles from '@/pages/users/users.module.less';

const { Table, Card } = Main;

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
export const users = (props) => {
  const intl = useIntl();

  const {
    authModel,
    userModel,
    pageModel,
    loading,
    onQuery,
    onDeleteUser,
    onSignOutUser,
    onUnlockUser,
    onLockUser,
    onSendMessage,
    onChangeGridLayout
  } = props;

  const [modal, contextHolder] = Modal.useModal();

  let { data = [] } = userModel;
  let { gridLayout } = pageModel;

  effectHook(() => {
    authModel.user && onQuery();
  }, [authModel.user]);

  const [visibleMessage, setVisibleMessage] = useState({ visible: false, props: {} });

  const subTitle = (
      <>
        <UserSwitchOutlined style={{ marginRight: 10 }}/>
        {t(intl, 'user.actions.manage')}
      </>
  );

  const component = 'users';
  const {
    ability,
    disabled,
    canUpdate,
    canDelete,
    canExport
  } = componentAbilities(authModel, component, true);

  const sendProps = {
    onSendMessage,
    visibleMessage,
    setVisibleMessage
  };

  const userProps = {
    loading,
    ability,
    disabled,
    currentUser: authModel.user,
    multiple: true,
    modal,
    onSignOutUser,
    onSendMessage,
    onLockUser,
    onUnlockUser,
    onDeleteUser,
    setVisibleMessage
  };

  const refTarget = useRef(null);
  const MODEL_NAME = 'userModel';

  const pageHeaderProps = {
    subTitle,
    loading,
    disabled,
    MODEL_NAME,
    component,
    actions: {
      closeBtn: false,
      saveBtn: false,
      menuBtn: false,
      newBtn: false,
      exportBtn: { refTarget, data, disabled: !canExport },
      extra: [
        <LayoutButton key={'layout'}
                      onClick={onChangeGridLayout}/>
      ]
    }
  };

  return (
      <Page className={styles.users}
            component={component}
            spinEffects={[
              'authModel/defineAbilities',
              `${MODEL_NAME}/query`
            ]}>
        <SubHeader {...pageHeaderProps}/>
        <div ref={refTarget}>
          {contextHolder}
          {gridLayout ? (
              <Table data={data}
                     {...metadata({
                       data,
                       intl,
                       ...userProps
                     })} />
          ) : (
              <div className={styles.userCards}>
                {data.map((user, idx) => {
                  const props = {
                    ...userCardMetadata({
                      intl,
                      user,
                      className: styles.userCard,
                      ...userProps
                    })
                  };

                  return (<Card key={idx} {...props} />);
                })}
              </div>
          )}
          <SendMessage {...sendProps}/>
        </div>
      </Page>
  );
};
