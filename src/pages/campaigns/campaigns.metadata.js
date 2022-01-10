import React from 'react';
import { Button, Dropdown } from 'antd';
import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import { NavLink } from 'umi';
import { CampaignMenu } from './metadata/campaigns.menu';
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
        title: t('campaign:type'),
        dataIndex: 'translateKeys',
        key: 'translateKeys',
        render(translateKeys, record) {
          return (
              <NavLink to={`/admin/campaigns/${record.id}`}>
                {t(translateKeys.title)}
              </NavLink>
          );
        }
      },
      {
        title: t('campaign:startAt'),
        dataIndex: 'saleInfo',
        key: 'saleInfo',
        render(saleInfo, record) {
          return (
             <>
               {saleInfo.startedAt}
             </>
          );
        }
      },
      {
        title: t('campaign:expiredAt'),
        dataIndex: 'saleInfo',
        key: 'saleInfo',
        render(saleInfo, record) {
          return (
              <>
                {saleInfo.expiredAt}
              </>
          );
        }
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
