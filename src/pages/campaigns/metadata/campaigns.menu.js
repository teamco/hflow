import React from 'react';
import { withTranslation } from 'react-i18next';
import { NavLink, useIntl } from 'umi';
import { Menu, Popconfirm } from 'antd';
import { DeleteTwoTone, ShoppingCartOutlined } from '@ant-design/icons';

import { abilityMenuItem } from '@/utils/abilityComponent/abilityMenuItem';
import { COLORS } from '@/utils/colors';

import tableStyles from '@/components/Main/Table/table.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const CampaignMenu = props => {
  const intl = useIntl();
  const {
    ability,
    isEdit,
    component,
    record,
    onDeleteCampaign
  } = props;

  const canEdit = ability.can('edit', component);
  const canDelete = ability.can('delete', component);

  const editProps = {
    key: 'edit',
    canI: canEdit,
    icon: <ShoppingCartOutlined className={tableStyles.action}
                                twoToneColor={COLORS.success} />,
    children: (
        <NavLink to={`/admin/campaigns/${record.id}`}>
          {intl.formatMessage({id: 'campaigns.actions.edit', defaultMessage: "Edit Campaign"})}
        </NavLink>
    )
  };

  const deleteProps = {
    key: 'delete',
    canI: canDelete,
    icon: <DeleteTwoTone className={tableStyles.action}
                         twoToneColor={COLORS.danger} />,
    children: (
        <Popconfirm title={t('msg:deleteConfirm', { instance: t('menu:campaign') })}
                    placement={'topRight'}
                    onConfirm={() => onDeleteCampaign(record)}>
          {intl.formatMessage({id: 'actions.delete', defaultMessage: 'Delete'})}
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

export default CampaignMenu;
