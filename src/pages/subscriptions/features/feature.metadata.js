import React from 'react';
import { Button, Dropdown, Form, Switch } from 'antd';
import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import { NavLink } from 'umi';

import { FeatureMenu } from './metadata/feature.menu';

import styles from './features.module.less';
import menuStyles from 'components/menu.less';

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
        title: t('feature:example'),
        dataIndex: 'translateKeys',
        key: 'translateKeys',
        render(translateKeys, record) {
          return (
              <div className={styles.example}>
                <NavLink to={`/admin/features/${record.id}`}>
                  {t(translateKeys.title)}
                </NavLink>
              </div>
          );
        }
      },
      {
        title: t('feature:type'),
        dataIndex: 'type',
        key: 'type',
        width: 100
      },
      {
        title: t('feature:status'),
        dataIndex: 'selectedByDefault',
        key: 'selectedByDefault',
        align: 'center',
        width: 150,
        render(selectedByDefault, record) {
          const { translateKeys } = record;
          return (
              <div className={styles.example}>
                <Switch defaultChecked={selectedByDefault}
                        disabled
                        size={'small'}
                        checkedChildren={t(translateKeys.on)}
                        unCheckedChildren={t(translateKeys.off)}/>
              </div>
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
                <Dropdown overlay={<FeatureMenu record={record} {...menuProps} />}
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
