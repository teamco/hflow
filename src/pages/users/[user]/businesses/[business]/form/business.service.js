import React, { useState, useEffect } from 'react';
import { Select, Switch } from 'antd';

import FormComponents from 'components/Form';
import { sortBy } from 'utils/array';
import { asSortedTags, fromForm, toTags } from 'utils/object';

const { GenericPanel, EditableTags } = FormComponents;
const { Option } = Select;

/**
 * @export
 * @param t
 * @param formRef
 * @param onUpdateTags
 * @param tags
 * @param businessServiceModel
 * @param businessPreparationModel
 * @param dietaryModel
 * @param startersAndDessertsModel
 * @return {JSX.Element}
 * @constructor
 */
export const BusinessService = ({
  t,
  formRef,
  onUpdateTags,
  tags,
  businessServiceModel,
  businessPreparationModel,
  dietaryModel,
  startersAndDessertsModel
}) => {

  const [serviceTags, setServiceTags] = useState([]);
  const [preparationTags, setPreparationTags] = useState([]);
  const [dietaryTags, setDietaryTags] = useState([]);
  const [startersAndDessertsTags, setStartersAndDessertsTags] = useState([]);

  useEffect(() => {
    setServiceTags(toTags(businessServiceModel.tags));
    setPreparationTags(toTags(businessPreparationModel.tags));
    setDietaryTags(toTags(dietaryModel.tags));
    setStartersAndDessertsTags(toTags(startersAndDessertsModel.tags));
  }, [
    businessServiceModel.tags,
    businessPreparationModel.tags,
    dietaryModel.tags,
    startersAndDessertsModel.tags
  ]);

  /**
   * @function
   * @param value
   * @param tags
   * @param setter
   * @param limit
   */
  function handleChange(value, tags, setter, limit = -1) {
    const disabledTags = tags.map(tag => ({
      name: tag,
      disabled: value.length >= limit ?
        value.indexOf(tag) === -1 :
        false
    }));

    setter(limit === -1 ? toTags(tags) : disabledTags);
  }

  return (
    <GenericPanel header={t('business:services')}
                  name={'services'}
                  defaultActiveKey={['services']}>
      <div>
        <Select allowClear
                form={formRef}
                mode={'multiple'}
                name={'serviceStyle'}
                label={t('business:serviceStyle')}
                config={{ rules: [{ required: true }] }}
                maxTagCount={'responsive'}
                showArrow={true}
                onChange={value => handleChange(
                  value,
                  businessServiceModel.tags,
                  setServiceTags,
                  fromForm(businessServiceModel.entityForm, 'max_services')
                )}>
          {asSortedTags(serviceTags)}
        </Select>
        <Select allowClear
                form={formRef}
                mode={'multiple'}
                name={'preparationStyle'}
                label={t('business:preparationStyle')}
                config={{ rules: [{ required: true }] }}
                maxTagCount={'responsive'}
                showArrow={true}
                onChange={value => handleChange(
                  value,
                  businessPreparationModel.tags,
                  setPreparationTags,
                  fromForm(businessPreparationModel.entityForm, 'max_preparations')
                )}>
          {asSortedTags(preparationTags)}
        </Select>
      </div>
      <div>
        <Select allowClear
                form={formRef}
                mode={'multiple'}
                name={'dietary'}
                label={t('business:dietary')}
                config={{ rules: [{ required: true }] }}
                maxTagCount={'responsive'}
                showArrow={true}
                onChange={value => handleChange(
                  value,
                  dietaryModel.tags,
                  setDietaryTags
                )}>
          {asSortedTags(dietaryTags)}
        </Select>
        <Select allowClear
                form={formRef}
                mode={'multiple'}
                name={'startersAndDesserts'}
                label={t('business:startersAndDesserts')}
                config={{ rules: [{ required: true }] }}
                maxTagCount={'responsive'}
                showArrow={true}
                onChange={value => handleChange(
                  value,
                  startersAndDessertsModel.tags,
                  setStartersAndDessertsTags
                )}>
          {asSortedTags(startersAndDessertsTags)}
        </Select>
      </div>
      <div>
        <EditableTags label={t('form:tags')}
                      name={'tags'}
                      onChange={onUpdateTags}
                      tags={tags} />
        <Switch label={t('business:delivery')}
                config={{ valuePropName: 'checked' }}
                name={'delivery'} />
      </div>
    </GenericPanel>
  );
};