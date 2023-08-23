import React, { useState } from 'react';
import { useIntl } from '@umijs/max';
import { Col, Form, Row } from 'antd';
import classnames from 'classnames';

import { effectHook } from '@/utils/hooks';
import { componentAbilities } from '@/utils/auth/component.setting';
import { t } from '@/utils/i18n';

import { preventNavigation } from '@/services/profile.menu.service';

import {
  ProfileLogosForm
} from '@/pages/landing/profile/logos/sections/profile.logos.form';
import {
  ProfileLogosList
} from '@/pages/landing/profile/logos/sections/profile.logos.list';

import styles from '@/pages/landing/profile/logos/profile.logos.module.less';

const MODEL_NAME = 'profileLogoModel';

export const ProfileLogos = props => {
  const intl = useIntl();
  const [formRef] = Form.useForm();

  const {
    loading,
    profileModel,
    profileLogoModel,
    authModel,
    onQuery,
    onSave,
    onActionButtons,
    onGetLogos,
    onFieldsChange,
    onFileRemove,
    onFileChange,
    onEdit,
    onDelete
  } = props;

  const [selected, setSelected] = useState(null);

  const { user } = authModel;
  const { sUser } = profileModel;
  const { sLogos } = profileLogoModel;

  const component = 'profile.logos';

  effectHook(() => {
    user && onQuery();
  }, [user]);

  effectHook(() => {
    onActionButtons(formRef, profileLogoModel);
  }, [profileLogoModel?.touched]);

  effectHook(() => {
    if (sUser) {
      onGetLogos();
    }
  }, [sUser]);

  preventNavigation(sUser, intl, t(intl, 'profile.public.logos.setting'));

  const {
    disabled,
    canUpdate,
    canDelete
  } = componentAbilities(authModel, component, !!selected);

  const listProps = {
    loading,
    sLogos,
    formRef,
    canDelete,
    selected,
    setSelected,
    onEdit,
    onDelete
  };

  const logosFormProps = {
    loading,
    formRef,
    profileLogoModel,
    canUpdate,
    disabled,
    selected,
    setSelected,
    onSave,
    onFieldsChange,
    onFileRemove,
    onFileChange
  };

  return (
      <div className={classnames(styles.profileLogosForm, {
        [styles.empty]: !sUser?.profileByRef
      })}>
        <Row gutter={0}>
          <Col span={11} offset={1} className={styles.logoSection}>
            <ProfileLogosList {...listProps}/>
          </Col>
          <Col span={10} offset={1} className={styles.formSection}>
            <ProfileLogosForm {...logosFormProps} />
          </Col>
        </Row>
      </div>
  );
};