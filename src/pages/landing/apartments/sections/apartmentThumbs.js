import React, { useState } from 'react';
import { Col, Row, Spin, Image } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';
import classnames from 'classnames';
import pluralize from 'pluralize';

import { t } from '@/utils/i18n';

import styles from '../apartment.module.less';

export const ApartmentThumbs = props => {
  const intl = useIntl();

  const {
    className,
    spinning = false,
    status,
    gallery,
    size,
    viewed,
    apartment
  } = props;

  const [visible, setVisible] = useState(false);

  const { main, thumbs = {} } = gallery;

  const colsCount = Math.floor(24 / thumbs?.count);

  const colPropsBig = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 - colsCount, xxl: 24 - colsCount };
  const colPropsSmall = { xs: 24, sm: 24, md: 24, lg: 24, xl: colsCount, xxl: colsCount };

  // const descriptions = thumbs.images.map(thumb => thumb.description);

  const staticThumbs = [];

  for (let i = 0; i < thumbs.count - 1; i++) {
    staticThumbs.push(thumbs.images[i]);
  }

  return spinning ? (
      <Spin spinning={true}/>
  ) : (
      <>
        <Row className={classnames(styles.gallery, className)}>
          <Col {...colPropsBig} className={styles.mainThumb}>
            <img src={main} alt={status}/>
            <div className={styles.views}>
              <EyeOutlined/>
              {viewed}
              <span>{pluralize(t(intl, 'actions.time'), viewed)}</span>
            </div>
          </Col>
          <Col {...colPropsSmall}>
            {staticThumbs.map((thumb, idx) => (
                <div key={idx} className={styles.thumb}>
                  <img src={thumb.src} alt={status}/>
                </div>
            ))}
            <div className={styles.thumb}>
              <span className={styles.more}
                    onClick={() => setVisible(true)}>
                {`+${size}`}
              </span>
              <img src={thumbs.images[thumbs.count - 1]?.src} alt={status}/>
            </div>
          </Col>
        </Row>
        <div style={{ display: 'none' }}>
          <Image.PreviewGroup preview={{
            visible,
            countRender: (current, total) => {
              return (
                  <div className={styles.thumbHeader}>
                    <span>{`${current} / ${total}`}</span>
                  </div>
              );
            },
            onVisibleChange: (vis) => setVisible(vis)
          }}>
            {thumbs.images.map((thumb, idx) => (
                <Image key={idx} src={thumb.src} alt={'demo'}/>
            ))}
          </Image.PreviewGroup>
        </div>
      </>
  );
};