import React, { useState } from 'react';
import { Divider, Form, Input, Switch } from 'antd';
import { useIntl } from 'umi';
import FormComponents from '@/components/Form';
import { effectHook } from '@/utils/hooks';

const { GenericPanel } = FormComponents;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const FeatureTranslate = (props) => {
  const intl = useIntl();
  const {
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
  const [trOn, setOn] = useState(on);
  const [trOff, setOff] = useState(off);

  const [disabledDescription, setDisabledDescription] = useState(false);
  const [enableHelper, setEnableHelper] = useState(false);

  effectHook(() => {
    const _desc = description?.length;
    if (enableHelper) {
      // TODO (teamco): Do nothing.
    } else {
      setEnableHelper(!!_desc);
      setDisabledDescription(!_desc);
    }
  }, [translate]);

  effectHook(() => {
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

  /**
   * @constant
   * @param {boolean} value
   */
  const toggleHelper = value => {
    setDisabledDescription(!value);
    setEnableHelper(value);
  };

  return (
      <GenericPanel header={intl.formatMessage({id: 'form.translate', defaultMessage: 'Translate Keys'})}
                    name={'translate'}
                    defaultActiveKey={['translate']}>
        <div>
          <>
            <Form.Item label={intl.formatMessage({id: 'form.helper', defaultMessage: 'Show Helper'})}
                       valuePropName={'checked'}>
              <Switch disabled={disabled}
                      checked={enableHelper}
                      onChange={toggleHelper}
                      checkedChildren={intl.formatMessage({id: 'actions.yes', defaultMessage: 'Yes'})}
                      unCheckedChildren={intl.formatMessage({id: 'actions.No', defaultMessage: 'No'})}/>
            </Form.Item>
          </>
        </div>
        <div>
          <Input type={'text'}
                 label={t('form:title')}
                 name={['translateKeys', 'title']}
                 form={formRef}
                 disabled={disabled}
                 onChange={e => handleValue(e, setTitle)}
                 config={{ rules: [{ required: true }] }}/>

          <Input type={'text'}
                 label={intl.formatMessage({id: 'form.description', defaultMessage: 'Description'})}
                 name={['translateKeys', 'description']}
                 form={formRef}
                 disabled={disabled || disabledDescription}
                 onChange={e => handleValue(e, setDescription)}
                 config={{ rules: [{ required: !disabledDescription }] }}/>
        </div>
        <div>
          <Input type={'text'}
                 label={intl.formatMessage({id: 'feature.translateOn', defaultMessage: 'On'})}
                 name={['translateKeys', 'on']}
                 form={formRef}
                 disabled={disabled}
                 onChange={e => handleValue(e, setOn)}
                 config={{ rules: [{ required: true }] }}/>

          <Input type={'text'}
                 label={intl.formatMessage({id: 'feature.translateOff', defaultMessage: 'Off'})}
                 name={['translateKeys', 'off']}
                 form={formRef}
                 disabled={disabled}
                 onChange={e => handleValue(e, setOff)}
                 config={{ rules: [{ required: true }] }}/>
        </div>
        <div>
          <>
            <Divider orientation={'left'}>{intl.formatMessage({id: 'feature.example', defaultMessage: 'Example'})}</Divider>
            <Form.Item label={intl.formatMessage({id: trTitle})}
                       tooltip={intl.formatMessage({id: trDescription})}>
              <Switch checkedChildren={intl.formatMessage({id: trOn})}
                      unCheckedChildren={intl.formatMessage({id: trOff})}/>
            </Form.Item>
          </>
        </div>
      </GenericPanel>
  );
};
