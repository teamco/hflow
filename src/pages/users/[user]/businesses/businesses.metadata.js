import React from 'react';
import {NavLink, useParams} from 'umi';
import classnames from 'classnames';
import {Can} from 'utils/auth/can';
import {Button, Dropdown, Tooltip} from 'antd';
import {
  UserAddOutlined,
  ProfileTwoTone,
  ShopTwoTone,
  SettingOutlined,
  DownOutlined
} from '@ant-design/icons';

import {tsToLocaleDateTime} from 'utils/timestamp';
import {COLORS} from 'utils/colors';

import BusinessMenu from './metadata/business.menu';

import styles from 'pages/users/users.module.less';
import tableStyles from 'components/Main/Table/table.module.less';
import menuStyles from 'components/menu.less';

export const metadata = ({
  t,
  data,
  user,
  ability,
  loading,
  multiple,
  onDeleteBusiness,
  onHoldBusiness,
  onActivateBusiness
}) => {

  const params = useParams();
  const menuProps = {
    isEdit: true,
    loading,
    params,
    onActivateBusiness,
    onHoldBusiness,
    onDeleteBusiness
  };

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
        render(name, data) {
          return (
              <div className={classnames(styles.nowrap, tableStyles.tdName)}>
                <span>
                  {data.logo ?
                      <img src={data.logo} alt={name}/> :
                      <ShopTwoTone/>
                  }
                </span>
                <NavLink to={`/admin/users/${user}/businesses/${data.id}`}>
                  <Tooltip title={name}>{name}</Tooltip>
                </NavLink>
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
        title: t('business:type'),
        dataIndex: 'businessType',
        key: 'businessType',
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
                </Can>
                <Dropdown overlay={<BusinessMenu {...menuProps} />}
                          trigger={['click']}
                          overlayClassName={menuStyles.customActionMenu}
                          key={'custom'}>
                  <Button size={'small'}
                          icon={<SettingOutlined/>}
                          className={menuStyles.customAction}>
                    {t('actions:manage', {type: t('business')})} <DownOutlined/>
                  </Button>
                </Dropdown>
              </div>
          ) : null;
        }
      }
    ]
  };
};
