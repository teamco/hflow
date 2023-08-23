import React from 'react';
import classnames from 'classnames';
import { Col, Row } from 'antd';

import { stub } from '@/utils/function';

import Trends from './trends';
import WorkFlow from './workFlow';
import Areas from './areas';
import Deals from './deals';
import Search from './search';

import styles from '@/pages/landing/landing.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const RealEstate = props => {
  const {
    className,
    loading,
    data = {
      areas: [],
      deals: [],
      trends: [],
      carousel: {}
    },
    onLike = stub,
    onFetchCarousel = stub
  } = props;

  return (
      <Row>
        <Col span={22} offset={1}>
          <div className={classnames(className, styles.realEstate)}>
            <Search/>
            <Trends data={data.trends}
                    loading={loading}
                    carousel={data.carousel}
                    onLike={onLike}
                    onFetchCarousel={onFetchCarousel}/>
            <WorkFlow/>
            <Areas data={data.areas}/>
            <Deals data={data.deals}/>
          </div>
        </Col>
      </Row>
  );
};

export default RealEstate;
