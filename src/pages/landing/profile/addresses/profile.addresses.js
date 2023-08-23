import React, { useState } from 'react';
import { useIntl } from '@umijs/max';
import { Col, Form, Row } from 'antd';
import classnames from 'classnames';

import { effectHook } from '@/utils/hooks';
import { componentAbilities } from '@/utils/auth/component.setting';
import { t } from '@/utils/i18n';

import AddressesForm from '@/components/Address';

import { preventNavigation } from '@/services/profile.menu.service';

import {
  ProfileAddressesList
} from './sections/profile.addresses.list';

import styles from './profile.addresses.module.less';

const MODEL_NAME = 'profileModel';

export const ProfileAddresses = props => {
  const intl = useIntl();
  const [formRef] = Form.useForm();

  const {
    testId,
    loading,
    profileModel,
    profileAddressModel,
    authModel,
    onQuery,
    onActionButtons,
    onSave,
    onGetAddresses,
    onGetAllCountries,
    onGetCountryStates,
    onGetStateCities,
    onFieldsChange,
    onEdit,
    onDelete
  } = props;

  const [selected, setSelected] = useState(null);
  const [helper, setHelper] = useState(false);

  const { user } = authModel;
  const { sUser } = profileModel;
  const { sAddresses } = profileAddressModel;

  const component = 'profile.address';

  effectHook(() => {
    user && onQuery();
  }, [user]);

  effectHook(() => {
    onActionButtons(formRef, profileAddressModel);
  }, [profileAddressModel?.touched]);

  effectHook(() => {
    if (sUser) {
      onGetAddresses();
    }
  }, [sUser]);

  preventNavigation(sUser, intl, t(intl, 'profile.public.address.setting'));

  const {
    disabled,
    canUpdate,
    canDelete
  } = componentAbilities(authModel, component, !!selected);

  const listProps = {
    loading,
    sAddresses,
    formRef,
    canDelete,
    selected,
    setSelected,
    onEdit,
    onDelete
  };

  const addressFormProps = {
    formRef,
    canUpdate,
    disabled,
    selected,
    helper,
    className: styles.profileAddressFormSection,
    spinOn: [
      `profileModel/handleProfile`,
      `${MODEL_NAME}/updateAddress`
    ],
    setHelper,
    setSelected,
    onSave,
    onFieldsChange,
    onGetAllCountries,
    onGetCountryStates,
    onGetStateCities
  };

  return (
      <div data-testid={testId}
           className={classnames(styles.profileAddressesForm, {
             [styles.empty]: !sUser?.profileByRef
           })}>
        <Row gutter={0}>
          <Col span={9} offset={1} className={styles.addressSection}>
            <ProfileAddressesList {...listProps}/>
          </Col>
          <Col span={11} offset={1} className={styles.formSection}>
            <AddressesForm {...addressFormProps} />
          </Col>
        </Row>
      </div>
  );
};