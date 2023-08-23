import React from 'react';
import { useIntl } from '@umijs/max';
import { Col, Form, Row } from 'antd';
import classnames from 'classnames';

import { effectHook } from '@/utils/hooks';
import { componentAbilities } from '@/utils/auth/component.setting';
import { t } from '@/utils/i18n';

import { preventNavigation } from '@/services/profile.menu.service';

import EmptyData from '@/components/EmptyData';

import styles from './profile.apartments.module.less';

const MODEL_NAME = 'profileApartmentModel';

export const ProfileApartments = props => {
  const intl = useIntl();

  const {
    testId,
    loading,
    profileModel,
    profileApartmentModel,
    authModel,
    onQuery,
    onActionButtons,
    onSave,
    onGetApartments
  } = props;

  const { user } = authModel;
  const { sUser } = profileModel;
  const { sApartments } = profileApartmentModel;

  const component = 'profile.apartments';

  effectHook(() => {
    user && onQuery();
  }, [user]);

  effectHook(() => {
    if (sUser) {
      onActionButtons(profileApartmentModel);
      onGetApartments();
    }
  }, [sUser]);

  preventNavigation(sUser, intl, t(intl, 'profile.public.apartments.setting'));

  const {
    disabled,
    canUpdate,
    canDelete
  } = componentAbilities(authModel, component, false);

  return (
      <div data-testid={testId}
           className={classnames(styles.profileApartments, {
             [styles.empty]: !sUser?.profileByRef
           })}>
        <Row gutter={0}>
          <Col span={24}>
            {sApartments?.length ? sApartments?.map((apartment, idx) => {
              return (
                  <div key={idx}>{apartment}</div>
              );
            }) : (
                <EmptyData/>
            )}
          </Col>
        </Row>
      </div>
  );
};