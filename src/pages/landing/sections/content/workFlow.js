import React from 'react';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';
import { Col, Row } from 'antd';

import Border from '@/components/Border';

import styles from 'pages/landing/landing.module.less';

const WorkFlow = props => {
  const { t, className } = props;

  const topProps = {
    direction: 'top',
    dims: {
      left: { width: '15vw' },
      right: { width: '45vw' },
      bottom: { width: '15vh', color: 'rgb(241, 241, 241)', style: 'solid' }
    }
  };

  const bottomProps = {
    direction: 'bottom',
    dims: {
      left: { width: '45vw' },
      right: { width: '15vw' },
      top: { width: '15vh', color: 'rgb(241, 241, 241)', style: 'solid' }
    }
  };

  const colPropsLeft = {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 14,
    xl: 14
  };

  const colPropsRight = {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 10,
    xl: 10
  };

  return (
      <div className={styles.workFlowWrapper}>
        <Border {...topProps}/>
        <div className={classnames(className, styles.workFlow)}>
          <h1>{t('landing:workFlow')}</h1>
          <Row gutter={[20, 20]}>
            <Col {...colPropsLeft}>
              <h3 className={styles.textRight}>
                Find a suitable property
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                  industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                  scrambled it to make a type specimen book.
                </p>
              </h3>
            </Col>
            <Col {...colPropsRight}>
              <img alt={'apartments'}
                   src={'/assets/apartments.png'}/>
            </Col>
          </Row>
          <Row gutter={[20, 20]}>
            <Col {...colPropsRight}>
              <img alt={'apartments'}
                   style={{ marginTop: -30 }}
                   src={'/assets/apartments.png'}/>
            </Col>
            <Col {...colPropsLeft}>
              <h3 className={styles.textLeft}>
                Find a suitable property
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                  industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                  scrambled it to make a type specimen book.
                </p>
              </h3>
            </Col>
          </Row>
          <Row gutter={[20, 20]}>
            <Col {...colPropsLeft}>
              <h3 className={styles.textRight}>
                Find a suitable property
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                  industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                  scrambled it to make a type specimen book.
                </p>
              </h3>
            </Col>
            <Col {...colPropsRight}>
              <img alt={'apartments'}
                   src={'/assets/apartments.png'}/>
            </Col>
          </Row>
        </div>
        <Border {...bottomProps}/>
      </div>
  );
};

export default withTranslation()(WorkFlow);
