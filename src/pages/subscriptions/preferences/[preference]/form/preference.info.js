import React, { useEffect, useState } from 'react';

import { Form, Switch } from 'antd';
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
    disabled,
    setDisabledDescription
  } = props;

  const translate = formRef?.getFieldValue('translateKeys');
  const { description } = translate || {};

  const [enableHelper, setEnableHelper] = useState(false);

  useEffect(() => {
    const _desc = description?.length;
    setEnableHelper(_desc);
    setDisabledDescription(!_desc);
  }, [translate]);

  /**
   * @constant
   * @param {boolean} value
   */
  const handleHelper = value => {
    setDisabledDescription(!value);
  };

  return (
      <GenericPanel header={t('preference:info')}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div>
          <>
            <Form.Item label={t('preference:helper')}
                       valuePropName={'checked'}>
              <Switch disabled={disabled}
                      checked={enableHelper}
                      onChange={handleHelper}
                      checkedChildren={t('actions:yes')}
                      unCheckedChildren={t('actions:no')}/>
            </Form.Item>
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
