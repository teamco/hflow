import React, { useEffect, useState } from 'react';
import { DatePicker, Divider, InputNumber, Select, Switch } from 'antd';
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
    durationTypes = [],
    currencies = []
  } = props;

  const wrapper = formRef.getFieldValue(prefix[0]);
  const { discounted } = wrapper;

  const discount = complexFormKey(
      wrapper,
      namespace,
      discount?.type && discount?.value
  );

  const [_discountTypes, setDiscountTypes] = useState(discountTypes);
  const [discountType, setDiscountType] = useState(discount?.type);
  const [isDiscounted, setIsDiscounted] = useState(discounted);
  const [currency, setCurrency] = useState(currencies[0]);

  useEffect(() => {
    setCurrency(wrapper?.currency || currencies[0]);
  }, [wrapper, currencies]);

  useEffect(() => {
    handleDiscountTypeUpdate(discount?.type || _discountTypes[0]);
  }, [discount?.type, currency, _discountTypes]);

  useEffect(() => {
    handlePriceUpdate(currency);
    setDiscountTypes(discountTypes.map(type => _handleDiscountType(type)));
  }, [currency]);

  useEffect(() => {
    setIsDiscounted(discounted);
  }, [discounted]);

  /**
   * @constant
   * @param {string} value
   * @return {string}
   * @private
   */
  const _handleDiscountType = value => ['Percent', '%'].includes(value) ? '%' : currency;

  /**
   * @constant
   * @param {string} value
   */
  const handleDiscountTypeUpdate = (value) => {
    value = _handleDiscountType(value);
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
   * @param {string} value
   */
  const handlePriceUpdate = value => {
    formRef.setFieldsValue({ price: { currency: value } });
  };

  /**
   * @constant
   * @type {JSX.Element}
   */
  const selectDiscountBefore = (
      <Select style={{ width: 90 }}
              value={discountType}
              disabled={disabled || !isDiscounted}
              onChange={handleDiscountTypeUpdate}>
        {_discountTypes.map((type, idx) => (
            <Option key={idx} value={type}>{type}</Option>
        ))}
      </Select>
  );

  /**
   * @constant
   * @type {JSX.Element}
   */
  const selectCurrencyBefore = (
      <Select style={{ width: 90 }}
              value={currency}
              disabled={disabled}
              onChange={handlePriceUpdate}>
        {[...currencies]?.map((type, idx) => (
            <Option key={idx} value={type}>{type}</Option>
        ))}
      </Select>
  );

  return (
      <GenericPanel header={t('panel:priceInfo')}
                    name={namespace}
                    defaultActiveKey={[namespace]}>
        <div>
          <InputNumber addonBefore={selectCurrencyBefore}
                       label={t('price:originalPrice')}
                       name={[...prefix, 'originalPrice']}
                       form={formRef}
                       min={1}
                       disabled={disabled}
                       config={{ rules: [{ required: true }] }}/>
        </div>
        <div colProps={{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 }}>
          <Divider orientation={'left'}>{t('subscription:discount')}</Divider>
        </div>
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
        <div colProps={{ xs: 24, sm: 12, md: 12, lg: 8, xl: 8, xxl: 8 }}>
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
          <HiddenField name={['price', 'currency']}
                       form={formRef}
                       disabled={disabled}/>
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
