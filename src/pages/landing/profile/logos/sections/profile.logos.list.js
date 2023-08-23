import React from 'react';
import { useIntl } from '@umijs/max';
import { Image } from 'antd';
import classnames from 'classnames';

import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';

import EmptyData from '@/components/EmptyData';
import Loader from '@/components/Loader';
import { PrimaryTag, PrivateTag } from '@/components/Form/formProps';
import { FormListActions } from '@/components/Form/FormListActions';

import styles from '@/pages/landing/profile/logos/profile.logos.module.less';

const MODEL_NAME = 'profileLogoModel';

export const ProfileLogosList = props => {
  const intl = useIntl();

  const {
    loading,
    formRef,
    canDelete,
    sLogos = [],
    selected,
    setSelected = stub,
    onEdit = stub,
    onDelete = stub
  } = props;

  const handleEdit = (logo) => {
    setSelected(logo);
    onEdit(logo);

    formRef.setFields([
      { name: ['logo', 'primary'], value: logo.primary },
      { name: ['logo', 'title'], value: logo.title },
      { name: ['logo', 'altText'], value: logo.altText },
      { name: ['logo', 'description'], value: logo.description }
    ]);
  };

  const handleDelete = (logo) => {
    canDelete && onDelete(logo);
    handleUnselect(logo);
  };

  const handleUnselect = (logo) => {
    formRef.resetFields();
    setSelected(null);
    onEdit(logo, true);
  };

  const actionProps = {
    className: styles.actions,
    disabledClassName: styles.disabled,
    entityType: t(intl, 'profile.logo'),
    selected,
    handleEdit,
    handleDelete,
    handleUnselect
  };

  const spinOn = [
    `${MODEL_NAME}/getLogos`,
    `${MODEL_NAME}/deleteLogo`,
    `${MODEL_NAME}/updateLogos`
  ];

  return (
      <Loader loading={loading} spinOn={spinOn}>
        <ul className={styles.logoSectionWrapper}>
          {sLogos.length ? sLogos?.map((logo, idx) => {
            const isSelected = logo.id === selected?.id;

            return (
                <li key={idx}
                    className={classnames({ [styles.selected]: isSelected })}>
                  <div>
                    <Image src={logo.encodedBase64}
                           rootClassName={styles.preview}
                           alt={logo.altText}/>
                  </div>
                  <div className={styles.metadata}>
                    <div>
                      <PrivateTag entity={{ private: !logo.primary }}/>
                      <PrimaryTag entity={logo}/>
                    </div>
                    <h3>{logo.title}</h3>
                    <p>{logo.description}</p>
                  </div>
                  <FormListActions {...actionProps}
                                   isSelected={isSelected}
                                   entity={logo}/>
                </li>
            );
          }) : (
              <EmptyData/>
          )}
        </ul>
      </Loader>
  );
};