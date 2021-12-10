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
export const CampaignPreferences = (props) => {
  const {
    t,
    formRef,
    disabled
  } = props;

  return (
      <GenericPanel header={t('campaign:preferences')}
                    name={'preferences'}
                    defaultActiveKey={['preferences']}>
        <div>
          <Switch label={t('campaign:profile')}
                  disabled={disabled}
                  form={formRef}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={t('campaign:fullProfile')}
                  unCheckedChildren={t('campaign:basicProfile')}
                  name={'profile'}/>
          <Switch label={t('campaign:analytics')}
                  disabled={disabled}
                  form={formRef}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={t('campaign:fullAnalytics')}
                  unCheckedChildren={t('campaign:basicAnalytics')}
                  name={'analytics'}/>
          <></>
        </div>
        <div>
          <Switch label={t('campaign:placementOnMap')}
                  config={{ valuePropName: 'checked' }}
                  disabled={disabled}
                  form={formRef}
                  checkedChildren={t('actions:yes')}
                  unCheckedChildren={t('actions:no')}
                  name={'placementOnMap'}/>
          <Switch label={t('campaign:accessToMessages')}
                  config={{ valuePropName: 'checked' }}
                  disabled={disabled}
                  form={formRef}
                  checkedChildren={t('actions:yes')}
                  unCheckedChildren={t('actions:no')}
                  name={'accessToMessages'}/>
          <Switch label={t('campaign:dashboard')}
                  disabled={disabled}
                  form={formRef}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={t('actions:yes')}
                  unCheckedChildren={t('actions:no')}
                  name={'dashboard'}/>
        </div>
        <div>
          <Switch label={t('campaign:notifications')}
                  disabled={disabled}
                  form={formRef}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={t('actions:yes')}
                  unCheckedChildren={t('actions:no')}
                  name={'notifications'}/>
          <Switch label={t('campaign:requestList')}
                  disabled={disabled}
                  form={formRef}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={t('actions:yes')}
                  unCheckedChildren={t('actions:no')}
                  name={'requestList'}/>
          <Switch label={t('campaign:logoOnPartnersPage')}
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
