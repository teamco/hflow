import React from 'react';
import {Card} from 'antd';
import classnames from 'classnames';

import styles from 'components/Subscription/subscription.module.less';

const {Meta} = Card;

export const Subscription = props => {
  const {
    actions,
    className,
    cover,
    hoverable = false,
    meta = {}
  } = props;

  const {
    avatar,
    title,
    description
  } = meta;

  return (
      <Card hoverable={hoverable}
            className={classnames(styles.subscription, className)}
            cover={cover}
            actions={actions}>
        <Meta avatar={avatar}
              title={title}
              description={description}/>
      </Card>
  );
};
