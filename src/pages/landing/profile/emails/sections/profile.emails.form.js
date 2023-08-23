import React, { useState } from 'react';
import { useIntl } from '@umijs/max';
import {
  Divider,
  Button,
  Form,
  Input,
  Select,
  Switch,
  Tooltip,
  Space
} from 'antd';

import {
  PlusCircleOutlined,
  QuestionCircleTwoTone
} from '@ant-design/icons';

import { isSpinning } from '@/utils/state';
import { t } from '@/utils/i18n';
import { effectHook } from '@/utils/hooks';
import { stub } from '@/utils/function';

import { formProps } from '@/components/Form/formProps';
import { requiredField } from '@/components/Form';
import SaveButton from '@/components/Buttons/save.button';
import Loader from '@/components/Loader';

import styles from '@/pages/landing/profile/emails/profile.emails.module.less';

const MODEL_NAME = 'profileEmailModel';

export const ProfileEmailsForm = props => {
  const intl = useIntl();
  const [formRef] = Form.useForm();

  const [privateHelper, setPrivateHelper] = useState(false);
  const [disablePrimarySave, setDisablePrimarySave] = useState(true);

  const {
    loading,
    user,
    canUpdate,
    touched,
    isEdit,
    ableFor,
    component,
    entityForm,
    multiplePrimaryEmails,
    primaries,
    disabled,
    disableSave,
    childRefs,
    privateH,
    publicH,
    sEmails = [],
    isReadOnly = stub,
    handleSaveBtn = stub,
    findEmailIdx = stub,
    includesEmail = stub,
    setPrimaries = stub,
    setEdit = stub,
    setSelected = stub,
    setDisableSave = stub,
    setFormRef = stub,
    onSave = stub,
    onSetPrimary = stub,
    onFieldsChange = stub
  } = props;

  effectHook(() => {
    setFormRef(formRef);
  }, [formRef]);

  const handlePrivate = () => {
    return (
        <>
          <Tooltip title={privateHelper ? privateH : publicH}>
            <QuestionCircleTwoTone/>
          </Tooltip>
          <Form.Item name={'private'} noStyle
                     valuePropName={'checked'}>
            <Switch checkedChildren={t(intl, 'profile.type.private')}
                    unCheckedChildren={t(intl, 'profile.type.public')}
                    disabled={disabled || isReadOnly()}
                    onChange={setPrivateHelper}/>
          </Form.Item>
        </>
    );
  };

  const handlePrimary = (value) => {
    let _primaries = [];
    const email = sEmails.find(e => e.mail === value);

    if (user.email === value || !email) return false;

    if (multiplePrimaryEmails) {
      if (primaries.indexOf(value) > -1) {
        if (primaries.length > 1) {
          _primaries = primaries.filter(e => e.mail !== value);
        }
      } else {
        _primaries = [...primaries, email];
      }

      setDisablePrimarySave(false);

    } else {

      _primaries = [email];
      setDisablePrimarySave(email.primary);
    }

    setPrimaries([..._primaries]);
    setSelected(childRefs[findEmailIdx(value)]);
  };

  const handleEdit = (email) => {
    setEdit(true);
    formRef.setFieldValue('mail', email.mail);
    formRef.setFieldValue('private', email.private);
    setSelected(childRefs[findEmailIdx(email.mail)]);
    handleSaveBtn();
  };

  const onChangeFormProps = {
    touched,
    entityForm,
    loading,
    spinOn: [`${MODEL_NAME}/getEmails`],
    onFinish(formValues) {
      if (canUpdate) {
        onSave(formValues);
        formRef.setFieldValue('mail', null);
        setEdit(false);
        setSelected(null);
        setDisableSave(true);
      }
    },
    onFieldsChange
  };

  const spinOn = [`${MODEL_NAME}/updateEmails`];

  return (
      <Loader loading={loading} spinOn={spinOn}>
        <Form {...formProps(onChangeFormProps)}
              form={formRef}
              rootClassName={styles.form}
              initialValues={{
                mail: null,
                private: true
              }}>
          <Form.Item label={t(intl, 'form.email')}>
            <Space.Compact className={styles.group}>
              {handlePrivate()}
              <Form.Item noStyle
                         name={'mail'}
                         validateTrigger={['onChange', 'onBlur']}
                         rules={[
                           {
                             ...requiredField(intl, t(intl, 'form.email')),
                             type: 'email'
                           },
                           ({ getFieldValue }) => ({
                             validator(_, value = '') {
                               return isEdit ?
                                   Promise.resolve() :
                                   includesEmail(value) ?
                                       Promise.reject(
                                           t(intl, 'form.email.exists')) :
                                       Promise.resolve();
                             }
                           })]}>
                <Input placeholder={t(intl, 'form.email')}
                       style={{ width: 'auto' }}
                       disabled={disabled || isReadOnly()}
                       allowClear
                       onChange={handleSaveBtn}
                       onBlur={handleSaveBtn}
                       type={'text'}/>
              </Form.Item>
              <SaveButton key={`${component}.save`}
                          isEdit={isEdit}
                          formRef={formRef}
                          component={component}
                          canType={ableFor}
                          modelName={MODEL_NAME}
                          disabled={!touched || disabled || disableSave ||
                              isReadOnly()}
                          spinOn={[`${MODEL_NAME}/prepareToAddEmail`]}
                          icon={<PlusCircleOutlined/>}
                          size={'default'}
                          type={'primary'}
                          titleBtn={isEdit ?
                              t(intl, 'actions.update') :
                              t(intl, 'actions.addNew')}
                          loading={loading}/>
            </Space.Compact>
          </Form.Item>
          <Divider/>
          <div className={styles.itemLabel}>
            <label title={t(intl, 'form.email.primary')}>{t(intl,
                'form.email.primary')}</label>
            {primaries?.length ? (
                <p>
                  {primaries.map((email, idx) => (
                      <strong key={idx} onClick={() => handleEdit(email)}>
                        {email.mail}
                      </strong>))}
                  {t(intl, 'form.email.primary.description')}
                </p>
            ) : null}
          </div>
          <Space.Compact>
            <Select options={[
              ...sEmails.filter(
                  e => e.mail !== user.email && (!e.private && e.verified)).
                  map(email => ({ value: email.mail }))]}
                    value={[...primaries.map(email => email.mail)]}
                    placeholder={t(intl, 'form.email.primary')}
                    onSelect={handlePrimary}/>
            <Button disabled={disabled || disablePrimarySave}
                    loading={isSpinning(loading,
                        [`${MODEL_NAME}/prepareToSetPrimary`])}
                    onClick={() => onSetPrimary(primaries)}
                    type={'primary'}>
              {t(intl, 'actions.save')}
            </Button>
          </Space.Compact>
        </Form>
      </Loader>
  );
};