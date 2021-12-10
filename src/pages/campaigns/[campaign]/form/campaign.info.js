import React, { useEffect, useState } from 'react';

import { Input, InputNumber, Select, Slider } from 'antd';
import FormComponents from 'components/Form';

const { GenericPanel, MandatoryTextarea } = FormComponents;
const { Option } = Select;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const CampaignInfo = (props) => {
  const {
    t,
    formRef,
    disabled,
    discountTypes,
    businessUsers: { dims },
    campaignTypes = [],
    campaignPeriod = {}
  } = props;

  const [discountType, setDiscountType] = useState(formRef.getFieldValue('discountType'));

  let marks = {};
  for (let i = dims.min; i <= dims.max; i++) {
    marks[i] = i;
  }

  const _discountType = formRef.getFieldValue('discountType');

  useEffect(() => {
    setDiscountType(_discountType);
  }, [_discountType]);

  /**
   * @constant
   * @param {string} value
   */
  const handleFormUpdate = value => {
    formRef.setFieldsValue({ discountType: value });
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
        <Option key={'percentage'} value={discountTypes?.percentage}>
          {discountTypes?.percentage}
        </Option>
        <Option key={'currency'} value={discountTypes?.currency}>
          {discountTypes?.currency}
        </Option>
      </Select>
  );

  return (
      <GenericPanel header={t('campaign:info')}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div>
          <Select name={'campaignType'}
                  form={formRef}
                  label={t('campaign:type')}
                  disabled={disabled}
                  config={{ rules: [{ required: true }] }}>
            {[...campaignTypes].sort().map((type, idx) => (
                <Option key={idx}
                        value={type}>
                  {type}
                </Option>
            ))}
          </Select>
          <Select name={'campaignPeriod'}
                  form={formRef}
                  label={t('campaign:period')}
                  disabled={disabled}
                  config={{ rules: [{ required: true }] }}>
            {[...Object.keys(campaignPeriod)].sort().map((period, idx) => (
                <Option key={idx}
                        value={period}>
                  {campaignPeriod[period]}
                </Option>
            ))}
          </Select>
        </div>
        <div>
          <Input type={'text'}
                 label={t('campaign:title')}
                 name={'title'}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: true }] }}/>
          <Input type={'text'}
                 label={t('campaign:notice')}
                 name={'notice'}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: true }] }}/>
        </div>
        <div>
          <InputNumber addonBefore={t('currency')}
                       label={t('campaign:price')}
                       name={'price'}
                       form={formRef}
                       disabled={disabled}
                       config={{ rules: [{ required: true }] }}/>
          <InputNumber addonBefore={selectDiscountBefore}
                       label={t('campaign:discount')}
                       name={'discount'}
                       form={formRef}
                       disabled={disabled}
                       config={{ rules: [{ required: true }] }}/>
        </div>
        <div>
          <Slider marks={marks}
                  label={t('campaign:users')}
                  name={'users'}
                  form={formRef}
                  min={dims.min}
                  max={dims.max}
                  disabled={disabled}
                  config={{ rules: [{ required: true }] }}/>
          <MandatoryTextarea type={'text'}
                             label={t('form:description')}
                             name={'description'}
                             rows={4}
                             showCount
                             maxLength={300}
                             disabled={disabled}
                             form={formRef}
                             config={{ rules: [{ required: true }] }}/>
        </div>
        <div>
          <Input type={'hidden'}
                 name={'discountType'}
                 form={formRef}
                 disabled={disabled}/>
        </div>
      </GenericPanel>
  );
};
