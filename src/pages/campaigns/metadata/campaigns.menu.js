import { DeleteTwoTone, ShoppingCartOutlined } from '@ant-design/icons';
import { Menu, Popconfirm } from 'antd';
import { abilityMenuItem } from 'utils/abilityComponent/abilityMenuItem';

import tableStyles from 'components/Main/Table/table.module.less';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { NavLink } from 'umi';
import { COLORS } from 'utils/colors';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const CampaignMenu = props => {
  const {
    t,
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
          {t('actions:edit', { type: t('route:campaign') })}
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
          {t('actions:delete')}
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

export default withTranslation()(CampaignMenu);
