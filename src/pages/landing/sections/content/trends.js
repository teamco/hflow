import React from 'react';
import { useIntl, history } from '@umijs/max';
import classnames from 'classnames';

import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';

import Main from '@/components/Main';
import ApartmentCard from '@/components/ApartmentCard';

import styles from '@/pages/landing/landing.module.less';

const Trends = props => {
  const intl = useIntl();

  const {
    className,
    loading,
    data = {},
    carousel,
    onLike = stub,
    onFetchCarousel = stub
  } = props;

  const { content = [] } = data;

  const handleShowApartments = apartment => {
    history.push(`/apartments/${apartment.id}`);
  };

  const handleLikeApartments = apartment => {
    onLike(apartment?.id);
  };

  return (
      <div className={classnames(className, styles.trends)}>
        <h1>{t(intl, 'landing.trends')}</h1>
        <Main.Carousel loading={loading}
                       spinOn={['landingModel/getApartments']}
                       carousel={carousel}
                       content={content}
                       onFetch={onFetchCarousel}>
          {content?.map((apartment, idx) => (
              <ApartmentCard {...apartment}
                             loading={loading}
                             span={{ span: Math.floor(24 / carousel.size) }}
                             onClick={handleShowApartments}
                             onLike={handleLikeApartments}
                             key={idx}/>
          ))}
        </Main.Carousel>
      </div>
  );
};

export default Trends;
