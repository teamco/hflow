import React from 'react';
import { Col, Row, Tooltip } from 'antd';
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { NavLink, useIntl } from '@umijs/max';

import { featureMenu } from './metadata/feature.menu';

import { COLORS } from '@/utils/colors';
import { t } from '@/utils/i18n';

import styles from './features.module.less';

import DropdownButton from '@/components/Buttons/dropdown.button';

/**
 * @export
 * @param props
 * @return {*}
 */
export const metadata = (props) => {
  const intl = useIntl();

  const {
    ability,
    loading,
    disabled,
    canUpdate,
    canDelete,
    onDeleteFeature
  } = props;

  const menuProps = { intl, loading, ability, canUpdate, canDelete, onDeleteFeature };

  return {
    width: '100%',
    size: 'middle',
    scroll: { x: 700 },
    columns: [
      {
        title: t(intl, 'feature.info'),
        dataIndex: 'translateKeys',
        key: 'translateKeys',
        render(translateKeys, record) {
          return (
              <div className={styles.example}>
                <NavLink to={`/admin/features/${record?.id}`}>
                  {t(intl, translateKeys.title)}
                </NavLink>
              </div>
          );
        }
      },
      {
        title: (
            <Tooltip title={t(intl, 'price.discounted')}>
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
        title: t(intl, 'feature.type'),
        dataIndex: 'type',
        key: 'type',
        width: 100
      },
      {
        title: t(intl, 'table.action'),
        align: 'center',
        fixed: 'right',
        width: 200,
        render(record) {
          return (
              <div className={styles.nowrap}>
                <DropdownButton key={'manage'}
                                overlay={featureMenu({ record, ...menuProps })}
                                data-testid={'feature-mng'}
                                disabled={disabled}
                                loading={loading}
                                label={t(intl, 'feature.actions.manage')}/>
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
  const { intl } = props;

  return {
    expandedRowRender(record) {
      const rowProps = { gutter: { xs: 8, sm: 16, md: 24, lg: 32 } };
      const colProps = { sm: 12, md: 8, style: { marginTop: 10 } };

      const {
        translateKeys: { description, title },
        price: { currency, discounted, discount, originalPrice, discountedPrice }
      } = record;

      let _offPrice = null;
      if (discounted) {
        _offPrice = `(${discount.value}${discount.type === 'Percent' ? '%' : currency} ${t(intl,
            'feature.translateOff')})`;
      }

      return (
          <div className={styles.featureExpand}>
            <Row {...rowProps}>
              <Col {...colProps}>
                <>
                  <div className={'ant-form-horizontal ant-form-item-label'}>
                    <label>{t(intl, 'price.originalPrice')}</label>
                  </div>
                  <div>{originalPrice}{currency}</div>
                </>
              </Col>
              {discounted && (
                  <>
                    <Col {...colProps}>
                      <div>
                        <div className={'ant-form-horizontal ant-form-item-label'}>
                          <label>{t(intl, 'price.discountedPrice')}</label>
                        </div>
                        <div>{discountedPrice} {_offPrice}</div>
                      </div>
                    </Col>
                    <Col {...colProps}>
                      <div>
                        <div className={'ant-form-horizontal ant-form-item-label'}>
                          <label>
                            {t(intl, 'price.discountDuration')}
                          </label>
                        </div>
                        <div>{discount.duration.period} {discount.duration.type}</div>
                      </div>
                    </Col>
                    <Col {...colProps}>
                      <div>
                        <div className={'ant-form-horizontal ant-form-item-label'}>
                          <label>
                            {t(intl, 'price.discountStartedAt')}
                          </label>
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
