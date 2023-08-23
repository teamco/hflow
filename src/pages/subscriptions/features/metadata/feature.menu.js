import React from 'react';
import { NavLink } from '@umijs/max';
import { DeleteTwoTone, ControlOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';

import { COLORS } from '@/utils/colors';
import { abilityMenuItem } from '@/utils/abilityComponent/abilityMenuItem';
import { t } from '@/utils/i18n';

import tableStyles from '@/components/Main/Table/table.module.less';

/**
 * @export
 * @param props
 * @return {*[]}
 */
export const featureMenu = props => {
  const {
    ability,
    isEdit,
    component,
    record,
    intl,
    canUpdate,
    canDelete,
    onDeleteFeature
  } = props;

  const editProps = {
    key: 'edit',
    canI: canUpdate,
    divider: true,
    icon: <ControlOutlined className={tableStyles.action}
                           twoToneColor={COLORS.success}/>,
    children: (
        <NavLink to={`/admin/features/${record?.id}`}>
          {t(intl, 'feature.actions.edit')}
        </NavLink>
    )
  };

  const deleteProps = {
    key: 'delete',
    canI: canDelete,
    icon: <DeleteTwoTone className={tableStyles.action}
                         twoToneColor={COLORS.danger}/>,
    children: (
        <Popconfirm title={t(intl, 'feature.msg.deleteConfirm')}
                    placement={'topRight'}
                    disabled={!canDelete}
                    onConfirm={() => onDeleteFeature(record)}>
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