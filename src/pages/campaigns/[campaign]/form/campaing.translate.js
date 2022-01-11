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
export const CampaignTranslate = (props) => {
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

  const translate = getValue('translateKeys');
  const { title, description, on, off } = translate || {};

  const [trTitle, setTitle] = useState(title);
  const [trDescription, setDescription] = useState(description);

  useEffect(() => {
    setTitle(title);
    setDescription(description);
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
                 label={t('campaign:title')}
                 name={['translateKeys', 'title']}
                 form={formRef}
                 disabled={disabled}
                 onChange={e => handleValue(e, setTitle)}
                 config={{ rules: [{ required: false }] }} />
          <Input type={'text'}
                 label={t('campaign:description')}
                 name={['translateKeys', 'description']}
                 form={formRef}
                 disabled={disabled}
                 onChange={e => handleValue(e, setDescription)}
                 config={{ rules: [{ required: false }] }}/>
        </div>
        <div>
          <>
            <Divider orientation={'left'}>{t('feature:example')}</Divider>
            <Form.Item label={t(trTitle)}
                       tooltip={t(trDescription)}>
            </Form.Item>
          </>
        </div>
      </GenericPanel>
  );
};
