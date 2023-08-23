import React, { createRef, useMemo, useState } from 'react';
import { useIntl } from '@umijs/max';
import { Col, Row } from 'antd';
import classnames from 'classnames';

import { effectHook } from '@/utils/hooks';
import { componentAbilities } from '@/utils/auth/component.setting';
import { t } from '@/utils/i18n';

import {
  ProfileEmailsList
} from './sections/profile.emails.list';
import {
  ProfileEmailsForm
} from './sections/profile.emails.form';

import { preventNavigation } from '@/services/profile.menu.service';

import styles from './profile.emails.module.less';

const MODEL_NAME = 'profileEmailModel';

export const ProfileEmails = props => {
  const intl = useIntl();

  const [formRef, setFormRef] = useState(null);
  const [primaries, setPrimaries] = useState([]);

  const {
    loading,
    profileModel,
    profileEmailModel,
    authModel,
    onQuery,
    onSave,
    onGetEmails,
    onSetPrimary,
    onDelete,
    onFieldsChange
  } = props;

  const { user } = authModel;

  const component = 'profile.emails';

  const { sUser } = profileModel;

  const {
    sEmails,
    isEdit,
    touched,
    entityForm,
    multiplePrimaryEmails
  } = profileEmailModel;

  const [selected, setSelected] = useState(null);
  const [disableSave, setDisableSave] = useState(true);
  const [_isEdit, setEdit] = useState(isEdit);

  effectHook(() => {
    setEdit(isEdit);
  }, [isEdit]);

  effectHook(() => {
    if (user) {
      onQuery(profileEmailModel);
    }
  }, [user]);

  effectHook(() => {
    if (sUser) {
      onGetEmails();
    }
  }, [sUser]);

  effectHook(() => {
    if (sEmails) {
      setPrimaries(primaryEmails());
    }
  }, [sEmails]);

  preventNavigation(sUser, intl, t(intl, 'profile.public.email.setting'));

  const {
    ableFor,
    disabled,
    canUpdate,
    canDelete
  } = componentAbilities(authModel, component, _isEdit);

  const privateH = t(intl, 'profile.email.private.helper');
  const publicH = t(intl, 'profile.email.public.helper');

  const isReadOnly = (email) => {
    let readOnly = false;
    let isPrimary;

    if (email) {
      isPrimary = email.primary;
    } else {
      const value = formRef?.getFieldValue('mail');
      isPrimary = primaries.find(email => email.mail === value);
    }

    if (isPrimary) {
      if (primaries.length > 1) {
        // TODO (teamco): Do something.
      } else {
        readOnly = true;
      }
    }

    return readOnly;
  };

  const primaryEmails = () => sEmails.filter(e => e.primary);
  const includesEmail = (mail) => sEmails.find(e => e.mail === mail);
  const findEmailIdx = (mail) => sEmails.findIndex(e => e.mail === mail);

  const childRefs = useMemo(
      () => sEmails.map(() => createRef()),
      [sEmails.join(',')]
  );

  const handleSaveBtn = () => {
    const value = formRef.getFieldValue('mail');
    const idx = findEmailIdx(value);
    setSelected(childRefs[idx]);
    setEdit(idx > -1);

    if (idx > -1) {
      const mail = includesEmail(value);
      formRef.setFieldValue('private', mail.private);
    }

    formRef.validateFields().then(() => {
      setDisableSave(false);
    }).catch(e => {
      console.warn(e);
      setDisableSave(true);
    });
  };

  const sharedProps = {
    loading,
    isEdit: _isEdit,
    sEmails,
    isReadOnly,
    findEmailIdx,
    handleSaveBtn,
    childRefs,
    privateH,
    publicH,
    setEdit
  };

  const listProps = {
    ...sharedProps,
    formRef,
    selected,
    setSelected,
    onDelete,
    canDelete
  };

  const emailFormProps = {
    ...sharedProps,
    user,
    disabled,
    canUpdate,
    touched,
    ableFor,
    component,
    entityForm,
    disableSave,
    includesEmail,
    multiplePrimaryEmails,
    primaries,
    setPrimaries,
    setFormRef,
    setDisableSave,
    setSelected,
    onSave,
    onSetPrimary,
    onFieldsChange
  };

  return (
      <div className={classnames(styles.profileEmailsForm)}>
        <Row gutter={0}>
          <Col span={11} offset={1} className={styles.emailsWrapper}>
            <ProfileEmailsList {...listProps} />
          </Col>
          <Col span={10} offset={1} className={styles.formSection}>
            <ProfileEmailsForm {...emailFormProps}/>
          </Col>
        </Row>
      </div>
  );
};