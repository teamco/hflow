import React from 'react';
import { history, useIntl } from '@umijs/max';
import { Row } from 'antd';

import ApartmentCard from '@/components/ApartmentCard';
import EmptyData from '@/components/EmptyData';
import Loader from '@/components/Loader';

import { effectHook } from '@/utils/hooks';
import { stub } from '@/utils/function';

import styles from '@/pages/landing/profile/history/history.module.less';

const MODEL_NAME = 'profileModel';

const HistoryLiked = props => {
  const {
    loading,
    span = { xs: 24, sm: 24, md: 12, lg: 8, xl: 6, xxl: 6 },
    gutter = [24, 24],
    profileModel,
    authModel,
    onActionButtons = stub,
    onQuery = stub,
    onLike = stub
  } = props;

  const intl = useIntl();

  const { liked } = profileModel;
  const { user } = authModel;

  const component = 'profile.liked';

  effectHook(() => {
    user && onQuery();
  }, [user]);

  effectHook(() => {
    onActionButtons();
  }, []);

  const handleShowApartments = apartment => {
    history.push(`/apartments/${apartment.id}`);
  };

  const handleLikeApartments = apartment => {
    onLike(apartment?.id);
  };

  const spinOn = [
    `${MODEL_NAME}/liked`
  ];

  return (
      <div className={styles.historyWrapper}>
        <Loader loading={loading} spinOn={spinOn}>
          <Row gutter={gutter}>
            {liked?.content?.length ? liked?.content?.map((apartment, idx) => (
                <ApartmentCard key={idx} {...apartment}
                               span={span}
                               className={styles.apartmentCard}
                               onClick={handleShowApartments}
                               onLike={handleLikeApartments}
                               loading={loading}/>
            )) : (
                <EmptyData/>
            )}
          </Row>
        </Loader>
      </div>
  );
};

export default HistoryLiked;
