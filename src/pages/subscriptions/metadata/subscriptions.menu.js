import React from 'react';
import { DeleteTwoTone, ShoppingCartOutlined } from '@ant-design/icons';
import { NavLink } from '@umijs/max';
import { Popconfirm } from 'antd';

import { abilityMenuItem } from '@/utils/abilityComponent/abilityMenuItem';
import { COLORS } from '@/utils/colors';
import { t } from '@/utils/i18n';

import tableStyles from '@/components/Main/Table/table.module.less';

/**
 * @export
 * @param props
 * @return {*[]}
 */
export const subscriptionMenu = props => {
  const {
    ability,
    isEdit,
    component,
    record,
    intl,
    canUpdate,
    canDelete,
    onDeleteSubscription
  } = props;

  const subType = 'Subscriptions';

  const editProps = {
    key: 'edit',
    canI: canUpdate,
    divider: true,
    icon: <ShoppingCartOutlined className={tableStyles.action}
                                twoToneColor={COLORS.success}/>,
    children: (
        <NavLink to={`/admin/subscriptions/${record?.id}`}>
          {t(intl, 'actions.edit', { type: subType })}
        </NavLink>
    )
  };

  const deleteProps = {
    key: 'delete',
    canI: canDelete,
    icon: <DeleteTwoTone className={tableStyles.action}
                         twoToneColor={COLORS.danger}/>,
    children: (
        <Popconfirm title={t(intl, 'subscription.msg.deleteConfirm')}
                    placement={'topRight'}
                    disabled={!canDelete}
                    onConfirm={() => onDeleteSubscription(record)}>
          {t(intl, 'actions.delete')}
        </Popconfirm>
    )
  };

  const editItems = isEdit ? [] : [...abilityMenuItem(editProps)];

  return [
    ...editItems,
    ...abilityMenuItem(deleteProps)
  ];
};
