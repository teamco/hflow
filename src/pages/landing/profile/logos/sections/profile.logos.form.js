import React from 'react';
import { useIntl } from '@umijs/max';
import { Col, Divider, Form, Input, Row, Switch } from 'antd';
import classnames from 'classnames';

import { layout } from '@/utils/layout';
import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';

import { formProps } from '@/components/Form/formProps';
import { FormInput, requiredField } from '@/components/Form';
import UploadFile from '@/components/Upload';
import Loader from '@/components/Loader';

import styles from '@/pages/landing/profile/logos/profile.logos.module.less';

const MODEL_NAME = 'profileLogoModel';

export const ProfileLogosForm = props => {
  const intl = useIntl();

  const {
    loading,
    formRef,
    profileLogoModel,
    canUpdate,
    disabled,
    selected,
    setSelected = stub,
    onSave = stub,
    onFieldsChange = stub,
    onFileRemove = stub,
    onFileChange = stub
  } = props;

  const {
    touched,
    entityForm,
    uploadedFiles,
    maxLogoDimensions
  } = profileLogoModel;

  const onChangeFormProps = {
    touched,
    entityForm,
    loading,
    spinOn: [`${MODEL_NAME}/getLogos`],
    onFieldsChange,
    onFinish(formValues) {
      if (canUpdate) {
        onSave(formValues, selected);
        formRef.resetFields();
        setSelected(false);
      }
    }
  };

  const uploadLogo = {
    field: 'profileLogo',
    uploadedFiles,
    onFileRemove,
    onFileChange,
    // crop: false,
    formRef,
    maxDimensions: { ...maxLogoDimensions }
  };

  const initialValues = {
    profileLogo: null,
    logo: {
      primary: null,
      file: null,
      filename: null,
      current: false,
      title: null,
      altText: null,
      description: null
    }
  };

  const spinOn = [`${MODEL_NAME}/updateLogos`];

  return (
      <Loader loading={loading} spinOn={spinOn}>
        <div className={classnames(styles.profileLogosFormSection)}>
          <Form {...formProps(onChangeFormProps)}
                form={formRef}
                rootClassName={styles.form}
                initialValues={initialValues}>
            <Row gutter={[24, 24]}>
              <Col {...layout.fullColumn}>
                <Form.Item name={'profileLogo'}
                           rules={[
                             requiredField(intl, t(intl, 'form.image',
                                 { type: t(intl, 'profile') }))
                           ]}
                           label={t(intl, 'form.image',
                               { type: t(intl, 'profile') })}
                           valuePropName={'fileList'}>
                  <UploadFile disabled={disabled}
                              className={styles.uploadLogo}
                              {...uploadLogo}/>
                </Form.Item>
              </Col>
              <Col {...layout.halfColumn}>
                <Form.Item name={['logo', 'primary']}
                           label={t(intl, 'form.image.primary')}
                           valuePropName={'checked'}>
                  <Switch checkedChildren={t(intl, 'profile.logo.primary')}
                          unCheckedChildren={t(intl, 'profile.logo.private')}
                          disabled={disabled}/>
                </Form.Item>
              </Col>
            </Row>
            <Divider/>
            <Row gutter={[24, 24]}>
              <Col {...{ ...layout.halfColumn, lg: 24 }}>
                <FormInput name={['logo', 'title']}
                           label={t(intl, 'form.image.title')}
                           intl={intl}
                           required={false}
                           disabled={disabled}/>
              </Col>
              <Col {...{ ...layout.halfColumn, lg: 24 }}>
                <FormInput name={['logo', 'altText']}
                           label={t(intl, 'form.image.altText')}
                           intl={intl}
                           required={false}
                           disabled={disabled}/>
              </Col>
            </Row>
            <Row gutter={[24, 24]}>
              <Col {...layout.fullColumn}>
                <Form.Item label={t(intl, 'form.image.description')}
                           name={['logo', 'description']}>
                  <Input.TextArea showCount
                                  maxLength={100}
                                  disabled={disabled}
                                  style={{ height: 120, resize: 'none' }}
                                  placeholder={t(intl,
                                      'form.image.description')}/>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Loader>
  );
};