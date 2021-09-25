import React from 'react';
import { findObjectValue } from 'utils/object';

import GenericPanel from './GenericPanel';
import GenericTabs from './GenericTabs';
import EditableTags from './EditableTags';
import MandatoryTextarea from './MandatoryTextarea';

import { Tooltip } from 'antd';
import { CheckCircleTwoTone, WarningTwoTone } from '@ant-design/icons';

import styles from './form.module.less';

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
  const success = (<CheckCircleTwoTone twoToneColor='#52c41a' />);
  const warning = (
    <Tooltip placement={'topRight'}
             title={t('form:required', { field: label })}>
      <WarningTwoTone twoToneColor='#ff4d4f' />
    </Tooltip>
  );

  const ns = name.split('.');
  let condition = values[name];

  if (ns.length > 1) {
    condition = findObjectValue(values, ns, 0);
  }

  return condition ? success : warning;
};

export default {
  GenericPanel,
  GenericTabs,
  EditableTags,
  MandatoryTextarea
};
