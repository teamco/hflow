import React, { useState } from 'react';
import { useIntl } from '@umijs/max';
import { Col, Form, Row } from 'antd';
import classnames from 'classnames';

import { effectHook } from '@/utils/hooks';
import { componentAbilities } from '@/utils/auth/component.setting';
import { t } from '@/utils/i18n';

import { preventNavigation } from '@/services/profile.menu.service';

import {
  ProfileLinksList
} from './sections/profile.links.list';
import {
  ProfileLinksForm
} from './sections/profile.links.form';

import styles from './profile.links.module.less';

const MODEL_NAME = 'profileLinkModel';

export const ProfileLinks = props => {
  const intl = useIntl();
  const [formRef] = Form.useForm();

  const {
    testId,
    loading,
    profileModel,
    profileLinkModel,
    authModel,
    onQuery,
    onSave,
    onActionButtons,
    onGetLinks,
    onFieldsChange,
    onUpdateTags,
    onEdit,
    onDelete
  } = props;

  const [selected, setSelected] = useState(null);

  const { user } = authModel;
  const { sUser } = profileModel;
  const { sLinks, touched } = profileLinkModel;

  const component = 'profile.links';

  effectHook(() => {
    user && onQuery(formRef);
  }, [user]);

  effectHook(() => {
    onActionButtons(formRef, profileLinkModel);
  }, [touched]);

  effectHook(() => {
    if (sUser) {
      onGetLinks();
    }
  }, [sUser]);

  preventNavigation(sUser, intl, t(intl, 'profile.public.links.setting'));

  const {
    disabled,
    canUpdate,
    canDelete
  } = componentAbilities(authModel, component, !!selected);

  const listProps = {
    loading,
    sLinks,
    formRef,
    canDelete,
    selected,
    setSelected,
    onUpdateTags,
    onEdit,
    onDelete
  };

  const linksFormProps = {
    loading,
    formRef,
    profileLinkModel,
    canUpdate,
    disabled,
    selected,
    setSelected,
    onSave,
    onUpdateTags,
    onFieldsChange
  };

  return (
      <div data-testid={testId}
           className={classnames(styles.profileLinksForm, {
             [styles.empty]: !sUser?.profileByRef
           })}>
        <Row gutter={0}>
          <Col span={11} offset={1} className={styles.linkSection}>
            <ProfileLinksList {...listProps}/>
          </Col>
          <Col span={10} offset={1} className={styles.formSection}>
            <ProfileLinksForm {...linksFormProps} />
          </Col>
        </Row>
      </div>
  );
};