import React from 'react';
import { SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { isLoading } from '@/utils/state';

/**
 * @export
 * @default
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const saveButton = props => {
  const {
    formRef,
    loading,
    isEdit,
    disabled,
    size = 'small',
    type = 'primary'
  } = props;

  return (
      <Button key={'save'}
              size={size}
              disabled={disabled}
              loading={isLoading(loading)}
              icon={<SaveOutlined/>}
              onClick={() => formRef.submit()}
              type={type}>
        {isEdit ? intl.formatMessage({id: 'actions.update', defaultMessage: 'Update'}) : intl.formatMessage({id: 'actions.save', defaultMessage: 'Save'})}
      </Button>
  );
};

export default saveButton;
