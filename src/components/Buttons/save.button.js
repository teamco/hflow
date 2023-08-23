import React from 'react';
import { SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useIntl } from '@umijs/max';

import { isSpinning } from '@/utils/state';
import { Can } from '@/utils/auth/can';
import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';

/**
 * @export
 * @default
 * @constant
 * @param props
 * @return {JSX.Element}
 */
const saveButton = props => {
  const intl = useIntl();

  const {
    formRef,
    loading,
    className,
    component,
    canType,
    isEdit,
    disabled,
    size = 'small',
    type = 'primary',
    modelName,
    icon = <SaveOutlined/>,
    htmlType = 'submit',
    spinOn = [],
    onClick = stub,
    canAbility = true,
    titleBtn
  } = props;

  const genericSpinOn = modelName ? [
    `${modelName}/handleUpdate`,
    `${modelName}/handleSave`,
    `${modelName}/prepareToSave`
  ] : [];

  const _spinOn = [
    ...spinOn,
    ...genericSpinOn
  ];

  /**
   * @constant
   * @param {Event} e
   */
  const handleClick = e => {
    e.preventDefault();

    if (formRef && htmlType === 'submit') {
      formRef?.submit();
    }

    onClick();
  };

  const label = titleBtn ? titleBtn :
      isEdit ?
          t(intl, 'actions.update') :
          t(intl, 'actions.save');

  const btnSave = (
      <Button size={size}
              htmlType={htmlType}
              className={className}
              disabled={disabled}
              loading={isSpinning(loading, _spinOn)}
              icon={icon}
              onClick={handleClick}
              type={type}>
        {label}
      </Button>
  );

  return canAbility ? (
      <Can I={canType} a={component} key={label}>
        {btnSave}
      </Can>
  ) : btnSave;
};

export default saveButton;
