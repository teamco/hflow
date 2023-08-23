import React from 'react';
import { useIntl } from '@umijs/max';
import {
  Button,
  Tooltip
} from 'antd';

import { QuestionCircleTwoTone } from '@ant-design/icons';
import classnames from 'classnames';

import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';

import {
  AccountTag,
  PrimaryTag,
  PrivateTag
} from '@/components/Form/formProps';
import { FormListActions } from '@/components/Form/FormListActions';
import Loader from '@/components/Loader';
import EmptyData from '@/components/EmptyData';

import styles from '@/pages/landing/profile/emails/profile.emails.module.less';

const MODEL_NAME = 'profileEmailModel';

export const ProfileEmailsList = props => {
  const intl = useIntl();

  const {
    formRef,
    loading,
    canDelete,
    selected,
    childRefs,
    privateH,
    publicH,
    isEdit,
    sEmails = [],
    isReadOnly = stub,
    onDelete = stub,
    setEdit = stub,
    setSelected = stub,
    findEmailIdx = stub,
    handleSaveBtn = stub
  } = props;

  const handleEdit = (email) => {
    setEdit(true);
    formRef.setFieldValue('mail', email.mail);
    formRef.setFieldValue('private', email.private);
    setSelected(childRefs[findEmailIdx(email.mail)]);
    handleSaveBtn();
  };

  const handleUnselect = () => {
    formRef.setFieldValue('mail', null);
    formRef.setFieldValue('private', true);
    setEdit(false);
    setSelected(null);
  };

  const handleDelete = (mail) => {
    canDelete && onDelete(mail);
    handleUnselect();
  };

  const actionProps = {
    className: styles.actions,
    disabledClassName: styles.disabled,
    entityType: t(intl, 'form.email'),
    handleEdit,
    handleDelete,
    handleUnselect
  };

  const spinOn = [
    `${MODEL_NAME}/getEmails`,
    `${MODEL_NAME}/deleteEmail`,
    `${MODEL_NAME}/updateEmails`
  ];

  return (
      <Loader loading={loading} spinOn={spinOn}>
        <ul className={styles.emails}>
          {sEmails?.length ? sEmails.map((email, idx) => {
            const isSelected = childRefs[idx] === selected;

            return (
                <li key={idx}
                    ref={childRefs[idx]}
                    className={classnames({ [styles.selected]: isSelected })}>
                  <h2>
                    <div>{email.mail}</div>
                    <div>
                      <PrivateTag entity={email}/>
                      <AccountTag entity={email}/>
                      <PrimaryTag entity={email}/>
                    </div>
                  </h2>
                  <p>
                    {(email.private || !email.verified) ?
                        t(intl, 'profile.email.not.visible') :
                        t(intl, 'profile.email.visible')}
                    <Tooltip title={(
                        <div className={styles.tooltipType}>
                          <span>{email.private ? privateH : publicH}</span>
                        </div>
                    )}>
                      <QuestionCircleTwoTone/>
                    </Tooltip>
                  </p>
                  {email.primary && (
                      <p>
                        {t(intl, 'profile.email.primary.notification')}
                        <Tooltip title={(
                            <div className={styles.tooltipType}>
                              <span>{t(intl,
                                  'profile.email.primary.notification.helper')}</span>
                            </div>
                        )}>
                          <QuestionCircleTwoTone/>
                        </Tooltip>
                      </p>
                  )}
                  {!email.verified && (
                      <p>
                        {t(intl, 'profile.email.unverified')}
                        <Tooltip title={(
                            <div className={styles.tooltipType}>
                              <span>{t(intl,
                                  'profile.email.unverified.helper')}</span>
                            </div>
                        )}>
                          <QuestionCircleTwoTone/>
                        </Tooltip>
                        <Button type={'link'} size={'small'}>
                          {t(intl, 'profile.email.resend')}
                        </Button>
                      </p>
                  )}
                  <FormListActions {...actionProps}
                                   disabled={isReadOnly(email)}
                                   isSelected={isSelected}
                                   entity={email}/>
                </li>
            );
          }) : (
              <EmptyData/>
          )}
        </ul>
      </Loader>
  );
};