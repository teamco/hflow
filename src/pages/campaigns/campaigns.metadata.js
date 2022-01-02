import React from 'react';
import { Button, Dropdown } from 'antd';
import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import { NavLink } from 'umi';

import menuStyles from 'components/menu.less';
import styles from './campaigns.module.less';

/**
 * @export
 * @param t
 * @param ability
 * @param loading
 * @return {*}
 */
export const metadata = ({
  t,
  ability,
  loading
}) => {

  const menuProps = { t, loading, ability };

  return {
    width: '100%',
    size: 'middle',
    scroll: { x: 600 },
    columns: [
      {
        title: t('subscription:type'),
        dataIndex: 'subscriptionType',
        key: 'subscriptionType',
        render(subscriptionType, record) {
          return (
              <NavLink to={`/admin/campaigns/${record.id}`}>
                {subscriptionType}
              </NavLink>
          );
        }
      },
      {
        title: t('campaign:feature'),
        dataIndex: 'features',
        key: 'features',
        width: 100
      },
      {
        title: t('campaign:startAt'),
        dataIndex: 'startAt',
        key: 'startAt',
        align: 'center',
        width: 150
      },
      {
        title: t('table:action'),
        align: 'center',
        fixed: 'right',
        width: 200,
        render(record) {
          return (
              <div className={styles.nowrap}>
                <Dropdown overlay={<CampaignMenu record={record} {...menuProps} />}
                          trigger={['click']}
                          overlayClassName={menuStyles.customActionMenu}
                          key={'custom'}>
                  <Button size={'small'}
                          icon={<SettingOutlined/>}
                          className={menuStyles.customAction}>
                    {t('actions:manage', { type: t('menu:feature') })} <DownOutlined/>
                  </Button>
                </Dropdown>
              </div>
          );
        }
      }
    ]
  };
};
