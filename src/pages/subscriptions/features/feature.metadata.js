import React from 'react';
import { Button, Col, Dropdown, Form, Row, Switch, Tooltip } from 'antd';
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  DownOutlined,
  SettingOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { NavLink, useIntl } from 'umi';

import { FeatureMenu } from './metadata/feature.menu';

import styles from './features.module.less';
import menuStyles from '@/components/menu.less';
import { COLORS } from '@/utils/colors';

/**
 * @export
 * @param t
 * @param ability
 * @param loading
 * @return {*}
 */
export const metadata = ({ t, ability, loading }) => {
  const intl = useIntl();
  const menuProps = { t, loading, ability };

  return {
    width: '100%',
    size: 'middle',
    scroll: { x: 700 },
    columns: [
      {
        title: intl.formatMessage({id: 'feature.info', defaultMessage: 'Feature Info'}),
        dataIndex: 'translateKeys',
        key: 'translateKeys',
        render(translateKeys, record) {
          return (
              <div className={styles.example}>
                <NavLink to={`/admin/features/${record.id}`}>
                  {intl.formatMessage({id: translateKeys.title, defaultMessage: ''})}
                </NavLink>
              </div>
          );
        }
      },
      {
        title: (
            <Tooltip title={intl.formatMessage({id: 'price.discounted', defaultMessage: 'Is Discounted?'})}>
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
        title: intl.formatMessage({id: 'feature.type', defaultMessage: 'Type'}),
        dataIndex: 'type',
        key: 'type',
        width: 100
      },
      {
        title: intl.formatMessage({id: 'feature.status', defaultMessage: 'Default State'}),
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
                        checkedChildren={intl.formatMessage({id: translateKeys.on, defaultMessage: ''})}
                        unCheckedChildren={intl.formatMessage({id: translateKeys.off, defaultMessage: ''})}/>
              </div>
          );
        }
      },
      {
        title: intl.formatMessage({id: 'table.action', defaultMessage: 'Action'}),
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
                    {intl.formatMessage({id: 'feature.actions.manage', defaultMessage: 'Manage Feature' })} <DownOutlined/>
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

      const {
        translateKeys: { description, off, on, title },
        price: { currency, discounted, discount, originalPrice, discountedPrice }
      } = record;

      let _offPrice = null;
      if (discounted) {
        _offPrice = `(${discount.value}${discount.type === 'Percent' ? '%' : currency} ${intl.formatMessage({id: 'feature.translateOff', defaultMessage: 'Off'})})`;
      }

      return (
          <div className={styles.featureExpand}>
            <Row {...rowProps}>
              <Col {...colProps}>
                <Form layout={'vertical'}>
                  <Form.Item label={intl.formatMessage({id: title})}
                             tooltip={intl.formatMessage({id: description})}>
                    <Switch checkedChildren={intl.formatMessage({id: on, defaultMessage: 'On'})}
                            unCheckedChildren={intl.formatMessage({id: off, defaultMessage: 'Off'})}/>
                  </Form.Item>
                </Form>
              </Col>
              <Col {...colProps}>
                <>
                  <div className={'ant-form-horizontal ant-form-item-label'}>
                    <label>{intl.formatMessage({id: 'price.originalPrice', defaultMessage: 'Original Price'})}</label>
                  </div>
                  <div>{originalPrice}{currency}</div>
                </>
              </Col>
              {discounted && (
                  <>
                    <Col {...colProps}>
                      <div>
                        <div className={'ant-form-horizontal ant-form-item-label'}>
                          <label>{intl.formatMessage({id: 'price.discountedPrice', defaultMessage: 'Discounted Price'})}</label>
                        </div>
                        <div>{discountedPrice} {_offPrice}</div>
                      </div>
                    </Col>
                    <Col {...colProps}>
                      <div>
                        <div className={'ant-form-horizontal ant-form-item-label'}>
                          <label>{intl.formatMessage({id: 'price.discountDuration', defaultMessage: 'Discount Duration'})}</label>
                        </div>
                        <div>{discount.duration.period} {discount.duration.type}</div>
                      </div>
                    </Col>
                    <Col {...colProps}>
                      <div>
                        <div className={'ant-form-horizontal ant-form-item-label'}>
                          <label>{intl.formatMessage({id: 'price.discountStartedAt', defaultMessage: 'Started at'})}</label>
                        </div>
                        <div>{discount.startedAt}</div>
                      </div>
                    </Col>
                  </>
              )}
            </Row>
          </div>
      );
    },
    rowExpandable: record => true
  };
};
