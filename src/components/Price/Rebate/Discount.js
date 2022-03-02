import React, { useState } from 'react';
import { DatePicker, Divider, Input, InputNumber, Select, Switch } from 'antd';
import { useIntl } from 'umi';
import moment from 'moment';

import FormComponents from '@/components/Form';
import Duration from '@/components/Price/Range/Duration';

import { complexFormKey, updateComplexForm } from '@/utils/form';
import { DEFAULT_DATE_FORMAT } from '@/utils/timestamp';
import { layout } from '@/utils/layout';
import { effectHook } from '@/utils/hooks';

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
  const intl = useIntl();
  const {
    formRef,
    disabled,
    collapsed = false,
    priceMin = 1,
    prefix = [],
    namespace = 'discount',
    discountTypes = DISCOUNT_TYPES,
    durationTypes = [],
    currencies = [],
    children
  } = props;

  const { header = intl.formatMessage({id: 'panel.priceInfo', defaultMessage: 'Trial Period'}) } = props;

  const wrapper = formRef.getFieldValue(prefix[0]);

  const discounted = !!complexFormKey(wrapper, 'discounted', false);
  const discount = complexFormKey(wrapper, namespace, false);
  const currency = complexFormKey(wrapper, 'currency', false) || currencies[0];

  /**
   * @constant
   * @param {string} value
   * @return {string}
   * @private
   */
  const _handleDiscountType = value => ['Percent', '%'].includes(value) ? '%' : currency;

  /**
   * @constant
   * @type {string}
   * @private
   */
  const discountType = _handleDiscountType(discount?.type);

  const [isDiscounted, setIsDiscounted] = useState(discounted);

  /**
   * @constant
   * @param {string} value
   */
  const handleDiscountTypeUpdate = (value) => {
    value = _handleDiscountType(value);
    updateComplexForm(formRef, prefix, namespace, { type: value });
  };

  effectHook(() => {
    handleDisabled(discounted);
  }, [discounted]);

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
    updateComplexForm(formRef, prefix, 'currency', value);
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
        {discountTypes.map((type, idx) => (
            <Option key={idx} value={type}>{_handleDiscountType(type)}</Option>
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
      <GenericPanel header={header}
                    name={namespace}
                    defaultActiveKey={collapsed ? null : [namespace]}>
        <div colProps={{ xs: 24, sm: 12, md: 12, lg: 8, xl: 6, xxl: 4 }}>
          <InputNumber addonBefore={selectCurrencyBefore}
                       label={intl.formatMessage({id: 'price.originalPrice', defaultMessage: 'Original Price'})}
                       name={[...prefix, 'originalPrice']}
                       form={formRef}
                       min={priceMin}
                       disabled={disabled}
                       config={{ rules: [{ required: true }] }}/>
          <Input label={intl.formatMessage({id: 'price.discountedPrice', defaultMessage: 'Discounted Price'})}
                 name={[...prefix, 'discountedPrice']}
                 form={formRef}
                 min={priceMin}
                 readOnly={true}
                 bordered={false}
                 placeholder={intl.formatMessage({id: 'price.discountedCalc', defaultMessage: 'Will be Calculated'})}
                 disabled={disabled}/>
        </div>
        <div colProps={layout.fullColumn}>
          <Divider orientation={'left'}>{intl.formatMessage({id: 'subscription.discount', defaultMessage: 'Discount'})}</Divider>
        </div>
        <div>
          <Switch label={intl.formatMessage({id: 'price.discounted', defaultMessage: 'Is Discounted?'})}
                  disabled={disabled}
                  form={formRef}
                  onChange={handleDisabled}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={intl.formatMessage({id: 'actions.yes', defaultMessage: 'Yes'})}
                  unCheckedChildren={intl.formatMessage({id: 'actions.no', defaultMessage: 'No'})}
                  name={[...prefix, 'discounted']}/>
        </div>
        <div colProps={{ xs: 24, sm: 12, md: 12, lg: 8, xl: 8, xxl: 8 }}>
          <InputNumber addonBefore={selectDiscountBefore}
                       label={intl.formatMessage({id: 'price.discount', defaultMessage: 'Is Discounted?'})}
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
                      label={intl.formatMessage({id: 'price.discountStartedAt', defaultMessage: 'Started at'})}/>
        </div>
        <div>
          <HiddenField form={formRef}
                       name={[...prefix, namespace, 'type']}
                       value={discountType}
                       disabled={disabled || !isDiscounted}/>
          <HiddenField name={[...prefix, 'currency']}
                       form={formRef}
                       value={currency}
                       disabled={disabled}/>
        </div>
        <div>
          <Duration form={formRef}
                    label={intl.formatMessage({id: 'price.discountDuration', defaultMessage: 'Discount Duration'})}
                    disabled={disabled || !isDiscounted}
                    prefix={[...prefix, namespace]}
                    required={isDiscounted}
                    durationTypes={durationTypes}/>
        </div>
        {children && (<div colProps={layout.fullColumn}>{children}</div>)}
      </GenericPanel>
  );
};

export default Discount;
