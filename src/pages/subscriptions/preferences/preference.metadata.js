import React from 'react';
import { Button, Dropdown, Form, Switch } from 'antd';
import { DownOutlined, SettingOutlined } from '@ant-design/icons';

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
        dataIndex: 'translate',
        key: 'translate',
        render(translate) {
          return (
              <div className={styles.example}>
                <Form.Item label={t(translate.title)}
                           tooltip={t(translate.description)}>
                  <Switch checkedChildren={t(translate.on)}
                          unCheckedChildren={t(translate.off)}/>
                </Form.Item>
              </div>
          );
        }
      },
      {
        title: t('preference:status'),
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 150,
        render(status, record) {
          const { translate } = record;
          return (
              <div className={styles.example}>
                <Switch defaultChecked={status}
                        disabled
                        checkedChildren={t(translate.on)}
                        unCheckedChildren={t(translate.off)}/>
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
                    {t('actions:manage', { type: t('subscription:feature') })} <DownOutlined/>
                  </Button>
                </Dropdown>
              </div>
          );
        }
      }
    ]
  };
};
