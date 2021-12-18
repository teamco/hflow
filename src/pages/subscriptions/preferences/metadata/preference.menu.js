import React from 'react';
import { NavLink } from 'umi';
import { COLORS } from 'utils/colors';
import { DeleteTwoTone, ControlOutlined } from '@ant-design/icons';
import { Menu, Popconfirm } from 'antd';
import { abilityMenuItem } from 'utils/abilityComponent/abilityMenuItem';

import tableStyles from 'components/Main/Table/table.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const PreferenceMenu = props => {
  const {
    t,
    ability,
    isEdit,
    component,
    record,
    onDeletePreference
  } = props;

  const canEdit = ability.can('edit', component);
  const canDelete = ability.can('delete', component);

  const editProps = {
    key: 'edit',
    canI: canEdit,
    icon: <ControlOutlined className={tableStyles.action}
                                twoToneColor={COLORS.success} />,
    children: (
        <NavLink to={`/admin/subscriptionPrefs/${record.id}`}>
          {t('actions:edit', { type: t('menu:preference') })}
        </NavLink>
    )
  };

  const deleteProps = {
    key: 'delete',
    canI: canDelete,
    icon: <DeleteTwoTone className={tableStyles.action}
                         twoToneColor={COLORS.danger} />,
    children: (
        <Popconfirm title={t('msg:deleteConfirm', { instance: t('menu:preference') })}
                    placement={'topRight'}
                    onConfirm={() => onDeletePreference(record)}>
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

export default PreferenceMenu;
