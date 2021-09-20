import React from 'react';
import {NavLink, useParams} from 'umi';
import {Can} from 'utils/auth/can';
import {Tooltip} from 'antd';
import {UserAddOutlined, ProfileTwoTone, EyeTwoTone} from '@ant-design/icons';
import {tsToLocaleDateTime} from 'utils/timestamp';

import tableStyles from 'components/Main/Table/table.module.less';
import styles from 'pages/users/users.module.less';
import classnames from 'classnames';

export const metadata = ({
  t,
  data,
  ability,
  loading,
  many,
  onDeleteBusiness,
  onHoldBusiness,
  onActivateBusiness
}) => {

  const params = useParams();

  return {
    width: '100%',
    size: 'middle',
    columns: [
      {
        title: t('table:name'),
        dataIndex: 'name',
        key: 'name',
        filterable: many,
        sortable: many,
        render(name, data, idx) {
          return (
              <div className={classnames(styles.nowrap, tableStyles.tdName)}>
                <span><img src={data.logo} alt={name}/></span>
                <span>
                  <Tooltip title={name}>{name}</Tooltip>
                </span>
              </div>
          );
        }
      },
      {
        title: t('auth:email'),
        dataIndex: 'email',
        key: 'email',
        filterable: many,
        sortable: many
      },
      {
        title: t('form:updatedAt'),
        dataIndex: 'metadata',
        key: 'metadata.updatedAt',
        render: metadata => tsToLocaleDateTime(metadata.updatedAt)
      },
      {
        title: t('table:action'),
        render(record) {
          return data.length ? (
              <div className={styles.nowrap}>
                <Can I={'update'} a={'businesses'}>
                  <Tooltip title={t('actions:edit', {type: t('menu:business')})}>
                    <NavLink to={`/admin/users/${params.user}/businesses/${record.id}`}>
                      <ProfileTwoTone className={tableStyles.action}
                                      twoToneColor={'#52c41a'}/>
                    </NavLink>
                  </Tooltip>
                  <Tooltip title={t('actions:manage', {type: t('auth:users')})}>
                    <NavLink to={`/admin/users/${params.user}/businesses/${record.id}/users`}>
                      <UserAddOutlined className={tableStyles.action}/>
                    </NavLink>
                  </Tooltip>
                </Can>
                <Can not I={'update'} a={'businesses'}>
                  <Can I={'read'} a={'businesses'}>
                    <Tooltip title={t('actions:show', {type: t('menu:business')})}>
                      <NavLink to={`/admin/users/${params.user}/businesses/${record.id}`}>
                        <EyeTwoTone className={tableStyles.action}
                                    twoToneColor={'#52c41a'}/>
                      </NavLink>
                    </Tooltip>
                  </Can>
                </Can>
              </div>
          ) : null;
        }
      }
    ]
  };
};
