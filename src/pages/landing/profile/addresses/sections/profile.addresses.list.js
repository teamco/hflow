import React from 'react';
import { useIntl } from '@umijs/max';
import { Tag } from 'antd';
import classnames from 'classnames';

import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';

import EmptyData from '@/components/EmptyData';
import { FormListActions } from '@/components/Form/FormListActions';
import { BillingTag, PrimaryTag } from '@/components/Form/formProps';
import Loader from '@/components/Loader';

import styles from '../profile.addresses.module.less';

const MODEL_NAME = 'profileAddressModel';

export const ProfileAddressesList = props => {
  const intl = useIntl();

  const {
    loading,
    formRef,
    canDelete,
    sAddresses = [],
    selected,
    setSelected = stub,
    onEdit = stub,
    onDelete = stub
  } = props;

  const handleEdit = (address) => {
    setSelected(address);
    onEdit(address);

  };

  const handleDelete = (address) => {
    canDelete && onDelete(address);
    handleUnselect(address);
  };

  const handleUnselect = (address) => {
    formRef.resetFields();
    setSelected(null);
    onEdit(address, true);
  };

  const actionProps = {
    className: styles.actions,
    disabledClassName: styles.disabled,
    entityType: t(intl, 'profile.address'),
    handleEdit,
    handleDelete,
    handleUnselect
  };

  const spinOn = [
    `${MODEL_NAME}/getAddresses`,
    `${MODEL_NAME}/deleteAddress`,
    `${MODEL_NAME}/updateAddress`
  ];

  return (
      <Loader loading={loading} spinOn={spinOn}>
        <ul className={styles.addressSectionWrapper}>
          {sAddresses.length ? sAddresses?.map((address, idx) => (
              <li key={idx} className={classnames({
                [styles.selected]: address.id === selected?.id
              })}>
                <div className={styles.metadata}>
                  <div>
                    <PrimaryTag entity={address}/>
                    <BillingTag entity={address}/>
                    <Tag className={styles.tagType}>{t(intl,
                        `address.type.${address.addressType}`)}</Tag>
                  </div>
                  <div className={styles.address}>
                    {address.name ? (<h3>{address.name}</h3>) : null}
                    {address.companyName ?
                        (<h3>{address.companyName}</h3>) :
                        null}
                    <span>{address.addressLine1}</span>
                    <span>{address.city}, {address.zipCode}</span>
                    <span>{address.state}</span>
                    <span>{address.country}</span>
                  </div>
                </div>
                <FormListActions {...actionProps}
                                 isSelected={address.id === selected?.id}
                                 entity={address}/>
              </li>
          )) : (
              <EmptyData/>
          )}
        </ul>
      </Loader>
  );
};