import React from 'react';
import { useIntl, history } from '@umijs/max';
import { Button, Card, Col, Row } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { Line } from '@ant-design/plots';

import { effectHook } from '@/utils/hooks';

import EmptyData from '@/components/EmptyData';
import Loader from '@/components/Loader';

import styles from './history.module.less';

const MODEL_NAME = 'profileModel';
const { Meta } = Card;

export const History = props => {
  const intl = useIntl();

  const {
    loading,
    profileModel,
    authModel,
    onQuery
  } = props;

  const { user } = authModel;

  effectHook(() => {
    user && onQuery();
  }, [user]);

  const { viewed } = profileModel;

  const component = 'profile.history';

  let config = {};

  if (viewed?.content?.length) {
    const views = viewed?.content.map(v => {
      return {
        Date: (new Date(v.views.lastViewDate)).toLocaleDateString(),
        Views: v.views.allViewsCounter
      };
    }).sort((a, b) => a['Date'] < b['Date'] ? -1 : (a['Date'] > b['Date'] ? 1 : 0));

    config = {
      data: views,
      padding: 'auto',
      xField: 'Date',
      yField: 'Views',
      xAxis: {
        // tickCount: 5
      }
    };
  }

  const colProps = { xs: 24, sm: 24, md: 12, lg: 12, xl: 8, xxl: 8 };

  return (
      <div className={styles.historyWrapper}>
        <Loader loading={loading} spinOn={[`${MODEL_NAME}/query`]}>
          History
          <Row>
            <Col {...colProps}>
              <Loader loading={loading} spinOn={[`${MODEL_NAME}/viewed`]}>
                {viewed?.content?.length ? (
                    <Card cover={<Line {...config} />}
                          className={styles.chart}
                          actions={[
                            <Button type={'primary'}
                                    key={'viewed'}
                                    shape={'round'}
                                    onClick={() => history.push('/profile/history/viewed')}
                                    icon={<EyeOutlined/>}/>
                          ]}>
                      <Meta title={'History of Views'}
                            description={'Latest 10 views'}/>
                    </Card>
                ) : (
                    <EmptyData/>
                )}
              </Loader>
            </Col>
          </Row>
        </Loader>
      </div>
  );
};