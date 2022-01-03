import React, { useEffect, useState } from 'react';
import { DatePicker, InputNumber, Select, Switch } from 'antd';
import { withTranslation } from 'react-i18next';
import moment from 'moment';

import FormComponents from '@/components/Form';
import Rebate from '@/components/Price/Rebate';

const { Option } = Select;
const { GenericPanel } = FormComponents;

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
    children = null
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
          <Switch label={t('feature:discounted')}
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
                       label={t('feature:discount')}
                       name={[...prefix, namespace, 'value']}
                       form={formRef}
                       min={0}
                       disabled={disabled || !isDiscounted}
                       config={{ rules: [{ required: isDiscounted }] }}/>
          <DatePicker name={[...prefix, namespace, 'startedAt']}
                      form={formRef}
                      disabledDate={current => current && current < moment().endOf('day')}
                      disabled={disabled || !isDiscounted}
                      label={t('feature:startedAt')}/>
        </div>
        <div>
          <Rebate.Type form={formRef}
                       name={[...prefix, namespace, 'type']}
                       disabled={disabled}/>
        </div>
        {children}
      </GenericPanel>
  );
};

export default withTranslation()(Discount);
