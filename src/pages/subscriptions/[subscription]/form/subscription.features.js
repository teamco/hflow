import React, { useEffect } from 'react';
import { Switch } from 'antd';

import FormComponents from '@/components/Form';
import EmptyData from '@/components/EmptyData';

import { sortBy } from '@/utils/array';

const { GenericPanel } = FormComponents;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const SubscriptionFeatures = (props) => {
  const {
    t,
    isEdit,
    formRef,
    disabled,
    features = [],
    selectedSubscription
  } = props;

  useEffect(() => {
    [...features].forEach(pref => {
      const value = (formRef.getFieldValue('featuresByRef') || {})[pref.id];
      if (typeof value === 'undefined') {
        formRef.setFieldsValue({ featuresByRef: { [pref.id]: isEdit ? false : pref.selectedByDefault } });
      }
    });
  }, [features, selectedSubscription]);

  return (
      <GenericPanel header={t('subscription:features')}
                    name={'features'}
                    defaultActiveKey={['features']}>
        {features.length ? (
            <div colProps={{ xs: 24, sm: 12, md: 8, lg: 8, xl: 6, xxl: 4 }}>
              {sortBy(features, 'translateKeys.title', t).map((pref, idx) => {
                const { title, description, on, off } = pref.translateKeys;

                const _helper = description ? t(description) : null;

                return (
                    <Switch key={idx}
                            label={t(title)}
                            disabled={disabled}
                            form={formRef}
                            tooltip={_helper}
                            config={{ valuePropName: 'checked' }}
                            checkedChildren={t(on)}
                            unCheckedChildren={t(off)}
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
