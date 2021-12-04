import React from 'react';
import { Switch } from 'antd';

import FormComponents from 'components/Form';

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
    formRef,
    disabled
  } = props;

  return (
      <GenericPanel header={t('subscription:preferences')}
                    name={'preferences'}
                    defaultActiveKey={['preferences']}>
        <div>
          <Switch label={t('subscription:profile')}
                  disabled={disabled}
                  form={formRef}
                  tooltip={t('subscription:profileTooltip')}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={t('subscription:fullProfile')}
                  unCheckedChildren={t('subscription:basicProfile')}
                  name={'profile'}/>
          <Switch label={t('subscription:analytics')}
                  disabled={disabled}
                  form={formRef}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={t('subscription:fullAnalytics')}
                  unCheckedChildren={t('subscription:basicAnalytics')}
                  name={'analytics'}/>
          <></>
        </div>
        <div>
          <Switch label={t('subscription:placementOnMap')}
                  config={{ valuePropName: 'checked' }}
                  disabled={disabled}
                  form={formRef}
                  checkedChildren={t('actions:yes')}
                  unCheckedChildren={t('actions:no')}
                  name={'placementOnMap'}/>
          <Switch label={t('subscription:accessToMessages')}
                  config={{ valuePropName: 'checked' }}
                  disabled={disabled}
                  form={formRef}
                  checkedChildren={t('actions:yes')}
                  unCheckedChildren={t('actions:no')}
                  name={'accessToMessages'}/>
          <Switch label={t('subscription:dashboard')}
                  disabled={disabled}
                  form={formRef}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={t('actions:yes')}
                  unCheckedChildren={t('actions:no')}
                  name={'dashboard'}/>
        </div>
        <div>
          <Switch label={t('subscription:notifications')}
                  disabled={disabled}
                  form={formRef}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={t('actions:yes')}
                  unCheckedChildren={t('actions:no')}
                  name={'notifications'}/>
          <Switch label={t('subscription:requestList')}
                  disabled={disabled}
                  form={formRef}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={t('actions:yes')}
                  unCheckedChildren={t('actions:no')}
                  name={'requestList'}/>
          <Switch label={t('subscription:logoOnPartnersPage')}
                  disabled={disabled}
                  form={formRef}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={t('actions:yes')}
                  unCheckedChildren={t('actions:no')}
                  name={'logoOnPartnersPage'}/>
        </div>
      </GenericPanel>
  );
};
