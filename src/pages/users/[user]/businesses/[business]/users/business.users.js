import EmailVerified from 'components/Profile/email.verified';
import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { useParams } from 'umi';
import { withTranslation } from 'react-i18next';
import { Button, Col, PageHeader, Row, Tag, Select, Menu } from 'antd';
import {
  CalendarTwoTone,
  ControlTwoTone,
  MailTwoTone,
  UserAddOutlined,
  UserOutlined
} from '@ant-design/icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDonate, faUserCog, faBook } from '@fortawesome/free-solid-svg-icons';

import Page from 'components/Page';
import Main from 'components/Main';

import RegisterUser from 'pages/users/[user]/businesses/[business]/users/register.user';
import { metadata } from 'pages/users/[user]/businesses/[business]/users/business.users.metadata';
import { Can } from 'utils/auth/can';
import { fromForm } from 'utils/object';
import { tsToLocaleDateTime } from 'utils/timestamp';
import { isContributor, isModerator, isOwner } from 'services/business.service';

import styles from 'pages/users/users.module.less';

const { Table } = Main;
const { Option } = Select;

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const businessUsers = (props) => {
  const {
    t,
    businessModel,
    userRolesModel,
    loading,
    onQuery,
    onUpdateRole,
    onAssignUser,
    onUnassignUser
  } = props;

  let {
    users = [],
    assignedUsers = []
  } = businessModel;

  let {
    entityForm
  } = userRolesModel;

  /**
   * @type {{user, business}}
   */
  const params = useParams();

  const [isRegisterVisible, setIsRegisterVisible] = useState(false);

  useEffect(() => {
    onQuery(params);
  }, []);

  const businessRoles = fromForm(entityForm, 'tags') || [];

  const tableProps = {
    expandable: {
      expandedRowRender(record) {
        const { userRoles } = record.business;

        return (
          <div className={styles.profileExpand}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div>
                  <MailTwoTone />
                  <strong>{t('auth:email')}</strong>
                </div>
                <div>{record.email || t('error:na')}</div>
              </Col>
              <Col span={8}>
                <div>
                  <CalendarTwoTone />
                  <strong>{t('form:createdAt')}</strong>
                </div>
                <div>{tsToLocaleDateTime(+(new Date(record.metadata.creationTime)))}</div>
              </Col>
              <Col span={8} />
            </Row>
            <Row gutter={[16, 16]}
                 style={{ marginTop: 10 }}>
              <Col span={8}>
                <EmailVerified data={record}
                               verification={{ component: 'users' }} />
              </Col>
              <Col span={8}>
                <div>
                  <ControlTwoTone />
                  <strong>{t('auth:roles')}</strong>
                </div>
                <div>
                  <Can I={'update'} a={'businessUserRole'}>
                    <Select defaultValue={userRoles}
                            onChange={role => onUpdateRole(params, record, role)}
                            style={{ width: 150 }}
                            size={'small'}>
                      {businessRoles.map(role => (
                        <Option key={role}
                                disabled={isOwner(role)}
                                value={role}>
                          {role}
                        </Option>
                      ))}
                    </Select>
                  </Can>
                  <Can not I={'update'} a={'businessUserRole'}>
                    <Tag className={styles.rules}
                         icon={
                           isModerator(userRoles) ? (<FontAwesomeIcon icon={faUserCog} />) :
                             isContributor(userRoles) ? (<FontAwesomeIcon icon={faDonate} />) :
                               (<FontAwesomeIcon icon={faBook} />)}>
                      {userRoles}
                    </Tag>
                  </Can>
                </div>
              </Col>
              <Col span={8} />
            </Row>
          </div>
        );
      },
      rowExpandable: record => true
    }
  };

  const registerProps = {
    isRegisterVisible,
    setIsRegisterVisible
  };

  const subTitle = (
    <>
      <UserOutlined style={{ marginRight: 10 }} />
      {t('actions:manage', { type: t('business:users') })}
    </>
  );

  return (
    <Page className={styles.users}
          component={'businessUsers'}
          spinEffects={[
            'businessModel/usersQuery',
            'userRolesModel/query'
          ]}>
      <PageHeader ghost={false}
                  subTitle={subTitle}
                  extra={[
                    <Button key={'add'}
                            size={'small'}
                            icon={<UserAddOutlined />}
                            onClick={() => {
                              setIsRegisterVisible(true);
                            }}
                            type={'primary'}>
                      {t('actions:addNew', { type: t('auth:user') })}
                    </Button>
                  ]} />
      <Table data={assignedUsers}
             {...tableProps}
             {...metadata({
               t,
               data: assignedUsers,
               many: true,
               loading,
               onAssignUser,
               onUnassignUser
             })} />
      <RegisterUser {...registerProps} />
    </Page>
  );
};

export default connect(
  ({ businessModel, userRolesModel, loading }) => {
    return {
      businessModel,
      userRolesModel,
      loading
    };
  },
  (dispatch) => ({
    dispatch,
    onQuery(params) {
      dispatch({ type: `businessModel/usersQuery`, payload: { ...params } });
      dispatch({ type: `userRolesModel/query` });
    },
    onUpdateRole(params, user, role) {
      dispatch({ type: `businessModel/updateUserRole`, payload: { params, user, role } });
    },
    onAssignUser(user) {
      dispatch({ type: `businessModel/assignUser`, payload: { user } });
    },
    onUnassignUser(user) {
      dispatch({ type: `businessModel/unassignUser`, payload: { user } });
    }
  })
)(withTranslation()(businessUsers));
