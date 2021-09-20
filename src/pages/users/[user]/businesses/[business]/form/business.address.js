import React, {useEffect} from 'react';
import {Input, Select} from 'antd';

import {sortBy} from 'utils/array';
import FormComponents from 'components/Form';

const {Option} = Select;
const {TextArea} = Input;
const {GenericPanel} = FormComponents;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const BusinessAddress = props => {
  const {
    t,
    formRef,
    countries = [],
    states = [],
    cities,
    setCities,
    citiesFilter,
    setCitiesFilter,
    onHandleStates
  } = props;

  useEffect(() => {

  }, []);

  return (
      <GenericPanel header={t('business:address')}
                    name={'address'}
                    defaultActiveKey={['address']}>
        <div>
          <Select name={'country'}
                  form={formRef}
                  label={t('address:country')}
                  onSelect={value => {
                    onHandleStates(value);
                    formRef.setFieldsValue({state: null});
                  }}
                  config={{rules: [{required: true}]}}>
            {sortBy(countries, 'name').map(country => (
                <Option key={country?.id}
                        value={country?.id}>
                  {country?.name}
                </Option>
            ))}
          </Select>
          {states.length ? (
              <Select name={'state'}
                      form={formRef}
                      label={t('address:stateProvince')}
                      config={{rules: [{required: true}]}}>
                {sortBy(states, 'name').map(state => (
                    <Option key={state?.short}
                            value={state?.name}>
                      {state?.name}
                    </Option>
                ))}
              </Select>
          ) : <></>}
        </div>
        <div>
          <Input type={'text'}
                 label={t('address:zip')}
                 name={'zip'}
                 form={formRef}
                 allowClear
                 onChange={() => {
                   formRef.setFieldsValue({
                     zip: formRef.getFieldValue('zip').toUpperCase()
                   });
                 }}
                 config={{rules: [{required: true}]}}/>
          <></>
        </div>
        <div>
          <TextArea label={t('address')}
                    name={'address'}
                    rows={4}
                    allowClear
                    form={formRef}
                    config={{rules: [{required: true}]}}/>
          <></>
        </div>
      </GenericPanel>
  );
};
