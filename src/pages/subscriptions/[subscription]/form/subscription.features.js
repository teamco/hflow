import React  from 'react';
import { Select, Switch } from 'antd';
import { useIntl } from 'umi';
import FormComponents from '@/components/Form';
import EmptyData from '@/components/EmptyData';

import { sortBy } from '@/utils/array';
import { effectHook } from '@/utils/hooks';

const { GenericPanel } = FormComponents;
const { Option } = Select;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const SubscriptionFeatures = (props) => {
  const intl = useIntl();
  const {
    isEdit,
    formRef,
    disabled,
    features = [],
    featureTypes = [],
    selectedSubscription,
    onChangeFeatureType
  } = props;

  effectHook(() => {
    [...features].forEach(pref => {
      const value = (formRef.getFieldValue('featuresByRef') || {})[pref.id];
      if (typeof value === 'undefined') {
        formRef.setFieldsValue({ featuresByRef: { [pref.id]: isEdit ? false : pref.selectedByDefault } });
      }
    });
  }, [features, selectedSubscription]);

  const colProps = { xs: 24, sm: 12, md: 8, lg: 8, xl: 6, xxl: 4 };

  return (
      <GenericPanel header={intl.formatMessage({id: 'subscription.features', defaultMessage: 'Features'})}
                    name={'features'}
                    defaultActiveKey={['features']}>
        <div colProps={colProps}>
          <Select name={'featureType'}
                  form={formRef}
                  label={intl.formatMessage({id: 'feature.type', defaultMessage: 'Subscription Type'})}
                  disabled={disabled}
                  onChange={onChangeFeatureType}
                  config={{ rules: [{ required: true }] }}>
            {[...featureTypes].sort().map((type, idx) => (
                <Option key={idx}
                        value={type}>
                  {type}
                </Option>
            ))}
          </Select>
        </div>
        {features.length ? (
            <div colProps={colProps}>
              {sortBy(features, 'translateKeys.title', t).map((pref, idx) => {
                const { title, description, on, off } = pref.translateKeys;

                const _helper = description ? intl.formatMessage({id: description, defaultMessage: ''}) : null;

                return (
                    <Switch key={idx}
                            label={intl.formatMessage({id: title, defaultMessage: ''})}
                            disabled={disabled}
                            form={formRef}
                            tooltip={_helper}
                            config={{ valuePropName: 'checked' }}
                            checkedChildren={intl.formatMessage({id: on, defaultMessage: ''})}
                            unCheckedChildren={intl.formatMessage({id: off, defaultMessage: ''})}
                            name={['featuresByRef', pref.id]}/>
                );
              })}
            </div>
        ) : (
            <>
              <EmptyData/>
            </>
        )}
      </GenericPanel>
  );
};
