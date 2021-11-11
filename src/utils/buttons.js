import React from 'react';
import { Button, Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { isLoading } from 'utils/state';

import i18n from './i18n';
import { COLORS } from './colors';

/**
 * @export
 * @param model
 * @param props
 */
export const buttonsMetadata = ({ model, props }) => {
  const { onButtonsMetadata, onSave, onClose, onDelete, loading } = props;
  onButtonsMetadata({
    saveBtn  : {
      onClick: onSave,
      loading: loading.effects[`${model}/prepareToSave`]
    },
    closeBtn : {
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
      {isEdit ? i18n.t('actions:update') : i18n.t('actions:save')}
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
      {i18n.t('actions:close')}
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
    <Popconfirm title={i18n.t('msg:deleteConfirm', { instance })}
                key={'delete-confirm'}
                placement={'bottomRight'}
                onConfirm={onClick}
                icon={<QuestionCircleOutlined style={{ color: COLORS.danger }}/>}>
      <Button danger size={'small'}
              type={'primary'}
              htmlType={'submit'}
              loading={isLoading(loading)}
              key={'delete'}>
        {i18n.t('actions:delete')}
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
      {i18n.t('actions:new')}
    </Button>
);
