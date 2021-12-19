import React from 'react';
import { Button, Dropdown, Form, Switch } from 'antd';
import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import { NavLink } from 'umi';

import { PreferenceMenu } from './metadata/preference.menu';

import styles from './subscriptionPrefs.module.less';
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
    scroll: { x: 600, y: 500 },
    columns: [
      {
        title: t('preference:example'),
        dataIndex: 'translateKeys',
        key: 'translateKeys',
        render(translateKeys, record) {
          return (
              <div className={styles.example}>
                <Form.Item tooltip={t(translateKeys.description)}
                           label={(
                               <NavLink to={`/admin/subscriptionPrefs/${record.id}`}>
                                 {t(translateKeys.title)}
                               </NavLink>
                           )}>
                  <Switch checkedChildren={t(translateKeys.on)}
                          unCheckedChildren={t(translateKeys.off)}/>
                </Form.Item>
              </div>
          );
        }
      },
      {
        title: t('preference:status'),
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
                <Dropdown overlay={<PreferenceMenu record={record} {...menuProps} />}
                          trigger={['click']}
                          overlayClassName={menuStyles.customActionMenu}
                          key={'custom'}>
                  <Button size={'small'}
                          icon={<SettingOutlined/>}
                          className={menuStyles.customAction}>
                    {t('actions:manage', { type: t('menu:preference') })} <DownOutlined/>
                  </Button>
                </Dropdown>
              </div>
          );
        }
      }
    ]
  };
};
