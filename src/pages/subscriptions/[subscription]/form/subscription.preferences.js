import React, { useEffect } from 'react';
import { Switch } from 'antd';

import FormComponents from 'components/Form';
import { sortBy } from 'utils/array';

const { GenericPanel } = FormComponents;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const SubscriptionPreferences = (props) => {
  const {
    t,
    isEdit,
    formRef,
    disabled,
    preferences = [],
    selectedSubscription
  } = props;

  useEffect(() => {
    [...preferences].forEach(pref => {
      const value = (formRef.getFieldValue('preferences') || {})[pref.id];
      if (typeof value === 'undefined') {
        formRef.setFieldsValue({ preferences: { [pref.id]: isEdit ? false : pref.selectedByDefault } });
      }
    });
  }, [preferences, selectedSubscription]);

  return (
      <GenericPanel header={t('subscription:preferences')}
                    name={'preferences'}
                    defaultActiveKey={['preferences']}>
        <div>
          {sortBy(preferences, 'translateKeys.title', t).map((pref, idx) => {
            const {
              title,
              description,
              on,
              off
            } = pref.translateKeys;

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
                        name={['preferences', pref.id]}/>
            );
          })}
        </div>
      </GenericPanel>
  );
};
