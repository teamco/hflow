import React from 'react';
import { useIntl, history } from '@umijs/max';
import { Card, Col, Row, Tooltip } from 'antd';
import { ApiTwoTone, DollarCircleTwoTone } from '@ant-design/icons';

import { t } from '@/utils/i18n';

import Loader from '@/components/Loader';

import styles from '@/pages/landing/profile/profile.module.less';

export const FeatureCards = props => {
  const intl = useIntl();

  const {
    loading,
    features = [],
    spinOn = []
  } = props;

  const featuresSpan = { xs: 12, sm: 12, md: 8, lg: 6, xl: 4, xxl: 3 };

  return (
      <Loader loading={loading} spinOn={[...spinOn]}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {features.filter(m => !m.disabled).map((d, idx) => {
            const { title, description } = d?.feature?.translateKeys;

            return (
                <Col {...featuresSpan} key={idx} className={styles.featureCardWrapper}>
                  <Card title={t(intl, title)}
                        bordered
                        hoverable
                        className={styles.featureCard}
                        onClick={(e) => {
                          e.preventDefault();
                          history.push(d?.url);
                        }}
                        extra={(
                            <div className={styles.featureIcon}>
                              <Tooltip title={t(intl, d?.feature?.trialed ? 'status.trialed' : 'status.assigned')}>
                                {d?.feature?.trialed ?
                                    (<DollarCircleTwoTone twoToneColor={'#eb2f96'}/>) :
                                    (<ApiTwoTone twoToneColor={'#52c41a'}/>)}
                              </Tooltip>
                            </div>
                        )}>

                    {description ? t(intl, description) : ''}
                  </Card>
                </Col>
            );
          })}
        </Row>
      </Loader>
  );
};