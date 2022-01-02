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
export const FeatureInfo = (props) => {
  const {
    t,
    formRef,
    disabled,
    currencies,
    featureTypes,
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
      <GenericPanel header={t('feature:info')}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div>
          <Select name={'type'}
                  form={formRef}
                  label={t('feature:type')}
                  disabled={disabled}
                  config={{ rules: [{ required: true }] }}>
            {[...featureTypes]?.sort()?.map((type, idx) => (
                <Option key={idx}
                        value={type}>
                  {type}
                </Option>
            ))}
          </Select>
          <InputNumber addonBefore={selectCurrencyBefore}
                       label={t('feature:price')}
                       name={'price'}
                       form={formRef}
                       min={0}
                       disabled={disabled}
                       config={{ rules: [{ required: true }] }}/>
        </div>
        <div>
          <>
            <Form.Item label={t('feature:helper')}
                       valuePropName={'checked'}>
              <Switch disabled={disabled}
                      checked={enableHelper}
                      onChange={toggleHelper}
                      checkedChildren={t('actions:yes')}
                      unCheckedChildren={t('actions:no')}/>
            </Form.Item>
          </>
          <Switch label={t('feature:status')}
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
