import React, { useEffect, useState } from 'react';
import { DatePicker, InputNumber, Select, Switch } from 'antd';
import { withTranslation } from 'react-i18next';
import moment from 'moment';

import FormComponents from '@/components/Form';
import Duration from '@/components/Price/Range/Duration';
import { complexFormKey, updateComplexForm } from '@/utils/form';
import { DEFAULT_DATE_FORMAT } from '@/utils/timestamp';

const { Option } = Select;
const { GenericPanel, HiddenField } = FormComponents;

const DISCOUNT_TYPES = ['%', 'currency'];

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
    discountTypes = DISCOUNT_TYPES,
    durationTypes = []
  } = props;

  const wrapper = formRef.getFieldValue(prefix[0]);
  const { discounted, currency } = wrapper;
  const discount = complexFormKey(wrapper, namespace, discount?.type && discount?.value);

  const [_discountTypes, setDiscountTypes] = useState(discountTypes);
  const [discountType, setDiscountType] = useState(discount?.type);
  const [isDiscounted, setIsDiscounted] = useState(discounted);

  useEffect(() => {
    handleFormUpdate(discount?.type || _discountTypes[0]);
  }, [discount?.type, currency, _discountTypes]);

  useEffect(() => {
    setDiscountTypes(discountTypes.map(type => (type === 'currency' ? currency : type)));
  }, [currency]);

  /**
   * @constant
   * @param {string} value
   */
  const handleFormUpdate = value => {
    value = value === 'Percent' ? '%' : currency;
    updateComplexForm(formRef, prefix, namespace, { type: value });
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
        {_discountTypes.map((type, idx) => (
            <Option key={idx} value={type}>{type}</Option>
        ))}
      </Select>
  );

  return (
      <GenericPanel header={t('panel:discountInfo')}
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
                       min={1}
                       disabled={disabled || !isDiscounted}
                       config={{ rules: [{ required: isDiscounted }] }}/>
          <DatePicker name={[...prefix, namespace, 'startedAt']}
                      form={formRef}
                      format={DEFAULT_DATE_FORMAT}
                      disabledDate={current => current && current < moment().endOf('day')}
                      disabled={disabled || !isDiscounted}
                      config={{ rules: [{ required: isDiscounted }] }}
                      label={t('price:discountStartedAt')}/>
        </div>
        <div>
          <HiddenField form={formRef}
                       name={[...prefix, namespace, 'type']}
                       disabled={disabled || !isDiscounted}/>
        </div>
        <div>
          <Duration form={formRef}
                    label={t('price:discountDuration')}
                    disabled={disabled || !isDiscounted}
                    prefix={[...prefix, namespace]}
                    required={isDiscounted}
                    durationTypes={durationTypes}/>
        </div>
      </GenericPanel>
  );
};

export default withTranslation()(Discount);
