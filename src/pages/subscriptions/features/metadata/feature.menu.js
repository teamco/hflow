import React from 'react';
import { NavLink, useIntl } from 'umi';
import { COLORS } from '@/utils/colors';
import { DeleteTwoTone, ControlOutlined } from '@ant-design/icons';
import { Menu, Popconfirm } from 'antd';
import { abilityMenuItem } from '@/utils/abilityComponent/abilityMenuItem';

import tableStyles from '@/components/Main/Table/table.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const FeatureMenu = props => {
  const intl = useIntl();
  const {
    ability,
    isEdit,
    component,
    record,
    onDeleteFeature
  } = props;

  const canEdit = ability.can('edit', component);
  const canDelete = ability.can('delete', component);

  const editProps = {
    key: 'edit',
    canI: canEdit,
    icon: <ControlOutlined className={tableStyles.action}
                                twoToneColor={COLORS.success} />,
    children: (
        <NavLink to={`/admin/features/${record.id}`}>
          {intl.formatMessage({id: 'feature.actions.edit', defaultMessage: 'Edit Feature'})}
        </NavLink>
    )
  };

  const deleteProps = {
    key: 'delete',
    canI: canDelete,
    icon: <DeleteTwoTone className={tableStyles.action}
                         twoToneColor={COLORS.danger} />,
    children: (
        <Popconfirm title={intl.formatMessage({id: 'feature.msg.deleteConfirm', defaultMessage: 'Are you sure to' +
              ' delete this Feature?'})}
                    placement={'topRight'}
                    onConfirm={() => onDeleteFeature(record)}>
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

export default FeatureMenu;
