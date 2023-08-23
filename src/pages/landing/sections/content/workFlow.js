import React from 'react';
import { useIntl } from '@umijs/max';
import classnames from 'classnames';
import { Col, Row } from 'antd';

import Border from '@/components/Border';
import { bottomProps, topProps } from '@/components/Border/border.config';

import { t } from '@/utils/i18n';

import apartments from 'assets/apartments.png';

import styles from '@/pages/landing/landing.module.less';

const WorkFlow = props => {
  const intl = useIntl();

  const { className } = props;

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
        <Border {...topProps()}/>
        <div className={classnames(className, styles.workFlow)}>
          <h1>{t(intl, 'landing.workFlow')}</h1>
          <Row gutter={[20, 20]}>
            <Col {...colPropsLeft}>
              <h3 className={styles.textRight}>
                Find a suitable property
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </h3>
            </Col>
            <Col {...colPropsRight}>
              <img alt={'apartments'}
                   src={apartments}/>
            </Col>
          </Row>
          <Row gutter={[20, 20]}>
            <Col {...colPropsRight}>
              <img alt={'apartments'}
                   style={{ marginTop: -30 }}
                   src={apartments}/>
            </Col>
            <Col {...colPropsLeft}>
              <h3 className={styles.textLeft}>
                Find a suitable property
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </h3>
            </Col>
          </Row>
          <Row gutter={[20, 20]}>
            <Col {...colPropsLeft}>
              <h3 className={styles.textRight}>
                Find a suitable property
                <p>
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </p>
              </h3>
            </Col>
            <Col {...colPropsRight}>
              <img alt={'apartments'}
                   src={apartments}/>
            </Col>
          </Row>
        </div>
        <Border {...bottomProps()}/>
      </div>
  );
};

export default WorkFlow;
