import React from 'react';
import { Button, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { isLoading } from '@/utils/state';

import { useIntl } from 'umi';
import { COLORS } from './colors';

/**
 * @export
 * @param model
 * @param props
 */
export const buttonsMetadata = ({ model, props }) => {
  const { onButtonsMetadata, onSave, onClose, onDelete, loading } = props;
  onButtonsMetadata({
    saveBtn: {
      onClick: onSave,
      loading: loading.effects[`${model}/prepareToSave`]
    },
    closeBtn: {
      onClick: onClose,
      loading: false
    },
    deleteBtn: {
      onClick: onDelete,
      loading: loading.effects[`${model}/handleDelete`]
    }
  });
};

/**
 * @export
 * @param isEdit
 * @param onClick
 * @param loading
 * @return {JSX.Element}
 */
export const saveBtn = (isEdit, onClick, loading) => (
    <Button size={'small'} type={'primary'} onClick={onClick} htmlType={'submit'} loading={isLoading(loading)}
            key={'save'}>
      {isEdit ? useIntl().formatMessage({id: 'actions.update', defaultMessage: 'Update'}) : useIntl().formatMessage({id: 'actions.save', defaultMessage: 'Save'})}
    </Button>
);

/**
 * @export
 * @param onClick
 * @param loading
 * @return {JSX.Element}
 */
export const closeBtn = (onClick, loading) => (
    <Button size={'small'} onClick={onClick} htmlType={'submit'} loading={isLoading(loading)} key={'close'}>
      {useIntl().formatMessage({id: 'actions.close', defaultMessage: 'Close'})}
    </Button>
);

/**
 * @export
 * @param onClick
 * @param loading
 * @param instance
 * @return {JSX.Element}
 */
export const deleteBtn = (onClick, loading, instance) => (
    <Popconfirm title={useIntl().formatMessage({id: 'msg:deleteConfirm', defaultMessage: 'Are you sure to delete this {instance}?'}, { instance })}
                key={'delete-confirm'}
                placement={'bottomRight'}
                onConfirm={onClick}
                icon={<QuestionCircleOutlined style={{ color: COLORS.danger }}/>}>
      <Button danger size={'small'}
              type={'primary'}
              htmlType={'submit'}
              loading={isLoading(loading)}
              key={'delete'}>
        {useIntl().formatMessage({id: 'actions.delete', defaultMessage: 'Delete'})}
      </Button>
    </Popconfirm>
);

/**
 * @export
 * @param onClick
 * @param loading
 * @return {JSX.Element}
 */
export const newBtn = (onClick, loading) => (
    <Button size={'small'}
            type={'primary'}
            onClick={onClick}
            htmlType={'submit'}
            loading={isLoading(loading)}
            key={'new'}>
      {useIntl().formatMessage({id: 'actions.new', defaultMessage: 'New'})}
    </Button>
);
