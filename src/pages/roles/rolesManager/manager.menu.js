import React from 'react';
import {
  DeleteTwoTone,
  EditOutlined,
  FileDoneOutlined,
  PauseCircleOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { NavLink } from '@umijs/max';

import { abilityMenuItem } from '@/utils/abilityComponent/abilityMenuItem';
import { COLORS } from '@/utils/colors';

import tableStyles from '@/components/Main/Table/table.module.less';
import { t } from '@/utils/i18n';

/**
 * @export
 * @param props
 * @return {[...*[]]}
 */
export const managerMenu = props => {
  const {
    ability,
    loading,
    record,
    intl,
    onDeleteRoles
  } = props;

  const canDelete = ability?.can('delete', 'role');

  const deleteProps = {
    key: 'delete',
    canI: canDelete,
    icon: <DeleteTwoTone className={tableStyles.action}
                         twoToneColor={COLORS.danger}/>,
    children: (
        <Popconfirm title={t(intl, 'msg.deleteConfirm', { instance: t(intl, 'auth.roles') })}
                    disabled={!canDelete}
                    placement={'topRight'}
                    onConfirm={() => onDeleteRoles(record)}>
          {t(intl, 'actions.delete')}
        </Popconfirm>
    )
  };

  return [
    ...abilityMenuItem(deleteProps)
  ];
};