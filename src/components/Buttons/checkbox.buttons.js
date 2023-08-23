import React from 'react';
import { Checkbox, Form } from 'antd';
import classnames from 'classnames';

import { isSpinning } from '@/utils/state';
import { stub } from '@/utils/function';

import styles from './button.module.less';

/**
 * @export
 * @default
 * @constant
 * @param {{spinOn}} props
 * @return {JSX.Element}
 */
const checkboxButtons = props => {
  const {
    loading,
    noStyle = true,
    name,
    form,
    className,
    disabled,
    onChange = stub,
    options = [],
    rules = [],
    spinOn = [],
    type = 'primary',
    behavior = 'hide' // hide | show checkboxes
  } = props;

  const _spinOn = [...spinOn];

  return (
      <Form.Item noStyle={noStyle}
                 name={name}
                 rules={rules}>
        <Checkbox.Group options={options}
                        className={classnames(className, styles.checkboxWrapper, styles[type], styles[behavior])}
                        disabled={disabled || isSpinning(loading, _spinOn)}
                        onChange={onChange}/>
      </Form.Item>
  );
};

export default checkboxButtons;
