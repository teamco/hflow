import React, { useEffect, useState } from 'react';

import { Divider, Form, Input, Switch } from 'antd';
import FormComponents from 'components/Form';

const { GenericPanel } = FormComponents;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const FeatureTranslate = (props) => {
  const {
    t,
    formRef,
    disabled,
    disabledDescription
  } = props;

  /**
   * @constant
   * @param {string} key
   * @return {*}
   */
  const getValue = key => formRef?.getFieldValue(key);

  const translate = getValue('translateKeys');
  const { title, description, on, off } = translate || {};

  const [trTitle, setTitle] = useState(title);
  const [trDescription, setDescription] = useState(description);
  const [trOn, setOn] = useState(on);
  const [trOff, setOff] = useState(off);

  useEffect(() => {
    setTitle(title);
    setDescription(description);
    setOn(on);
    setOff(off);
  }, [translate]);

  /**
   * @constant
   * @param {Event} e
   * @param {function} handler
   */
  const handleValue = (e, handler) => {
    const { value } = e.target;
    e.preventDefault();
    handler(value);
  };

  return (
      <GenericPanel header={t('feature:translate')}
                    name={'translate'}
                    defaultActiveKey={['translate']}>
        <div>
          <Input type={'text'}
                 label={t('feature:title')}
                 name={['translateKeys', 'title']}
                 form={formRef}
                 disabled={disabled}
                 onChange={e => handleValue(e, setTitle)}
                 config={{ rules: [{ required: true }] }}/>

          <Input type={'text'}
                 label={t('feature:description')}
                 name={['translateKeys', 'description']}
                 form={formRef}
                 disabled={disabled || disabledDescription}
                 onChange={e => handleValue(e, setDescription)}
                 config={{ rules: [{ required: !disabledDescription }] }}/>
        </div>
        <div>
          <Input type={'text'}
                 label={t('feature:translateOn')}
                 name={['translateKeys', 'on']}
                 form={formRef}
                 disabled={disabled}
                 onChange={e => handleValue(e, setOn)}
                 config={{ rules: [{ required: true }] }}/>

          <Input type={'text'}
                 label={t('feature:translateOff')}
                 name={['translateKeys', 'off']}
                 form={formRef}
                 disabled={disabled}
                 onChange={e => handleValue(e, setOff)}
                 config={{ rules: [{ required: true }] }}/>
        </div>
        <div>
          <>
            <Divider orientation={'left'}>{t('feature:example')}</Divider>
            <Form.Item label={t(trTitle)}
                       tooltip={t(trDescription)}>
              <Switch checkedChildren={t(trOn)}
                      unCheckedChildren={t(trOff)}/>
            </Form.Item>
          </>
        </div>
      </GenericPanel>
  );
};
