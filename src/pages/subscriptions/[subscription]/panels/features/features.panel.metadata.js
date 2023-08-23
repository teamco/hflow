import React from 'react';
import { Tooltip } from 'antd';
import {
  ApiTwoTone,
  ApiOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import classnames from 'classnames';

import { COLORS } from '@/utils/colors';
import { stub } from '@/utils/function';

import AssignButton from '@/components/Buttons/assign.button';

import styles from '@/components/Main/Table/table.module.less';
import { t } from '@/utils/i18n';

/**
 * @export
 * @param props
 * @return {*}
 */
export const metadata = (props) => {
  const {
    ability,
    disabled,
    loading,
    assignedFeatures = [],
    onAssign = stub,
    onAssignAll = stub,
    features = []
  } = props;

  const intl = useIntl();

  /**
   * @constant
   * @param record
   * @returns {boolean}
   */
  const isAssigned = (record) => assignedFeatures.includes(record.id);

  /**
   * @constant
   * @return {boolean}
   */
  const isAssignedAll = () => features.length === assignedFeatures.length;

  return {
    width: '100%',
    size: 'middle',
    scroll: { x: 500 },
    columns: [
      {
        title: (
            <Tooltip title={t(intl, 'feature.assigned')}>
              <ApiOutlined/>
            </Tooltip>
        ),
        width: 50,
        align: 'center',
        render(record) {
          return isAssigned(record) ? <ApiTwoTone twoToneColor={COLORS.danger}/> : null;
        }
      },
      {
        title: t(intl, 'feature.info'),
        dataIndex: 'translateKeys',
        key: 'translateKeys',
        render(translateKeys, record) {
          return (
              <span className={classnames(styles.name)}
                    style={{
                      padding: '2px 5px',
                      borderRadius: 3,
                      fontWeight: isAssigned(record) ? 'bold' : 'normal'
                    }}>
                {t(intl, translateKeys.title)}
              </span>
          );
        }
      },
      {
        title: (
            <Tooltip title={t(intl, 'price.price')}>
              <ShoppingCartOutlined/>
            </Tooltip>
        ),
        dataIndex: 'price',
        key: 'price',
        width: 70,
        align: 'center',
        render(price) {
          return `${price.originalPrice} ${price.currency}`;
        }
      },
      {
        title: (
            <AssignButton loading={loading}
                          disabled={disabled || features.error}
                          spinOn={[`subscriptionModel/assignFeature`]}
                          behavior={{
                            all: true,
                            isAssignedAll,
                            confirm: t(intl, 'subscription.msg.unAssignAllConfirm')
                          }}
                          onClick={() => onAssignAll(isAssignedAll())}/>
        ),
        align: 'center',
        fixed: 'right',
        width: 150,
        render(record) {
          return (
              <AssignButton loading={loading}
                            disabled={disabled}
                            spinOn={[`subscriptionModel/assignFeature`]}
                            behavior={{
                              record,
                              all: false,
                              isAssigned: isAssigned(record),
                              confirm: t(intl, 'subscription.msg.unAssignConfirm')
                            }}
                            onClick={onAssign}/>
          );
        }
      }
    ]
  };
};