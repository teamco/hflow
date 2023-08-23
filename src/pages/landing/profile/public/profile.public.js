import React from 'react';
import { Form, Row, Spin } from 'antd';
import dayjs from 'dayjs';

import { effectHook } from '@/utils/hooks';
import { componentAbilities } from '@/utils/auth/component.setting';

import { formProps } from '@/components/Form/formProps';

import {
  ProfilePublicInfo
} from '@/pages/landing/profile/public/sections/profile.public.info';
import {
  ProfilePublicLogo
} from '@/pages/landing/profile/public/sections/profile.public.logo';

import styles from '@/pages/landing/profile/public/profile.public.module.less';

const MODEL_NAME = 'profileModel';

export const ProfilePublic = props => {
  const [formRef] = Form.useForm();

  const {
    loading,
    profileModel,
    authModel,
    onQuery,
    onSave,
    onFieldsChange,
    onUpdateTags,
    onGetPublicLinks
  } = props;

  const { user } = authModel;

  const component = 'profile.public';

  const {
    sProfile,
    sLinks,
    tags,
    isEdit,
    touched,
    entityForm
  } = profileModel;

  effectHook(() => {
    if (user) {
      onQuery(formRef);
    }
  }, [user]);

  effectHook(() => {
    if (sProfile) {
      onGetPublicLinks();
    }
  }, [sProfile]);

  const {
    ability,
    ableFor,
    disabled,
    canUpdate
  } = componentAbilities(authModel, component, isEdit);

  const onChangeFormProps = {
    touched,
    entityForm,
    loading,
    spinOn: [`${MODEL_NAME}/query`],
    onFinish(formValues) {
      canUpdate && onSave(formValues);
    },
    onFieldsChange
  };

  const logoProps = {
    sProfile,
    loading,
    sLinks
  };

  const initialValues = {
    name: {
      first: null,
      second: null,
      middle: null,
      honorific: null
    },
    birthdate: dayjs(),
    genderIdentity: null
  };

  const infoProps = {
    user,
    formRef,
    loading,
    tags,
    isEdit,
    disabled,
    sProfile,
    canUpdate,
    onUpdateTags
  };

  return (
      <div className={styles.profileForm}>
        <Form {...formProps(onChangeFormProps)}
              form={formRef}
              initialValues={{ ...initialValues }}>
          <Row gutter={0}>
            <ProfilePublicInfo {...infoProps}/>
            <ProfilePublicLogo {...logoProps}/>
          </Row>
        </Form>
      </div>
  );
};