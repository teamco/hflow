import React from 'react';
import { useIntl } from '@umijs/max';
import classnames from 'classnames';
import capitalize from 'capitalize-first-letter';

import * as Icons from '@/components/Icons';

import { t } from '@/utils/i18n';

import styles from '../apartment.module.less';
import { Avatar, Button, Card, Skeleton } from 'antd';
import { isSpinning } from '@/utils/state';
import { API } from '@/services/config/api.config';
import { PhoneOutlined, StarTwoTone } from '@ant-design/icons';

const { Meta } = Card;

export const ApartmentAgentBox = props => {
  const intl = useIntl();

  const {
    className,
    spinOn = [],
    loading,
    title,
    width = '100%'
  } = props;

  return (
      <div className={classnames(styles.agents, className)}>
        <Card style={{ width }} title={title}>
          <Skeleton loading={isSpinning(loading, [...spinOn])} avatar active>
            <div className={styles.agent}>
              <Avatar src={API.avatar}/>
              <div>
                <a href={'#'}>Agent Name</a>
                <p>
                  <StarTwoTone twoToneColor={'#52c41a'}/>
                  5.2 (49 reviews)
                </p>
                <a className={styles.phone} href="tel:6031112298">
                  <PhoneOutlined/>
                  6031112298
                </a>
              </div>
            </div>
            <div className={styles.agent}>
              <Avatar src={API.avatar}/>
              <div>
                <a href={'#'}>Agent Name</a>
                <p>
                  <StarTwoTone twoToneColor={'#eb2f96'}/>
                  3.9 (598 reviews)
                </p>
                <a className={styles.phone} href="tel:6031112298">
                  <PhoneOutlined/>
                  6031112298
                </a>
              </div>
            </div>
            <div className={styles.agency}>
              <a>LJ Hooker Point Cook - POINT COOK</a>
              <p>Shop 211-212/4 Main Street, POINT COOK, VIC 3030</p>
            </div>
            <div className={styles.actions}>
              <Button type={'primary'} size={'large'}>Get in Touch</Button>
            </div>
          </Skeleton>
        </Card>
      </div>
  );
};