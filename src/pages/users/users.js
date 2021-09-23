import React, {useEffect, useState} from 'react';
import {connect} from 'dva';
import {Row, Col, PageHeader, Tag, message, Select} from 'antd';
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

import {isAdmin} from 'services/userRoles.service';
import {tsToLocaleDateTime} from 'utils/timestamp';
import {metadata} from 'pages/users/users.metadata';

import styles from 'pages/users/users.module.less';

const {Option, OptGroup} = Select;
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
    userRolesModel,
    loading,
    selectedUser,
    onRolesQuery,
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

  const {userRoles, businessRoles} = userRolesModel;

  const [currentRules, setCurrentRules] = useState(selectedUser?.roles || []);

  data = selectedUser ? [selectedUser] : data;

  useEffect(() => {
    onQuery();
    onRolesQuery();
  }, [authModel.user]);

  useEffect(() => {
    // onRolesQuery();
  }, [userRoles, businessRoles]);

  const handleRoleTags = (value) => {
    setCurrentRules([...currentRules, value]);
  };

  /**
   * @constant
   * @param {array} current
   * @param {array} [roles]
   * @return {*[]}
   */
  const filterRoles = (current, roles = []) => {
    return [...roles].sort().filter(role => !current.includes(role));
  };

  /**
   * @constant
   * @param record
   * @return {*}
   */
  const handleRoles = (record) => {
    if (isAdmin(authModel?.user?.roles)) {
      return (
          <>
            <div>
              <ControlTwoTone/>
              <strong>{`${t('actions:assign')} ${t('auth:roles')}`}</strong>
            </div>
            <Select value={t('actions:select')}
                    onSelect={handleRoleTags}
                    size={'small'}
                    style={{width: 200}}>
              <OptGroup label={t('panel:userRoles')}>
                {filterRoles(currentRules, userRoles?.roles).map((role, idx) => (
                    <Option key={`ur.${idx}`} value={role}>{role}</Option>
                ))}
              </OptGroup>
              <OptGroup label={t('panel:businessRoles')}>
                {filterRoles(currentRules, businessRoles?.roles).map((role, idx) => (
                    <Option key={`br.${idx}`} value={role}>{role}</Option>
                ))}
              </OptGroup>
            </Select>
          </>
      );
    }
    return null;
  };

  const tableProps = selectedUser ? {
    pagination: false,
    expandable: {
      expandedRowRender(record) {
        const businessRole = false; //isBusiness(record);
        const rowProps = {gutter: {xs: 8, sm: 16, md: 24, lg: 32}};
        const colProps = {sm: 12, md: 8, style: {marginTop: 10}};

        return (
            <div className={styles.profileExpand}>
              <Row {...rowProps}>
                <Col {...colProps}>
                  <div>
                    <MailTwoTone/>
                    <strong>{t('auth:email')}</strong>
                  </div>
                  <div>{record.email || t('error:na')}</div>
                </Col>
                <Col {...colProps}>
                  <div>
                    <CalendarTwoTone/>
                    <strong>{t('form:createdAt')}</strong>
                  </div>
                  <div>{tsToLocaleDateTime(+(new Date(record.metadata.creationTime)))}</div>
                </Col>
              </Row>
              <Row {...rowProps}>
                <Col {...colProps}>
                  <EmailVerified data={record}
                                 verification={{
                                   component,
                                   verificationSent,
                                   onSendVerification
                                 }}/>
                </Col>
                <Col {...colProps}>
                  <div>
                    <ControlTwoTone/>
                    <strong>{t('auth:roles')}</strong>
                  </div>
                  <div>
                    {currentRules.map((role, idx) => (
                        <Tag className={styles.rules}
                             style={{marginBottom: 3}}
                             key={`cr.${idx}`}
                             icon={isAdmin([role]) ? (<TeamOutlined/>) :
                                 businessRole ? (<BoldOutlined/>) :
                                     (<UserOutlined/>)}>
                          {role || 'consumer'}
                        </Tag>
                    ))}
                  </div>
                </Col>
                <Col {...colProps}>
                  {handleRoles(record)}
                </Col>
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
    ({authModel, userModel, userRolesModel, loading}) => ({
      authModel,
      userModel,
      userRolesModel,
      loading
    }),
    (dispatch) => ({
      dispatch,
      onRolesQuery() {
        dispatch({type: `userRolesModel/query`});
      },
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
