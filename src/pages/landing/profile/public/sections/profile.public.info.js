import React from 'react';
import { Link, useIntl } from '@umijs/max';
import { Col, DatePicker, Divider, Form, Input, Row, Select } from 'antd';

import { t } from '@/utils/i18n';
import { isSpinning } from '@/utils/state';
import { DEFAULT_DATE_FORMAT } from '@/utils/timestamp';

import { FormInput, requiredField } from '@/components/Form';
import EditableTags from '@/components/Form/EditableTags';

import styles from '@/pages/landing/profile/public/profile.public.module.less';

const { TextArea } = Input;

const MODEL_NAME = 'profileModel';

export const ProfilePublicInfo = props => {
  const intl = useIntl();

  const {
    formRef,
    loading,
    tags,
    isEdit,
    disabled,
    sProfile,
    canUpdate,
    onUpdateTags
  } = props;

  const _firstName = t(intl, 'form.firstName');
  const _lastName = t(intl, 'form.lastName');
  const _middleName = t(intl, 'form.middleName');
  const _honorificName = t(intl, 'form.honorificName');
  const _birthdate = t(intl, 'form.birthdate');
  const _genderIdentity = t(intl, 'form.genderIdentity');
  const _description = t(intl, 'form.description');

  const colProps = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 };

  const tagsProps = {
    tags,
    name: 'tags',
    formRef,
    disabled,
    canUpdate,
    onChange: onUpdateTags,
    canCreate: canUpdate,
    canDelete: canUpdate
  };

  const emailsProps = {
    loading: isSpinning(loading, [`${MODEL_NAME}/getEmails`]),
    disabled
  };

  const emails = sProfile?.primaryEmail ? [sProfile?.primaryEmail] : [];

  return (
      <Col span={14} offset={1}
           className={styles.formWrapper}>
        <Row gutter={[24, 24]}>
          <Col {...colProps}>
            <FormInput name={['name', 'first']}
                       label={_firstName}
                       intl={intl}
                       help={t(intl, 'form.nameHelp', { type: _firstName })}
                       disabled={disabled}/>
          </Col>
          <Col {...colProps}>
            <FormInput name={['name', 'second']}
                       label={_lastName}
                       intl={intl}
                       disabled={disabled}
                       help={t(intl, 'form.nameHelp', { type: _lastName })}/>
          </Col>
          <Col {...colProps}>
            <FormInput name={['name', 'middle']}
                       label={_middleName}
                       intl={intl}
                       required={false}
                       disabled={disabled}/>
          </Col>
          <Col {...colProps}>
            <FormInput name={['name', 'honorific']}
                       label={_honorificName}
                       intl={intl}
                       required={false}
                       disabled={disabled}/>
          </Col>
        </Row>
        <Divider/>
        <Row gutter={[24, 24]}>
          <Col {...colProps}>
            <FormInput name={['name', 'genderIdentity']}
                       label={_genderIdentity}
                       intl={intl}
                       required={false}
                       disabled={disabled}/>
          </Col>
          <Col {...colProps}>
            <Form.Item name={'birthdate'}
                       label={_birthdate}
                       rules={[
                         requiredField(intl, _birthdate, false)
                       ]}>
              <DatePicker format={DEFAULT_DATE_FORMAT}
                          disabled={disabled}
                          showTime={false}/>
            </Form.Item>
          </Col>
        </Row>
        <Divider/>
        {isEdit ? (
            <>
              <Row gutter={[24, 24]}>
                <Col span={12}>
                  <Form.Item label={t(intl, 'profile.public.email')}
                             name={['primaryEmail', 'mail']}
                             help={(
                                 <span className={styles.emailHelper}>
                                   {t(intl, 'profile.public.email.helper')}
                                   <Link to={'/profile/emails'}>
                                      {t(intl, 'profile.public.email.setting')}
                                   </Link>
                                 </span>
                             )}>
                    <Select showSearch
                            {...emailsProps}
                            disabled={true}
                            placeholder={t(intl, 'profile.public.email.placeholder')}
                            optionFilterProp={'children'}
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }>
                      {[...emails].map((email, idx) => (
                          <Select.Option key={idx} value={email?.id}>{email?.mail}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Divider/>
            </>
        ) : null}
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Form.Item label={_description}
                       name={'description'}>
              <TextArea showCount
                        maxLength={100}
                        disabled={disabled}
                        style={{ height: 120, resize: 'none' }}
                        placeholder={_description}/>
            </Form.Item>
          </Col>
        </Row>
        <Divider/>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Form.Item label={t(intl, 'form.tags')}
                       name={'tags'}>
              <EditableTags {...tagsProps}/>
            </Form.Item>
          </Col>
        </Row>
      </Col>
  );
};