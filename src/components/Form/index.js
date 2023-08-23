import React from 'react';
import { useIntl } from '@umijs/max';
import { Form, Input, InputNumber, Tooltip } from 'antd';
import { CheckCircleTwoTone, WarningTwoTone } from '@ant-design/icons';

import GenericPanel from './GenericPanel';
import GenericTabs from './GenericTabs';
import EditableTags from './EditableTags';
import HiddenField from './HiddenField';
import MandatoryTextarea from './MandatoryTextarea';
import Phone from './phone';

import { findObjectValue } from '@/utils/object';
import { COLORS } from '@/utils/colors';
import { t } from '@/utils/i18n';
import { logger } from '@/utils/console';
import { stub } from '@/utils/function';
import { effectHook } from '@/utils/hooks';

import { isDevelopment } from '@/services/common.service';

/**
 * @export
 * @constant
 * @param value
 * @param [unit]
 * @param [DEFAULT_VALUE]
 * @return {string}
 */
export const unitFormatter = (value, unit = 'px', DEFAULT_VALUE = 0) => {
  return `${parseInt(value.toString(), 10) || DEFAULT_VALUE}${unit}`;
};

/**
 * @export
 * @constant
 * @param value
 * @param [unit]
 * @return {*}
 */
export const unitParser = (value, unit = 'px') => {
  const regex = new RegExp(unit, 'i');
  return value.replace(regex, '');
};

/**
 * @export
 * @param form
 * @param {string|*} [name]
 * @param label
 * @return {JSX.Element}
 */
export const getSuffix = (form, label, name = '') => {
  const intl = useIntl();

  if (!form) {
    throw new Error(`formRef must be defined for a [${label}] component.`);
  }

  const values = form.getFieldsValue();
  const success = (<CheckCircleTwoTone twoToneColor={COLORS.success}/>);
  const warning = (
      <Tooltip placement={'topRight'}
               title={requiredField(intl, label).message}>
        <WarningTwoTone twoToneColor={COLORS.warning}/>
      </Tooltip>
  );

  /**
   * @function
   * @param {string} name
   * @return {*}
   * @private
   */
  function _getNs(name) {
    return name.split('.');
  }

  const ns = typeof name === 'string' ? _getNs(name) : name;
  let condition = values[name];

  if (ns.length > 1 || Array.isArray(name)) {
    condition = findObjectValue(values, ns, 0);
  }

  return condition ? success : warning;
};

/**
 * @export
 * @param {string} prefix
 * @param {string} name
 * @return {*[]|*}
 */
export const getFieldName = (prefix, name) => {
  return prefix ? [prefix, name] : name;
};

/**
 * @export
 * @constant
 * @param formRef
 * @param {string} key
 * @return {*}
 */
export const getFieldValue = (formRef, key) => formRef?.getFieldValue(key);

/**
 * @export
 * @param intl
 * @param field
 * @param {boolean} [required]
 * @return {{message: string, required: boolean}}
 */
export const requiredField = (intl, field, required = true) => ({
  required,
  message: t(intl, 'form.required', { field })
});

/**
 * @export
 * @async
 * @param formRef
 * @param {function} [handler]
 * @return {*}
 */
export const validateFields = (formRef, handler = stub) => {
  formRef.validateFields().then(() => {
    handler();
  }).catch((...errors) => {
    if (isDevelopment()) {
      logger({ type: 'warn', errors });
    }
  });
};

export const validateFieldsOnLoad = (formRef, entityForm = []) => {
  effectHook(async () => {
    entityForm?.length && (await validateFields(formRef));
  }, [entityForm]);
};

/**
 * @export
 * @param {boolean} disabled
 * @param {string} triggeredFieldName
 * @param formRef
 * @return {boolean}
 */
export const isDisabledField = (disabled, triggeredFieldName, formRef) => {
  return disabled || !formRef.getFieldValue(triggeredFieldName);
};

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const FormInput = props => {
  const {
    name,
    label,
    disabled,
    intl,
    type = 'text',
    rules = [],
    help,
    extra = null,
    required = true,
    noStyle = false,
    ...rest
  } = props;

  const placeholder = t(intl, 'form.placeholder', { field: label });

  return (
      <Form.Item name={name}
                 label={label}
                 help={help}
                 extra={extra}
                 noStyle={noStyle}
                 rules={[
                   requiredField(intl, label, required),
                   ...rules
                 ]}>
        {type === 'number' ? (
            <InputNumber placeholder={placeholder}
                         disabled={disabled}
                         {...rest} />
        ) : (
            <Input type={type}
                   disabled={disabled}
                   placeholder={placeholder}
                   {...rest}/>
        )}
      </Form.Item>
  );
};

export default {
  GenericPanel,
  GenericTabs,
  EditableTags,
  HiddenField,
  Phone,
  MandatoryTextarea
};
