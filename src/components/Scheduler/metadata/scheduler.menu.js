import React from 'react';
import { Popconfirm } from 'antd';
import { DeleteTwoTone, EditOutlined } from '@ant-design/icons';

import { COLORS } from '@/utils/colors';
import { t } from '@/utils/i18n';

import tableStyles from '@/components/Main/Table/table.module.less';

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
    onOpenSiderPanel,
    onDeleteScheduler
  } = props;

  const dividerItem = { type: 'divider' };

  const canDelete = ability.can('deleteScheduler', `${component}.scheduler`);
  const canUpdate = ability.can('updateScheduler', `${component}.scheduler`);

  const editItems = [
    {
      label: (
          <div onClick={e => {
            e.preventDefault();

            canUpdate && onOpenSiderPanel(true, {
              isEdit: record.key,
              entityForm: record,
              prefix
            });
          }}>
            {t(intl, 'actions.edit', { type: t(intl, 'scheduler') })}
          </div>
      ),
      disabled: !canUpdate || disabled,
      key: 'edit',
      icon: <EditOutlined className={tableStyles.action}/>
    }
  ];

  const deleteItems = [
    {
      label: (
          <Popconfirm placement={'topRight'}
                      disabled={!canDelete || disabled}
                      onConfirm={() => canDelete && onDeleteScheduler(record.key, prefix)}
                      title={t(intl, 'msg.deleteConfirm', { instance: t(intl, 'scheduler') })}>
            {t(intl, 'actions.delete')}
          </Popconfirm>
      ),
      key: 'delete',
      disabled: !canDelete || disabled,
      icon: <DeleteTwoTone className={tableStyles.action}
                           twoToneColor={COLORS.danger}/>
    }
  ];

  const deleteMenuItems = [
    dividerItem,
    ...deleteItems
  ];

  return [
    ...editItems,
    ...deleteMenuItems
  ];
};