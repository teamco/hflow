import React from 'react';
import {
  DeleteTwoTone,
  FileDoneOutlined,
  PauseCircleOutlined,
  UsergroupAddOutlined,
  EditOutlined
} from '@ant-design/icons';
import { Menu, Popconfirm } from 'antd';
import { withTranslation } from 'react-i18next';
import { NavLink, useIntl } from 'umi';

import { abilityMenuItem } from '@/utils/abilityComponent/abilityMenuItem';
import { COLORS } from '@/utils/colors';

import tableStyles from '@/components/Main/Table/table.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
const BusinessMenu = props => {
  const intl = useIntl();
  const {
    isEdit,
    ability,
    loading,
    params,
    record,
    onActivateBusiness,
    onHoldBusiness,
    onDeleteBusiness
  } = props;

  const businessUsersProps = {
    key: 'users',
    loading: loading.effects['businessModel/manageBusinessUsers'],
    canI: isEdit && ability?.can('read', 'businessUsers'),
    icon: <UsergroupAddOutlined />,
    children: (
          <NavLink to={`/admin/users/${params.user}/businesses/${record.id}/users`}>
            {intl.formatMessage({id: 'user.actions.manage', defaultMessage: 'Manage User'}) }
          </NavLink>
    )
  };

  const editProps = {
    key: 'edit',
    canI: ability?.can('update', 'business'),
    icon: <EditOutlined />,
    children: (
        <NavLink to={`/admin/users/${params.user}/businesses/${record.id}`}>
          {intl.formatMessage({id: 'business.actions.edit', defaultMessage: 'Edit Business'})}
        </NavLink>
    )
  };

  const activateProps = {
    key: 'activate',
    loading: loading.effects['businessModel/activateBusiness'],
    canI: isEdit && ability?.can('activate', 'business'),
    icon: <FileDoneOutlined />,
    onClick: () => onActivateBusiness(params.business),
    children: intl.formatMessage({id: 'actions.activate', defaultMessage: 'Activate'})
  };

  const holdProps = {
    key: 'hold',
    loading: loading.effects['businessModel/holdBusiness'],
    canI: isEdit && ability?.can('hold', 'business'),
    icon: <PauseCircleOutlined />,
    onClick: () => onHoldBusiness(params.business),
    children: intl.formatMessage({id: 'actions.hold', defaultMessage: 'Hold'})
  };

  const deleteProps = {
    key: 'delete',
    canI: isEdit && ability?.can('delete', 'business'),
    icon: <DeleteTwoTone className={tableStyles.action}
                         twoToneColor={COLORS.danger} />,
    children: (
          <Popconfirm title={intl.formatMessage({id: 'business.msg.deleteConfirm', defaultMessage: 'Are you sure to delete this Business?'})}
                      placement={'topRight'}
                      onConfirm={() => onDeleteBusiness(params.business)}>
            {intl.formatMessage('actions:delete')}
          </Popconfirm>
    )
  };

  return (
      <Menu>
        {!isEdit && abilityMenuItem(editProps)}
        {abilityMenuItem(businessUsersProps)}
        {abilityMenuItem(activateProps)}
        {abilityMenuItem(holdProps)}
        <Menu.Divider />
        {abilityMenuItem(deleteProps)}
      </Menu>
  );
};

export default withTranslation()(BusinessMenu);
