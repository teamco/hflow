import React from 'react';
import { Card, Empty } from 'antd';
import classnames from 'classnames';

import styles from './mainCard.module.less';

const { Meta } = Card;

const MainCard = props => {
  const {
    avatar,
    actions,
    className,
    style,
    title,
    description,
    hoverable = true,
    noData = false
  } = props;

  let { cover } = props;

  if (noData) {
    cover = (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>);
  }

  return (
      <Card style={style}
            hoverable={hoverable}
            className={classnames(styles.card, className)}
            cover={cover}
            actions={actions}>
        <Meta avatar={avatar}
              title={title}
              description={description}/>
      </Card>
  );
};

export default MainCard;
