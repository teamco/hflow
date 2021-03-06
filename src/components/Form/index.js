import React from 'react';
import { findObjectValue } from '@/utils/object';

import GenericPanel from './GenericPanel';
import GenericTabs from './GenericTabs';
import EditableTags from './EditableTags';
import HiddenField from './HiddenField';
import MandatoryTextarea from './MandatoryTextarea';
import Phone from './phone';

import { Tooltip } from 'antd';
import { CheckCircleTwoTone, WarningTwoTone } from '@ant-design/icons';

import { COLORS } from '@/utils/colors';

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
 * @param t
 * @param form
 * @param name
 * @param label
 * @return {JSX.Element}
 */
export const getSuffix = (t, form, name, label) => {
  const values = form.getFieldsValue();
  const success = (<CheckCircleTwoTone twoToneColor={COLORS.success}/>);
  const warning = (
      <Tooltip placement={'topRight'}
               title={t('form:required', { field: label })}>
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

export default {
  GenericPanel,
  GenericTabs,
  EditableTags,
  HiddenField,
  Phone,
  MandatoryTextarea
};
