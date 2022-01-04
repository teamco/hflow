import React, { useEffect, useState } from 'react';

import { Input, InputNumber, Select, DatePicker, Switch } from 'antd';
import FormComponents from 'components/Form';

const { GenericPanel, MandatoryTextarea } = FormComponents;
const { Option } = Select;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const CampaignOptions= (props) => {
  const {
    t,
    formRef,
    disabled,
    discountTypes,
    durationTypes
  } = props;

  const [discountType, setDiscountType] = useState(formRef.getFieldValue('discountType'));
  const [durationType, setDurationType] = useState(formRef.getFieldValue('durationType'));
  const [isDiscount, setIsDiscount] = useState(false);
  const [isDuration, setIsDuration] = useState(false);

  const _discountType = formRef.getFieldValue('discountType');
  const _durationType = formRef.getFieldValue('durationTypes');
  const _isDiscount = formRef.getFieldValue('isDiscount');
  const _isDuration = formRef.getFieldValue('isDuration');

  useEffect(() => {
    setDiscountType(_discountType);
    setIsDiscount(_isDiscount);
  }, [_discountType, _isDiscount]);

  useEffect(() => {
    setDurationType(_durationType);
    setIsDuration(_isDuration);
  }, [_durationType, _isDuration]);

  console.log(durationType, isDuration,  'is Duration' );
  console.log(discountType, isDiscount,  'is Discount' );

  /**
   * @constant
   * @param {string} value
   */
  const handleFormUpdate = value => {
    formRef.setFieldsValue({ discountType: value });
    setDiscountType(value);
  };
  const handleDurationFormUpdate = value => {
    formRef.setFieldsValue({ durationType: value });
    setDurationType(value);
  };

  /**
   * @constant
   * @type {JSX.Element}
   */
  const selectDiscountBefore = (
      <Select style={{ width: 90 }}
              value={discountType}
              disabled={disabled && !isDiscount}
              onChange={handleFormUpdate}>
        {Object.keys(discountTypes).map((type, idx) => (
              <Option key={idx} value={discountTypes[type]}>
                {discountTypes[type]}
              </Option>
          ))}
      </Select>
  );

  /**
   * @constant
   * @type {JSX.Element}
   */
  const selectDurationBefore = (
      <Select style={{ width: 90 }}
              value={durationType}
              disabled={disabled}
              onChange={handleDurationFormUpdate}>
        <Option key={'day'} value={durationTypes?.day}>
          {durationTypes?.day}
        </Option>
        <Option key={'week'} value={durationTypes?.week}>
          {durationTypes?.week}
        </Option>
        <Option key={'month'} value={durationTypes?.month}>
          {durationTypes?.month}
        </Option>
      </Select>
  );

  return (
      <GenericPanel header={t('campaign:info')}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div>
          <Switch disabled={disabled}
                  name={'isDuration'}
                  label={t('campaign:activate')}
                  config={{ valuePropName: 'checked' }}
                  form={formRef}
                  checkedChildren={t('campaign:activated')}
                  unCheckedChildren={t('campaign:hold')} />
          <InputNumber addonBefore={selectDurationBefore}
                       label={t('campaign:duration')}
                       name={'duration'}
                       form={formRef}
                       disabled={disabled && !isDuration}
                       config={{ rules: [{ required: false }] }}/>
        </div>
        <div>
          <></>
          <DatePicker name={'startedAt'} label={t('campaign:startAt')} />
        </div>
        <div>
          <Switch disabled={disabled}
                  name={'isDiscount'}
                  label={t('campaign:isDiscount')}
                  config={{ valuePropName: 'checked' }}
                  form={formRef}
                  checkedChildren={t('campaign:activated')}
                  unCheckedChildren={t('campaign:hold')} />
          <InputNumber addonBefore={selectDiscountBefore}
                       label={t('subscription:discount')}
                       name={'discount'}
                       form={formRef}
                       disabled={disabled && !isDiscount}
                       config={{ rules: [{ required: false }] }}/>
        </div>
        <div>
          <Input type={'hidden'}
                 name={'discountType'}
                 form={formRef}
                 disabled={disabled}/>
          <Input type={'hidden'}
                 name={'durationType'}
                 form={formRef}
                 disabled={disabled}/>
        </div>
      </GenericPanel>
  );
};
