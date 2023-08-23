import React, { useRef } from 'react';
import { Carousel, Col, Row, Skeleton, Space, Spin } from 'antd';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import classnames from 'classnames';

import { isSpinning } from '@/utils/state';
import { stub } from '@/utils/function';

import styles from './carousel.module.less';

export const MainCarousel = props => {
  const {
    loading,
    spinOn = [],
    offset = 1,
    span = 22,
    children,
    carousel = {},
    content = [],
    onFetch = stub
  } = props;

  /**
   * @constant
   * @type {React.MutableRefObject<undefined>|{current: {prev, next}}}
   */
  const carouselRef = useRef();

  return (
      <Spin spinning={isSpinning(loading, [...spinOn])}>
        <Row>
          <Col span={offset} className={styles.arrow}>
            {carousel?.left && carouselRef?.current ? (
                <div className={classnames(styles.left)}
                     onClick={() => {
                       onFetch(-1);
                       carouselRef.current.prev();
                     }}>
                  <LeftCircleOutlined/>
                </div>
            ) : (
                <div className={classnames(styles.left, styles.null)}/>
            )}
          </Col>
          <Col span={span}>
            {content?.length ? (
                <div className={styles.carousel}>
                  <Carousel ref={carouselRef}>
                    <Row gutter={[24]}>
                      {children}
                    </Row>
                  </Carousel>
                </div>
            ) : (
                <Space className={styles.skeleton}>
                  {[...Array(carousel?.size).keys()].map((_, idx) => (
                      <Skeleton.Image key={idx} loading={true} active/>
                  ))}
                </Space>
            )}
          </Col>
          <Col span={1} className={styles.arrow}>
            {carousel?.right && carouselRef?.current ? (
                <div className={classnames(styles.right)}
                     onClick={() => {
                       onFetch(1);
                       carouselRef.current.next();
                     }}>
                  <RightCircleOutlined/>
                </div>
            ) : (
                <div className={classnames(styles.right, styles.null)}/>
            )}
          </Col>
        </Row>
      </Spin>
  );
};