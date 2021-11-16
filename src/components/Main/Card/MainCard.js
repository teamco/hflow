import React from 'react';
import { Card } from 'antd';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';

import styles from './mainCard.module.less';

const { Meta } = Card;

const MainCard = props => {
  const {
    avatar,
    actions,
    className,
    cover,
    style,
    title,
    description,
    hoverable = true
  } = props;

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

export default withTranslation()(MainCard);
