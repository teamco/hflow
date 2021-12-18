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
export const PreferenceTranslate = (props) => {
  const {
    t,
    formRef,
    disabled
  } = props;

  /**
   * @constant
   * @param {string} key
   * @return {*}
   */
  const getValue = key => formRef?.getFieldValue(key);

  const showHelper = !!(getValue('helper'));
  const title = getValue('trTitle');
  const description = getValue('trDescription');
  const on = getValue('trOn');
  const off = getValue('trOff');

  const [disabledHelper, setDisabledHelper] = useState(!showHelper);
  const [trTitle, setTitle] = useState(title);
  const [trDescription, setDescription] = useState(description);
  const [trOn, setOn] = useState(on);
  const [trOff, setOff] = useState(off);

  useEffect(() => {
    setDisabledHelper(!showHelper);
    setDescription(showHelper ? getValue('trDescription') : null);
  }, [showHelper]);

  const handleValue = (e, handler) => {
    const { value } = e.target;
    e.preventDefault();
    handler(value);
  };

  return (
      <GenericPanel header={t('preference:translate')}
                    name={'translate'}
                    defaultActiveKey={['translate']}>
        <div>
          <Input type={'text'}
                 label={t('preference:title')}
                 name={'trTitle'}
                 form={formRef}
                 disabled={disabled}
                 onChange={e => handleValue(e, setTitle)}
                 config={{ rules: [{ required: true }] }}/>

          <Input type={'text'}
                 label={t('preference:description')}
                 name={'trDescription'}
                 form={formRef}
                 disabled={disabled || disabledHelper}
                 onChange={e => handleValue(e, setDescription)}
                 config={{ rules: [{ required: true }] }}/>
        </div>
        <div>
          <Input type={'text'}
                 label={t('preference:translateOn')}
                 name={'trOn'}
                 form={formRef}
                 disabled={disabled}
                 onChange={e => handleValue(e, setOn)}
                 config={{ rules: [{ required: true }] }}/>

          <Input type={'text'}
                 label={t('preference:translateOff')}
                 name={'trOff'}
                 form={formRef}
                 disabled={disabled}
                 onChange={e => handleValue(e, setOff)}
                 config={{ rules: [{ required: true }] }}/>
        </div>
        <div>
          <>
            <Divider orientation={'left'}>{t('preference:example')}</Divider>
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
