import React, { useEffect, useState } from 'react';

import { Form, Input, InputNumber, Select, Switch } from 'antd';
import FormComponents from 'components/Form';

const { GenericPanel } = FormComponents;
const { Option } = Select;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const PreferenceInfo = (props) => {
  const {
    t,
    formRef,
    disabled,
    currencies,
    preferenceTypes,
    setDisabledDescription
  } = props;

  const translate = formRef?.getFieldValue('translateKeys');
  const { description } = translate || {};

  const [enableHelper, setEnableHelper] = useState(false);

  useEffect(() => {
    const _desc = description?.length;
    setEnableHelper(!!_desc);
    setDisabledDescription(!_desc);
  }, [translate]);

  /**
   * @constant
   * @param {boolean} value
   */
  const toggleHelper = value => {
    setDisabledDescription(!value);
    setEnableHelper(value);
  };

  const _currency = formRef.getFieldValue('currency');
  const [currency, setCurrency] = useState(_currency);

  useEffect(() => {
    setCurrency(_currency);
  }, [_currency]);

  /**
   * @constant
   * @param {string} value
   */
  const handleFormUpdate = value => {
    formRef.setFieldsValue({ currency: value });
    setCurrency(value);
  };

  /**
   * @constant
   * @type {JSX.Element}
   */
  const selectCurrencyBefore = (
      <Select style={{ width: 90 }}
              value={currencies[0]}
              disabled={disabled}
              onChange={handleFormUpdate}>
        {[...currencies]?.sort()?.map((type, idx) => (
            <Option key={idx}
                    value={type}>
              {type}
            </Option>
        ))}
      </Select>
  );

  return (
      <GenericPanel header={t('preference:info')}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div>
          <Select name={'preferenceType'}
                  form={formRef}
                  label={t('preference:type')}
                  disabled={disabled}
                  config={{ rules: [{ required: true }] }}>
            {[...preferenceTypes]?.sort()?.map((type, idx) => (
                <Option key={idx}
                        value={type}>
                  {type}
                </Option>
            ))}
          </Select>
          <InputNumber addonBefore={selectCurrencyBefore}
                       label={t('preference:price')}
                       name={'price'}
                       form={formRef}
                       disabled={disabled}
                       config={{ rules: [{ required: true }] }}/>
        </div>
        <div>
          <>
            <Form.Item label={t('preference:helper')}
                       valuePropName={'checked'}>
              <Switch disabled={disabled}
                      checked={enableHelper}
                      onChange={toggleHelper}
                      checkedChildren={t('actions:yes')}
                      unCheckedChildren={t('actions:no')}/>
            </Form.Item>
          </>
          <Switch label={t('preference:status')}
                  disabled={disabled}
                  form={formRef}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={t('actions:yes')}
                  unCheckedChildren={t('actions:no')}
                  name={'selectedByDefault'}/>
        </div>
        <div>
          <Input type={'hidden'}
                 name={'currency'}
                 form={formRef}
                 disabled={disabled}/>
        </div>
      </GenericPanel>
  );
};
