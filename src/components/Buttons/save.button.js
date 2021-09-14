import React from 'react';
import { withTranslation } from 'react-i18next';
import { SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { isLoading } from 'utils/state';

/**
 * @export
 * @default
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const saveButton = props => {
  const {
    t,
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
            icon={<SaveOutlined />}
            onClick={() => formRef.submit()}
            type={type}>
      {isEdit ? t('actions:update') : t('actions:save')}
    </Button>
  );
};

export default withTranslation()(saveButton);