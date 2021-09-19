import React, {useEffect} from 'react';
import {connect} from 'dva';
import {Row, Col, PageHeader, Tag, message} from 'antd';
import {
  BoldOutlined,
  TeamOutlined,
  UserOutlined,
  UserSwitchOutlined,
  MailTwoTone,
  CalendarTwoTone,
  ControlTwoTone
} from '@ant-design/icons';
import {withTranslation} from 'react-i18next';

import i18n from 'utils/i18n';

import Page from 'components/Page';
import Main from 'components/Main';
import EmailVerified from 'components/Profile/email.verified';

import {isAdmin, isBusiness} from 'services/user.service';
import {tsToLocaleDateTime} from 'utils/timestamp';
import {metadata} from 'pages/users/users.metadata';

import styles from 'pages/users/users.module.less';

const {Table} = Main;

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const users = (props) => {
  const {
    t,
    authModel,
    userModel,
    loading,
    selectedUser,
    onQuery,
    onSendVerification,
    onDeleteUser,
    onSignOutUser,
    onUnlockUser,
    onLockUser
  } = props;

  let {
    data = [],
    verificationSent
  } = userModel;

  data = selectedUser ? [selectedUser] : data;

  useEffect(() => {
    onQuery();
  }, [authModel.user]);

  const tableProps = selectedUser ? {
    pagination: false,
    expandable: {
      expandedRowRender(record) {
        const businessRole = isBusiness(record);

        return (
            <div className={styles.profileExpand}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <div>
                    <MailTwoTone/>
                    <strong>{t('auth:email')}</strong>
                  </div>
                  <div>{record.email || t('error:na')}</div>
                </Col>
                <Col span={8}>
                  <div>
                    <CalendarTwoTone/>
                    <strong>{t('form:createdAt')}</strong>
                  </div>
                  <div>{tsToLocaleDateTime(+(new Date(record.metadata.creationTime)))}</div>
                </Col>
                <Col span={8}/>
              </Row>
              <Row gutter={[16, 16]}
                   style={{marginTop: 10}}>
                <Col span={8}>
                  <EmailVerified data={record}
                                 verification={{
                                   component,
                                   verificationSent,
                                   onSendVerification
                                 }}/>
                </Col>
                <Col span={8}>
                  <div>
                    <ControlTwoTone/>
                    <strong>{t('auth:roles')}</strong>
                  </div>
                  <div>
                    <Tag className={styles.rules}
                         icon={
                           isAdmin(record.roles) ? (<TeamOutlined/>) :
                               businessRole ? (<BoldOutlined/>) :
                                   (<UserOutlined/>)}>
                      {businessRole || (record.roles || [])[0] || 'consumer'}
                    </Tag>
                  </div>
                </Col>
                <Col span={8}/>
              </Row>
            </div>
        );
      },
      rowExpandable: record => true
    }
  } : {};

  const subTitle = (
      <>
        <UserSwitchOutlined style={{marginRight: 10}}/>
        {t('actions:manage', {type: t('auth:users')})}
      </>
  );

  const {ability} = authModel;
  const component = 'users';
  const disabled = !ability.can('update', component);

  return (
      <Page className={styles.users}
            component={component}
            spinEffects={['authModel/defineAbilities']}>
        <PageHeader ghost={false}
                    subTitle={subTitle}/>
        <Table data={data}
               {...tableProps}
               {...metadata({
                 t,
                 data,
                 many: !selectedUser,
                 loading,
                 currentUser: authModel.user,
                 onDeleteUser,
                 onSignOutUser,
                 onUnlockUser,
                 onLockUser
               })} />
      </Page>
  );
};

export default connect(
    ({authModel, userModel, loading}) => ({
      authModel,
      userModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onQuery() {
        dispatch({type: `userModel/query`});
      },
      onDeleteUser(user) {
        dispatch({type: `userModel/delete`, payload: {user}});
      },
      onSignOutUser(user) {
        dispatch({type: `userModel/signOutUser`, payload: {user}});
      },
      onLockUser(user) {
        dispatch({type: `userModel/lock`, payload: {user}});
      },
      onUnlockUser(user) {
        dispatch({type: `userModel/unlock`, payload: {user}});
      },
      onSendVerification(user) {
        if (user.email) {
          dispatch({type: `userModel/sendVerification`, payload: {user}});
        } else {
          message.warning(i18n.t('msg:errorSentEmail')).then();
          message.warning(i18n.t('error:noEmail')).then();
        }
      }
    })
)(withTranslation()(users));
