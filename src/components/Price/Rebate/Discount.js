import React, { useEffect, useState } from 'react';
import { DatePicker, InputNumber, Select, Switch } from 'antd';
import { withTranslation } from 'react-i18next';
import moment from 'moment';

import FormComponents from '@/components/Form';
import Duration from '@/components/Price/Range/Duration';

const { Option } = Select;
const { GenericPanel, HiddenField } = FormComponents;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const Discount = props => {
  const {
    t,
    formRef,
    disabled,
    prefix = [],
    namespace = 'discount',
    discountTypes = [],
    durationTypes = []
  } = props;

  const { discount, discounted } = formRef.getFieldValue(prefix[0] || namespace);
  const [discountType, setDiscountType] = useState(discount?.type);
  const [isDiscounted, setIsDiscounted] = useState(discounted);

  useEffect(() => {
    setDiscountType(discount?.type || discountTypes[0]);
  }, [discount?.type]);

  /**
   * @constant
   * @param {string} value
   */
  const handleFormUpdate = value => {
    const field = prefix[0] ?
        { [prefix[0]]: { discount: { type: value } } } :
        { discount: { type: value } };

    formRef.setFieldsValue(field);
    setDiscountType(value);
  };

  /**
   * @constant
   * @param {boolean} checked
   */
  const handleDisabled = checked => {
    setIsDiscounted(checked);
  };

  /**
   * @constant
   * @type {JSX.Element}
   */
  const selectDiscountBefore = (
      <Select style={{ width: 90 }}
              value={discountType}
              disabled={disabled || !isDiscounted}
              onChange={handleFormUpdate}>
        {discountTypes.map((type, idx) => (
            <Option key={idx} value={type}>{type}</Option>
        ))}
      </Select>
  );

  return (
      <GenericPanel header={t('discount:info')}
                    name={namespace}
                    defaultActiveKey={[namespace]}>
        <div>
          <Switch label={t('price:discounted')}
                  disabled={disabled}
                  form={formRef}
                  onChange={handleDisabled}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={t('actions:yes')}
                  unCheckedChildren={t('actions:no')}
                  name={[...prefix, 'discounted']}/>
        </div>
        <div>
          <InputNumber addonBefore={selectDiscountBefore}
                       label={t('price:discount')}
                       name={[...prefix, namespace, 'value']}
                       form={formRef}
                       min={0}
                       disabled={disabled || !isDiscounted}
                       config={{ rules: [{ required: isDiscounted }] }}/>
          <DatePicker name={[...prefix, namespace, 'startedAt']}
                      form={formRef}
                      disabledDate={current => current && current < moment().endOf('day')}
                      disabled={disabled || !isDiscounted}
                      label={t('price:discountStartedAt')}/>
        </div>
        <div>
          <HiddenField form={formRef}
                       name={[...prefix, namespace, 'type']}
                       disabled={disabled}/>
        </div>
        <div>
          <Duration form={formRef}
                    label={t('price:discountDuration')}
                    disabled={disabled}
                    prefix={[...prefix, namespace]}
                    durationTypes={durationTypes}/>
          <HiddenField name={[...prefix, namespace, 'duration', 'type']}
                       form={formRef}
                       min={0}
                       disabled={disabled}/>
        </div>
      </GenericPanel>
  );
};

export default withTranslation()(Discount);
