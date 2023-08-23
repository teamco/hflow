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
export const businessMenu = props => {
  const {
    isEdit,
    ability,
    loading,
    params,
    record,
    intl,
    onActivateBusiness,
    onHoldBusiness,
    onDeleteBusiness
  } = props;

  const businessUsersProps = {
    key: 'users',
    loading: loading.effects['businessModel/manageBusinessUsers'],
    canI: isEdit && ability?.can('read', 'businessUsers'),
    icon: <UsergroupAddOutlined/>,
    children: (
        <NavLink to={`/admin/users/${params?.user}/businesses/${record?.id}/users`}>
          {t(intl, 'user.actions.manage')}
        </NavLink>
    )
  };

  const editProps = {
    key: 'edit',
    canI: ability?.can('update', 'business'),
    icon: <EditOutlined/>,
    children: (
        <NavLink to={`/admin/users/${params?.user}/businesses/${record?.id}`}>
          {t(intl, 'business.actions.edit')}
        </NavLink>
    )
  };

  const activateProps = {
    key: 'activate',
    loading: loading.effects['businessModel/activateBusiness'],
    canI: isEdit && ability?.can('activate', 'business'),
    icon: <FileDoneOutlined/>,
    onClick: () => onActivateBusiness(params.business),
    children: t(intl, 'actions.activate')
  };

  const holdProps = {
    key: 'hold',
    loading: loading.effects['businessModel/holdBusiness'],
    canI: isEdit && ability?.can('hold', 'business'),
    icon: <PauseCircleOutlined/>,
    onClick: () => onHoldBusiness(params.business),
    children: t(intl, 'actions.hold')
  };

  const deleteProps = {
    key: 'delete',
    canI: isEdit && ability?.can('delete', 'business'),
    icon: <DeleteTwoTone className={tableStyles.action}
                         twoToneColor={COLORS.danger}/>,
    children: (
        <Popconfirm title={t(intl, 'business.msg.deleteConfirm')}
                    placement={'topRight'}
                    disabled={ability?.cannot('delete', 'business')}
                    onConfirm={() => onDeleteBusiness(params.business)}>
          {t(intl, 'actions.delete')}
        </Popconfirm>
    )
  };

  const editItems = isEdit ? [] : [...abilityMenuItem(editProps)];

  return [
    ...editItems,
    ...abilityMenuItem(businessUsersProps),
    ...abilityMenuItem(activateProps),
    ...abilityMenuItem(holdProps),
    { type: 'divider' },
    ...abilityMenuItem(deleteProps)
  ];
};