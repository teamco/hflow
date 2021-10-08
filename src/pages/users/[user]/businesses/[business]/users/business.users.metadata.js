import React from 'react';
import {
  DeleteTwoTone,
  PauseCircleTwoTone,
  PlayCircleTwoTone,
  SettingOutlined,
  DownOutlined,
  MailTwoTone,
  CalendarTwoTone,
  ControlTwoTone
} from '@ant-design/icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBook, faDonate, faUserCog} from '@fortawesome/free-solid-svg-icons';
import {
  Col,
  Row,
  Menu,
  Button,
  Dropdown,
  Popconfirm,
  Select,
  Tag,
  Tooltip
} from 'antd';

import classnames from 'classnames';
import { tsToLocaleDateTime } from 'utils/timestamp';
import EmailVerified from 'components/Profile/email.verified';
import {isContributor, isModerator, isOwner} from 'services/userRoles.service';
import {Can} from 'utils/auth/can';

import styles from 'pages/users/users.module.less';
import tableStyles from 'components/Main/Table/table.module.less';

const {Option} = Select;

/**
 * @export
 * @param t
 * @param data
 * @param loading
 * @param many
 * @param onAssignUser
 * @param onUnassignUser
 * @return {*}
 */
export const metadata = ({
  t,
  data,
  loading,
  many,
  onAssignUser,
  onUnassignUser
}) => {

  const menu = (record) => (
    <Menu>
      <Menu.Item key={'delete'}
                 icon={<DeleteTwoTone className={tableStyles.action}
                                      twoToneColor='#eb2f96' />}>
        <Popconfirm title={t('msg:unassignConfirm', { instance: record.email })}
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
          const isSignedIn = data.metadata.signedIn;
          const color = isSignedIn ? '#52c41a' : '#999999';
          const signed = {
            title: t(isSignedIn ? 'auth:signedIn' : 'auth:signedOut'),
            icon: isSignedIn ?
              (<PlayCircleTwoTone twoToneColor={color} />) :
              (<PauseCircleTwoTone twoToneColor={color} />)
          };

          return (
            <div className={styles.nowrap}>
              <Tooltip title={signed.title}>
                <span className={classnames(styles.signed)}>
                  {signed.icon}
                </span>
              </Tooltip>
              <span>{name}</span>
            </div>
          );
        },
        filterable: many,
        sortable: many
      },
      {
        title: t('auth:roles'),
        dataIndex: ['business', 'userRoles'],
        key: 'roles'
      },
      {
        title: t('auth:lastSignInTime'),
        dataIndex: 'metadata',
        key: 'lastSignInTime',
        render: metadata => tsToLocaleDateTime(+(new Date(metadata.lastSignInTime)))
      },
      {
        title: t('table:action'),
        render: record => data.length ? (
          <div className={styles.nowrap}>
            <Dropdown overlay={menu(record)}
                      overlayClassName={styles.customActionMenu}
                      key={'custom'}>
              <Button size={'small'}
                      icon={<SettingOutlined />}
                      className={styles.customAction}>
                {t('actions:manage', { type: t('menu:users') })} <DownOutlined />
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
    businessRoles,
    onUpdateRole
  } = props;

  return {
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
}
