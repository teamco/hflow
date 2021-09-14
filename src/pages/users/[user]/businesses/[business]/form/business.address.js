import React from 'react';
import { Input, Select, AutoComplete } from 'antd';
import { sortBy } from 'utils/array';
import FormComponents, { getSuffix } from 'components/Form';

import { cities, regions } from 'canada';
import postalCodes from 'postal-codes-js';

import { getSelectedCountry } from 'pages/users/[user]/businesses/[business]/form/business.info';

const { Option } = Select;
const { GenericPanel } = FormComponents;

/**
 * @constant
 * @param setCities
 * @param setCitiesFilter
 * @param value
 */
const handleCities = ({ setCities, setCitiesFilter, value }) => {
  const province = Object.keys(regions).find(province => regions[province] === value);
  const _cities = cities.filter(cityData => cityData[1] === province).map(cityData => cityData[0]);
  setCities(_cities);
  setCitiesFilter(_cities.map(city => ({ value: city })));
};

/**
 * @constant
 * @param cities
 * @param setCitiesFilter
 * @param value
 */
const onSearchCity = ({ cities, setCitiesFilter, value }) => {
  const regexp = new RegExp(`^${value}`, 'i');
  const filtered = cities.filter(city => city.toLowerCase().match(regexp));
  setCitiesFilter(filtered.map(city => ({ value: city })));
};

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
               disabled={!getSelectedCountry(formRef)}
               onChange={() => {
                 formRef.setFieldsValue({
                   zip: formRef.getFieldValue('zip').toUpperCase()
                 });
               }}
               config={{
                 rules: [
                   { required: true },
                   ({ getFieldValue }) => ({
                     validator(_, value) {
                       const selectedCountry = getFieldValue('country') || '';
                       const country = countries.find(country => country.name === selectedCountry);
                       const validation = country && postalCodes.validate(country.id, value);
                       if (typeof validation === 'string') {
                         return Promise.reject(validation);
                       }
                       return Promise.resolve();
                     }
                   })
                 ]
               }} />
      </div>
      <div>
        <Select name={'province'}
                form={formRef}
                disabled={!getSelectedCountry(formRef)}
                label={t('address:province')}
                onSelect={value => handleCities({ setCities, setCitiesFilter, value })}
                config={{ rules: [{ required: true }] }}>
          {Object.keys(regions).sort().map((region, idx) => (
            <Option key={idx}
                    value={regions[region]}>
              {regions[region].toUpperCase()}
            </Option>
          ))}
        </Select>
        <AutoComplete options={citiesFilter}
                      name={'city'}
                      form={formRef}
                      disabled={!formRef.getFieldValue('province')}
                      label={t('address:city')}
                      onSearch={value => onSearchCity({ cities, setCitiesFilter, value })}
                      config={{ rules: [{ required: true }] }}>
          <Input suffix={getSuffix(t, formRef, 'city', t('address:city'))} />
        </AutoComplete>
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