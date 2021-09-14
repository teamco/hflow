import React from 'react';
import { Input, Select } from 'antd';
import { sortBy } from 'utils/array';
import FormComponents  from 'components/Form';

const { Option } = Select;
const { GenericPanel } = FormComponents;

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
    countries,
    cities,
    setCities,
    citiesFilter,
    setCitiesFilter
  } = props;

  return (
    <GenericPanel header={t('business:address')}
                  name={'address'}
                  defaultActiveKey={['address']}>
      <div>
        <Select name={'country'}
                form={formRef}
                label={t('address:country')}
                config={{ rules: [{ required: true }] }}>
          {sortBy(countries, 'name').map(country => (
            <Option key={country.id}
                    value={country.name}>
              {country.name}
            </Option>
          ))}
        </Select>
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
               config={{
                 rules: [
                   { required: true }
                 ]
               }} />
      </div>
      <div>
      </div>
      <div>
        <Input type={'text'}
               label={t('address')}
               name={'address'}
               allowClear
               form={formRef}
               config={{ rules: [{ required: true }] }} />
        <></>
      </div>
    </GenericPanel>
  );
};
