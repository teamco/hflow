import React from 'react';
import { DeleteTwoTone, ShoppingCartOutlined } from '@ant-design/icons';
import { NavLink, useIntl } from 'umi';
import { Menu, Popconfirm } from 'antd';
import { withTranslation } from 'react-i18next';

import { abilityMenuItem } from '@/utils/abilityComponent/abilityMenuItem';
import { COLORS } from '@/utils/colors';

import tableStyles from '@/components/Main/Table/table.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const SubscriptionMenu = props => {
  const intl = useIntl();
  const {
    ability,
    isEdit,
    component,
    record,
    onDeleteSubscription
  } = props;

  const canEdit = ability.can('edit', component);
  const canDelete = ability.can('delete', component);

  const editProps = {
    key: 'edit',
    canI: canEdit,
    icon: <ShoppingCartOutlined className={tableStyles.action}
                                twoToneColor={COLORS.success} />,
    children: (
        <NavLink to={`/admin/subscriptions/${record.id}`}>
          {intl.formatMessage({id: 'actions.edit', defaultMessage: 'Edit Subscriptions'})}
        </NavLink>
    )
  };

  const deleteProps = {
    key: 'delete',
    canI: canDelete,
    icon: <DeleteTwoTone className={tableStyles.action}
                         twoToneColor={COLORS.danger} />,
    children: (
        <Popconfirm title={intl.formatMessage({id: 'subscription.msg.deleteConfirm', defaultMessage: '"Are you sure' +
              ' to' +
              ' delete this subscription'})}
                    placement={'topRight'}
                    onConfirm={() => onDeleteSubscription(record)}>
          {intl.formatMessage({id: 'actions.delete', defaultMessage: "Delete"})}
        </Popconfirm>
    )
  };

  return (
      <Menu>
        {!isEdit && (
            <>
              {abilityMenuItem(editProps)}
              <Menu.Divider key={'divider'} />
            </>
        )}
        {abilityMenuItem(deleteProps)}
      </Menu>
  );
};

export default withTranslation()(SubscriptionMenu);
