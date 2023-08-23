import React from 'react';
import { Form, Switch } from 'antd';
import { useIntl } from '@umijs/max';
import classnames from 'classnames';

import { isSpinning } from '@/utils/state';
import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';

import formStyles from '@/components/Form/form.module.less';

/**
 * @export
 * @default
 * @constant
 * @param {{spinOn, name}} props
 * @return {JSX.Element}
 */
const switchButton = props => {
  const intl = useIntl();

  const {
    style,
    loading,
    className,
    disabled,
    onChange = stub,
    size = 'default',
    formRef,
    modelName,
    label,
    spinOn = [],
    checkedChildrenLabel = t(intl, 'actions.yes'),
    unCheckedChildrenLabel = t(intl, 'actions.no')
  } = props;

  const _spinOn = [
    ...spinOn,
    ...modelName ? [
      `${modelName}/handleUpdate`,
      `${modelName}/handleSave`,
      `${modelName}/prepareToSave`
    ] : []];

  const name = Array.isArray(props.name) ? props.name : [props.name];

  return (
      <div className={classnames(formStyles.headerFormItem, className)}
           style={style}>
        <label htmlFor={[...name].join('_')}>{label}</label>
        <Form.Item valuePropName={'checked'}
                   name={name}>
          <Switch disabled={disabled}
                  form={formRef}
                  size={size}
                  loading={isSpinning(loading, _spinOn)}
                  onChange={onChange}
                  checkedChildren={checkedChildrenLabel}
                  unCheckedChildren={unCheckedChildrenLabel}/>
        </Form.Item>
      </div>
  );
};

export default switchButton;
