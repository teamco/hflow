import React, { useEffect, useState } from 'react';
import { DatePicker, InputNumber, Select } from 'antd';
import { withTranslation } from 'react-i18next';

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
  const { t, formRef, disabled, discountTypes = [] } = props;

  const { discount } = formRef.getFieldValue('price');
  const [discountType, setDiscountType] = useState(discount?.type);

  useEffect(() => {
    setDiscountType(discount?.type || discountTypes[0]);
  }, [discount?.type]);

  /**
   * @constant
   * @param {string} value
   */
  const handleFormUpdate = value => {
    formRef.setFieldsValue({ price: { discount: { type: value } } });
    setDiscountType(value);
  };

  /**
   * @constant
   * @type {JSX.Element}
   */
  const selectDiscountBefore = (
      <Select style={{ width: 90 }}
              value={discountType}
              disabled={disabled}
              onChange={handleFormUpdate}>
        {discountTypes.map((type, idx) => (
            <Option key={idx} value={type}>{type}</Option>
        ))}
      </Select>
  );

  return (
      <GenericPanel header={t('discount:info')}
                    name={'discount'}
                    defaultActiveKey={['discount']}>
        <div>
          <InputNumber addonBefore={selectDiscountBefore}
                       label={t('subscription:discount')}
                       name={['price', 'discount', 'value']}
                       form={formRef}
                       disabled={disabled}
                       config={{ rules: [{ required: true }] }}/>
          <DatePicker name={['price', 'discount', 'startedAt']}
                      form={formRef}
                      label={t('campaign:startedAt')}/>
        </div>
        <div>
          <Rebate.Type formRef={formRef}
                       disabled={disabled}/>
        </div>
      </GenericPanel>
  );
};

export default withTranslation()(Discount);
