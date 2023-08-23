import React from 'react';
import { useIntl } from '@umijs/max';
import { Popconfirm, Tooltip } from 'antd';
import {
  DeleteOutlined,
  DeleteTwoTone,
  EditOutlined,
  EditTwoTone,
  EyeInvisibleTwoTone
} from '@ant-design/icons';

import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';

export const FormListActions = props => {
  const intl = useIntl();

  const {
    className,
    disabledClassName,
    entity,
    entityType,
    disabled = false,
    isSelected = false,
    handleEdit = stub,
    handleDelete = stub,
    handleUnselect = stub
  } = props;

  const unSelectToggle = (component) => {
    return isSelected ? (
        <Tooltip title={t(intl, 'actions.unselect')}>
          <EyeInvisibleTwoTone onClick={() => handleUnselect(entity)}/>
        </Tooltip>
    ) : component;
  };

  return entity?.id ? (
      <div className={className}>
        {disabled ? unSelectToggle(<EditOutlined className={disabledClassName}/>) :
            unSelectToggle(
                <Tooltip title={t(intl, 'actions.edit', { type: entityType })}>
                  <EditTwoTone onClick={() => handleEdit(entity)}/>
                </Tooltip>
            )}
        {disabled || isSelected ? (<DeleteOutlined className={disabledClassName}/>) : (
            <Tooltip title={t(intl, 'actions.deleteEntity', { type: entityType })}>
              <Popconfirm title={t(intl, 'msg.deleteConfirm', { instance: entityType })}
                          placement={'topRight'}
                          disabled={disabled}
                          onConfirm={() => handleDelete(entity)}>
                <DeleteTwoTone twoToneColor={'#eb2f96'}/>
              </Popconfirm>
            </Tooltip>
        )}
      </div>
  ) : null;
};