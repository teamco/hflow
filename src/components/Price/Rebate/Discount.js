import React, { useState } from 'react';
import { Input, InputNumber, Select } from 'antd';
import { useIntl } from '@umijs/max';

import FormComponents, { getFieldValue, requiredField } from '@/components/Form';
import SwitchButton from '@/components/Buttons/switch.button';

import { complexFormKey, updateComplexForm } from '@/utils/form';
import { layout } from '@/utils/layout';
import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';
import { prettifyCamelCase } from '@/utils/string';

import Duration from '@/components/Price/Range/Duration';

import styles from './rebate.less';

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
    discountHeader,
    collapsed = false,
    trialed = false,
    setIsTrialed = stub,
    priceMin = 1,
    prefix = [],
    expectedOriginalPrice,
    namespace = 'discount',
    modelName,
    discountTypes = DISCOUNT_TYPES,
    currencies = [],
    durationTypes = [],
    children,
    readOnlyFields = null,
    loading,
    header = t(intl, 'panel.priceInfo', { type: '' }),
    childrenColProps = layout.fullColumn,
    renderScheduler = stub
  } = props;

  const wrapper = formRef.getFieldValue(prefix[0]);

  if (!wrapper) {
    throw new Error(`Add initial values for: ${prefix[0]}`);
  }

  const discounted = !!complexFormKey('discounted', wrapper, false);
  const discount = complexFormKey(namespace, wrapper, false);
  const currency = complexFormKey('currency', wrapper, false) || currencies[0];
  const isTrialedChecked = getFieldValue(formRef, 'trialed');

  /**
   * @constant
   * @param {string} value
   * @return {string|null}
   * @private
   */
  const _handleDiscountType = value => ['Percent', '%'].includes(value) ? '%' : currency;

  const [isDiscounted, setIsDiscounted] = useState(discounted);
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [discountType, setDiscountType] = useState(_handleDiscountType(discount?.type));

  /**
   * @constant
   * @param {string} value
   */
  const handleDiscountTypeUpdate = (value) => {
    const _value = _handleDiscountType(value);
    setDiscountType(_value);

    updateComplexForm(formRef, prefix, namespace, { type: _value });
  };

  effectHook(() => {
    handleDiscountTypeUpdate(discount?.type);
    setIsCollapsed(collapsed);
  });

  effectHook(() => {
    handleDiscountDisabled(discounted);
  }, [discounted]);

  effectHook(() => {
    updateComplexForm(formRef, prefix, 'originalPrice', expectedOriginalPrice);
  }, [expectedOriginalPrice]);

  effectHook(() => {
    handleTrialToggling(isTrialedChecked);
  }, [isTrialedChecked]);

  /**
   * @constant
   * @param {boolean} checked
   */
  const handleTrialToggling = checked => {
    setIsTrialed(checked);
  };

  /**
   * @constant
   * @param {boolean} checked
   */
  const handleDiscountDisabled = checked => {
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
   * @param {ValueType|null|string} value
   * @type {function(*)}
   */
  const selectDiscountBefore = (value) => (
      <Select style={{ width: 90 }}
              value={value}
              disabled={disabled || !isDiscounted}
              onChange={handleDiscountTypeUpdate}>
        {discountTypes.map((type, idx) => (
            <Option key={idx} value={type}>
              {_handleDiscountType(type)}
            </Option>
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

  /**
   * @constant
   * @param field
   * @returns {boolean}
   */
  const isReadOnlyField = (field) => {
    let isField = false;
    if (readOnlyFields && readOnlyFields.length) {
      isField = readOnlyFields.includes(field);
    }
    return isField;
  };

  const _discountPanelHeader = `${prettifyCamelCase(discountHeader)}.price.discount`.toLowerCase();

  return (
      <GenericPanel header={header}
                    className={styles.discount}
                    name={namespace}
                    defaultActiveKey={isCollapsed ? null : [namespace]}
                    extra={trialed && (
                        <SwitchButton name={'trialed'}
                                      label={t(intl, 'price.trialed')}
                                      disabled={disabled}
                                      form={formRef}
                                      loading={loading}
                                      modelName={modelName}
                                      onChange={handleTrialToggling}/>
                    )}>
        <div colProps={layout.halfColumn}>
          <InputNumber addonBefore={selectCurrencyBefore}
                       label={t(intl, 'price.originalPrice')}
                       name={[...prefix, 'originalPrice']}
                       form={formRef}
                       min={priceMin}
                       readOnly={isReadOnlyField('originalPrice')}
                       disabled={disabled}
                       config={{
                         rules: [
                           requiredField(intl, t(intl, 'price.originalPrice'))
                         ]
                       }}/>
          <Input label={t(intl, 'price.discountedPrice')}
                 name={[...prefix, 'discountedPrice']}
                 form={formRef}
                 min={priceMin}
                 readOnly={true}
                 bordered={false}
                 placeholder={t(intl, 'price.discountedCalc')}
                 disabled={disabled}/>
        </div>
        <div colProps={layout.halfColumn}>
          <Duration form={formRef}
                    label={t(intl, 'price.duration')}
                    disabled={disabled}
                    prefix={[...prefix]}
                    namespace={'paymentDuration'}
                    required={true}
                    durationTypes={durationTypes}/>
        </div>
        {children && (<div colProps={childrenColProps}>{children}</div>)}
        <div colProps={layout.fullColumn}>
          <GenericPanel header={t(intl, 'price.discountInfo', { header: discountHeader })}
                        name={_discountPanelHeader}
                        collapsible={isDiscounted ? 'header' : 'disabled'}
                        defaultActiveKey={isDiscounted ? [_discountPanelHeader] : null}
                        extra={(
                            <SwitchButton name={[...prefix, 'discounted']}
                                          label={t(intl, 'price.discounted')}
                                          disabled={disabled}
                                          form={formRef}
                                          style={{ color: '#000' }}
                                          loading={loading}
                                          onChange={handleDiscountDisabled}/>
                        )}>
            <div colProps={layout.halfColumn}>
              <InputNumber addonBefore={selectDiscountBefore(discountType)}
                           label={t(intl, 'price.discount')}
                           name={[...prefix, namespace, 'value']}
                           form={formRef}
                           min={1}
                           disabled={disabled || !isDiscounted}
                           config={{ rules: [{ required: isDiscounted }] }}/>
            </div>
            <div colProps={layout.fullColumn}>
              {renderScheduler()}
            </div>
          </GenericPanel>
        </div>
        <div>
          <HiddenField form={formRef}
                       name={[...prefix, namespace, 'type']}
                       data={discountType}
                       disabled={disabled || !isDiscounted}/>
          <HiddenField name={[...prefix, 'currency']}
                       form={formRef}
                       data={currency}
                       disabled={disabled}/>
        </div>
      </GenericPanel>
  );
};

export default Discount;
