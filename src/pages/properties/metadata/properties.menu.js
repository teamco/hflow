import React from 'react';
import { NavLink } from '@umijs/max';
import { Popconfirm } from 'antd';
import { DeleteTwoTone, ShoppingCartOutlined } from '@ant-design/icons';

import { abilityMenuItem } from '@/utils/abilityComponent/abilityMenuItem';
import { COLORS } from '@/utils/colors';
import { t } from '@/utils/i18n';

import tableStyles from '@/components/Main/Table/table.module.less';

/**
 * @export
 * @param props
 * @return {*[]}
 */
export const propertyMenu = props => {
  const {
    ability,
    isEdit,
    component,
    record,
    intl,
    onDeleteCampaign
  } = props;

  const canEdit = ability.can('edit', component);
  const canDelete = ability.can('delete', component);

  const menuCampaignField = t(intl, 'menu.campaign');

  const editProps = {
    key: 'edit',
    canI: canEdit,
    divider: true,
    icon: <ShoppingCartOutlined className={tableStyles.action}
                                twoToneColor={COLORS.success}/>,
    children: (
        <NavLink to={`/admin/campaigns/${record?.id}`}>
          {t(intl, 'campaigns.actions.edit')}
        </NavLink>
    )
  };

  const deleteProps = {
    key: 'delete',
    canI: canDelete,
    icon: <DeleteTwoTone className={tableStyles.action}
                         twoToneColor={COLORS.danger}/>,
    children: (
        <Popconfirm title={t(intl, 'msg.deleteConfirm', { instance: menuCampaignField })}
                    placement={'topRight'}
                    disabled={!canDelete}
                    onConfirm={() => onDeleteCampaign(record)}>
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
