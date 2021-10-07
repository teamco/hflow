import EmailVerified from 'components/Profile/email.verified';
import React, {useEffect, useState} from 'react';
import {useParams} from 'umi';
import {Button, Col, PageHeader, Row, Tag, Select, Menu} from 'antd';
import {
  CalendarTwoTone,
  ControlTwoTone,
  MailTwoTone,
  UserAddOutlined,
  UserOutlined
} from '@ant-design/icons';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDonate, faUserCog, faBook} from '@fortawesome/free-solid-svg-icons';

import Page from 'components/Page';
import Main from 'components/Main';

import RegisterUser from 'pages/users/[user]/businesses/[business]/users/register.user';
import {metadata} from 'pages/users/[user]/businesses/[business]/users/business.users.metadata';
import {Can} from 'utils/auth/can';
import {fromForm} from 'utils/object';
import {tsToLocaleDateTime} from 'utils/timestamp';
import {isContributor, isModerator, isOwner} from 'services/userRoles.service';

import styles from 'pages/users/users.module.less';

const {Table} = Main;
const {Option} = Select;

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
export const businessUsers = (props) => {
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
        const {userRoles} = record.business;

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
                                 verification={{component: 'users'}}/>
                </Col>
                <Col span={8}>
                  <div>
                    <ControlTwoTone/>
                    <strong>{t('auth:roles')}</strong>
                  </div>
                  <div>
                    <Can I={'update'} a={'businessUserRole'}>
                      <Select defaultValue={userRoles}
                              onChange={role => onUpdateRole(params, record, role)}
                              style={{width: 150}}
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
                             isModerator(userRoles) ? (<FontAwesomeIcon icon={faUserCog}/>) :
                                 isContributor(userRoles) ? (<FontAwesomeIcon icon={faDonate}/>) :
                                     (<FontAwesomeIcon icon={faBook}/>)}>
                        {userRoles}
                      </Tag>
                    </Can>
                  </div>
                </Col>
                <Col span={8}/>
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
        <UserOutlined style={{marginRight: 10}}/>
        {t('actions:manage', {type: t('business:users')})}
      </>
  );

  const component = 'businessUsers';

  return (
      <Page className={styles.users}
            component={component}
            spinEffects={[
              'businessModel/usersQuery',
              'userRolesModel/query'
            ]}>
        <PageHeader ghost={false}
                    subTitle={subTitle}
                    extra={[
                      <Can I={'assign'} a={component} key={'add'}>
                        <Button size={'small'}
                                icon={<UserAddOutlined />}
                                onClick={() => {
                                  setIsRegisterVisible(true);
                                }}
                                type={'primary'}>
                          {t('actions:addNew', {type: t('auth:user')})}
                        </Button>
                      </Can>
                    ]}/>
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
