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
export const campaignMenu = props => {
  const {
    ability,
    isEdit,
    component,
    record,
    intl,
    canUpdate,
    canDelete,
    onDeleteCampaign
  } = props;

  const menuCampaignField = t(intl, 'menu.campaign');

  const editProps = {
    key: 'edit',
    canI: canUpdate,
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
