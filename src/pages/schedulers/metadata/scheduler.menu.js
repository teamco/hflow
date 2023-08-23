import React from 'react';
import { Popconfirm } from 'antd';
import { DeleteTwoTone, EditOutlined } from '@ant-design/icons';

import { COLORS } from '@/utils/colors';
import { t } from '@/utils/i18n';

import tableStyles from '@/components/Main/Table/table.module.less';
import { stub } from '@/utils/function';

/**
 * @export
 * @param props
 * @return {*[]}
 */
export const schedulerMenu = props => {
  const {
    ability,
    loading,
    component,
    MODEL_NAME,
    disabled,
    record,
    prefix,
    intl,
    onOpenSiderPanel = stub,
    onDeleteScheduler = stub
  } = props;

  const dividerItem = { type: 'divider' };

  const disabledDelete = ability.cannot('delete', `${component}.scheduler`);

  const editItems = [
    {
      label: (
          <div onClick={() => {
            // history.push();
          }}>
            {t(intl, 'actions.edit', { type: t(intl, 'scheduler') })}
          </div>
      ),
      disabled,
      key: 'edit',
      icon: <EditOutlined className={tableStyles.action}/>
    }
  ];

  const deleteItems = [
    {
      label: (
          <Popconfirm placement={'topRight'}
                      disabled={disabled}
                      onConfirm={() => onDeleteScheduler(record.key, prefix)}
                      title={t(intl, 'msg.deleteConfirm', { instance: t(intl, 'scheduler') })}>
            {t(intl, 'actions.delete')}
          </Popconfirm>
      ),
      key: 'delete',
      disabled,
      icon: <DeleteTwoTone className={tableStyles.action}
                           twoToneColor={COLORS.danger}/>
    }
  ];

  const deleteMenuItems = disabledDelete ? [] : [
    dividerItem,
    ...deleteItems
  ];

  return [
    ...editItems,
    ...deleteMenuItems
  ];
};