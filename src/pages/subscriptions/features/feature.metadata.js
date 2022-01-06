import React from 'react';
import { Button, Col, Dropdown, Row, Switch, Tooltip } from 'antd';
import {
  DownOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone
} from '@ant-design/icons';
import { NavLink } from 'umi';

import { FeatureMenu } from './metadata/feature.menu';

import styles from './features.module.less';
import menuStyles from 'components/menu.less';
import { COLORS } from '@/utils/colors';

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
    scroll: { x: 670 },
    columns: [
      {
        title: t('feature:info'),
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
        title: (
            <Tooltip title={t('price:discounted')}>
              <ShoppingCartOutlined/>
            </Tooltip>
        ),
        dataIndex: 'price',
        key: 'price',
        width: 70,
        align: 'center',
        render(price) {
          return price.discounted ?
              <CheckCircleTwoTone twoToneColor={COLORS.success}/> :
              <CloseCircleTwoTone twoToneColor={COLORS.disabled}/>;
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

/**
 * @export
 * @param props
 * @return {JSX.Element|{expandedRowRender(*): *, rowExpandable: (function(*): boolean)}}
 */
export const expandableFeature = (props) => {
  const { t } = props;
  return {
    expandedRowRender(record) {
      const rowProps = { gutter: { xs: 8, sm: 16, md: 24, lg: 32 } };
      const colProps = { sm: 12, md: 8, style: { marginTop: 10 } };

      return (
          <div className={styles.featureExpand}>
            <Row {...rowProps}>
              <Col {...colProps}>

              </Col>
            </Row>
          </div>
      );
    },
    rowExpandable: record => true
  };
};
