import React, { useEffect } from 'react';

import { Switch } from 'antd';
import FormComponents from 'components/Form';

const { GenericPanel } = FormComponents;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const PreferenceInfo = (props) => {
  const {
    t,
    formRef,
    disabled
  } = props;

  const translate = formRef?.getFieldValue('translateKeys');
  const { description } = translate || {};

  useEffect(() => {
    if (!description?.length) {
      console.log(12);
    }
  }, [translate]);

  const handleHelper = e => {
    console.log(e);
  };

  return (
      <GenericPanel header={t('preference:info')}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div>
          <>
            <Switch label={t('preference:helper')}
                    disabled={disabled}
                    form={formRef}
                    onChange={handleHelper}
                    config={{ valuePropName: 'checked' }}
                    checkedChildren={t('actions:yes')}
                    unCheckedChildren={t('actions:no')}/>
          </>
          <Switch label={t('preference:status')}
                  disabled={disabled}
                  form={formRef}
                  config={{ valuePropName: 'checked' }}
                  checkedChildren={t('actions:yes')}
                  unCheckedChildren={t('actions:no')}
                  name={'selectedByDefault'}/>
        </div>
      </GenericPanel>
  );
};
