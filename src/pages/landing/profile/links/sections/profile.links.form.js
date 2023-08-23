import React from 'react';
import { useIntl } from '@umijs/max';
import { Col, Divider, Form, Input, Row, Switch } from 'antd';
import classnames from 'classnames';

import { layout } from '@/utils/layout';
import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';

import { formProps } from '@/components/Form/formProps';
import { FormInput, requiredField } from '@/components/Form';
import EditableTags from '@/components/Form/EditableTags';
import Loader from '@/components/Loader';

import styles from '@/pages/landing/profile/links/profile.links.module.less';

const MODEL_NAME = 'profileLinkModel';

export const ProfileLinksForm = props => {
  const intl = useIntl();

  const {
    loading,
    formRef,
    profileLinkModel,
    canUpdate,
    disabled,
    selected,
    setSelected = stub,
    onSave = stub,
    onUpdateTags = stub,
    onFieldsChange = stub
  } = props;

  const {
    touched,
    entityForm,
    tags
  } = profileLinkModel;

  const onChangeFormProps = {
    touched,
    entityForm,
    loading,
    spinOn: [`${MODEL_NAME}/getLinks`],
    onFieldsChange,
    onFinish(formValues) {
      if (canUpdate) {
        onSave(formValues, selected);

        onUpdateTags([]);
        formRef.resetFields();
        setSelected(false);
      }
    }
  };

  const initialValues = {
    url: null,
    title: null,
    description: null,
    tags
  };

  const tagsProps = {
    formRef,
    name: 'tags',
    disabled,
    tags,
    loading,
    canUpdate,
    onChange: onUpdateTags,
    canDelete: canUpdate,
    canCreate: canUpdate,
    header: t(intl, 'campaigns.tags')
  };

  const spinOn = [`${MODEL_NAME}/updateLinks`];

  return (
      <Loader loading={loading} spinOn={spinOn}>
        <div className={classnames(styles.profileLinkFormSection)}>
          <Form {...formProps(onChangeFormProps)}
                form={formRef}
                rootClassName={styles.form}
                initialValues={initialValues}>
            <Row gutter={[24, 24]}>
              <Col {...layout.halfColumn}>
                <Form.Item name={'private'}
                           label={t(intl, 'profile.link.type')}
                           valuePropName={'checked'}>
                  <Switch checkedChildren={t(intl, 'profile.link.private')}
                          unCheckedChildren={t(intl, 'profile.link.public')}
                          disabled={disabled}/>
                </Form.Item>
              </Col>
              <Col {...layout.fullColumn}>
                <FormInput name={'url'}
                           label={'URL'}
                           intl={intl}
                           required={true}
                           disabled={disabled}/>
              </Col>
              <Col {...layout.fullColumn}>
                <FormInput name={'title'}
                           label={t(intl, 'form.title')}
                           intl={intl}
                           required={true}
                           disabled={disabled}/>
              </Col>
              <Col {...layout.fullColumn}>
                <Form.Item label={t(intl, 'form.description')}
                           name={'description'}
                           rules={[
                             requiredField(intl, t(intl, 'form.description'),
                                 false)]}>
                  <Input.TextArea showCount
                                  maxLength={100}
                                  disabled={disabled}
                                  style={{ height: 120, resize: 'none' }}
                                  placeholder={t(intl, 'form.description')}/>
                </Form.Item>
              </Col>
            </Row>
            <Divider/>
            <Row gutter={[24, 24]}>
              <Col {...layout.fullColumn}>
                <Form.Item label={t(intl, 'form.tags')}
                           name={'tags'}>
                  <EditableTags {...tagsProps}/>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Loader>
  );
};