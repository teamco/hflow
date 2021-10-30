import React from 'react';
import {NavLink, useParams} from 'umi';
import classnames from 'classnames';
import {Can} from 'utils/auth/can';
import {Tooltip} from 'antd';
import {
  UserAddOutlined,
  ProfileTwoTone,
  EyeTwoTone,
  ShopTwoTone
} from '@ant-design/icons';

import {tsToLocaleDateTime} from 'utils/timestamp';
import {COLORS} from 'utils/colors';

import styles from 'pages/users/users.module.less';
import tableStyles from 'components/Main/Table/table.module.less';

export const metadata = ({
  t,
  data,
  ability,
  loading,
  multiple,
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
        filterable: multiple,
        sortable: multiple,
        render(name, data, idx) {
          return (
              <div className={classnames(styles.nowrap, tableStyles.tdName)}>
                <span>
                  {data.logo ?
                      <img src={data.logo} alt={name}/> :
                      <ShopTwoTone/>
                  }
                </span>
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
        filterable: multiple,
        sortable: multiple
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
                                      twoToneColor={COLORS.success}/>
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
                                    twoToneColor={COLORS.success}/>
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
