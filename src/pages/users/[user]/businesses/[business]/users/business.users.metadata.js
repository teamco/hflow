import React, {useState} from 'react';
import {
  DeleteTwoTone,
  PauseCircleTwoTone,
  PlayCircleTwoTone,
  SettingOutlined,
  DownOutlined,
  MailTwoTone,
  CalendarTwoTone,
  SyncOutlined
} from '@ant-design/icons';

import {
  Col,
  Row,
  Menu,
  Button,
  Dropdown,
  Popconfirm,
  Tag,
  Tooltip
} from 'antd';

import classnames from 'classnames';
import {tsToLocaleDateTime} from 'utils/timestamp';
import EmailVerified from 'components/Profile/email.verified';

import {getRoleIcon} from 'pages/users/[user]/profile/profile.metadata';
import {COLORS} from 'utils/colors';

import styles from 'pages/users/users.module.less';
import tableStyles from 'components/Main/Table/table.module.less';

/**
 * @export
 * @param t
 * @param data
 * @param loading
 * @param multiple
 * @param onAssignUser
 * @param onUnassignUser
 * @return {*}
 */
export const metadata = ({
  t,
  data,
  loading,
  multiple,
  onAssignUser,
  onUnassignUser
}) => {

  const menu = (record) => (
      <Menu>
        <Menu.Item key={'delete'}
                   icon={<DeleteTwoTone className={tableStyles.action}
                                        twoToneColor={COLORS.danger}/>}>
          <Popconfirm title={t('msg:unassignConfirm', {instance: record.email})}
                      placement={'topRight'}
                      onConfirm={() => onUnassignUser(record)}>
            {t('actions:unassign')}
          </Popconfirm>
        </Menu.Item>
      </Menu>
  );

  return {
    width: '100%',
    size: 'middle',
    columns: [
      {
        title: t('table:name'),
        dataIndex: 'displayName',
        key: 'displayName',
        render(name, data) {
          const {pending, signedIn} = data?.metadata || {};
          const color = signedIn ? COLORS.success : COLORS.disabled;
          const signed = {
            title: t(signedIn ? 'auth:signedIn' : 'auth:signedOut'),
            icon: signedIn ?
                (<PlayCircleTwoTone twoToneColor={color}/>) :
                (<PauseCircleTwoTone twoToneColor={color}/>)
          };

          return (
              <div className={styles.nowrap}>
                <Tooltip title={signed.title}>
                <span className={classnames(styles.signed)}>
                  {signed.icon}
                </span>
                </Tooltip>
                <span>
                  {pending ? (
                          <Tag icon={<SyncOutlined spin/>}
                               color={COLORS.processing}>
                            {t('auth:pending')}
                          </Tag>
                      ) :
                      name}
                </span>
              </div>
          );
        },
        filterable: multiple,
        sortable: multiple
      },
      {
        title: t('auth:roles'),
        dataIndex: ['userRoles'],
        key: 'roles',
        render(currentRoles) {
          return (
              <div>
                {currentRoles.map((role, idx) => (
                    <Tag className={styles.rules}
                         style={{marginBottom: 3}}
                         key={`cr.${idx}`}
                         closable={false}
                         icon={getRoleIcon(role)}>
                      {role}
                    </Tag>
                ))}
              </div>
          );
        }
      },
      {
        title: t('auth:lastSignInTime'),
        dataIndex: 'metadata',
        key: 'lastSignInTime',
        render: metadata => metadata?.pending ? t('error:na') :
            tsToLocaleDateTime(+(new Date(metadata.lastSignInTime)))
      },
      {
        title: t('table:action'),
        render: record => data.length ? (
            <div className={styles.nowrap}>
              <Dropdown overlay={menu(record)}
                        overlayClassName={styles.customActionMenu}
                        key={'custom'}>
                <Button size={'small'}
                        icon={<SettingOutlined/>}
                        className={styles.customAction}>
                  {t('actions:manage', {type: t('menu:users')})} <DownOutlined/>
                </Button>
              </Dropdown>
            </div>
        ) : null
      }
    ],
    loading: loading.effects['userModel/query']
  };
};

/**
 * @export
 * @param props
 * @return {{expandedRowRender, rowExpandable}}
 */
export const expandable = (props) => {
  const {
    t,
    component,
    verificationSent,
    businessRoles,
    onUpdateRole,
    onSendVerification,
    onResendRegisterLink
  } = props;

  const [showSendInvitation, setShowSendInvitation] = useState(true);

  return {
    expandedRowRender(record) {
      const {business = {}, metadata = {}} = record;
      const {userRoles} = business;
      const {pending, invitedAt, creationTime} = metadata;

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
              {pending ? null : (
                  <Col span={8}>
                    <div>
                      <CalendarTwoTone/>
                      <strong>{t('form:createdAt')}</strong>
                    </div>
                    <div>{tsToLocaleDateTime(+(new Date(creationTime)))}</div>
                  </Col>
              )}
              {pending ? (
                  <Col span={8}>
                    <div>
                      <CalendarTwoTone/>
                      <strong>{t('form:invitedAt')}</strong>
                    </div>
                    <div>
                      {tsToLocaleDateTime(invitedAt)}
                      {showSendInvitation && (
                          <div className={styles.verification}
                               onClick={() => {
                                 onResendRegisterLink(record);
                                 setShowSendInvitation(false);
                               }}>
                            {t('auth:reSendRegisterLink')}
                          </div>
                      )}
                    </div>
                  </Col>
              ) : null}
            </Row>
            {pending ? null : (
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
                </Row>
            )}
          </div>
      );
    },
    rowExpandable: record => true
  };
};
