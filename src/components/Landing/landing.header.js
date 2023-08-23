import React, { useState } from 'react';
import { history, useIntl } from '@umijs/max';
import { Col, notification, Row } from 'antd';
import classnames from 'classnames';

import { CommentOutlined } from '@ant-design/icons';

import { effectHook, useScrollPosition } from '@/utils/hooks';
import { t } from '@/utils/i18n';

import Language from '@/components/Language';
import { LandingActions } from '@/components/Landing/landing.actions';

import styles from '@/components/Landing/landing.module.less';
import { handleRefresh } from '@/services/userRoles.service';

/**
 * @export
 * @default
 * @param props
 * @return {JSX.Element}
 */
const LandingHeader = props => {
  const intl = useIntl();

  const {
    icon,
    title,
    topUnder,
    position = 'absolute',
    landingModel,
    notificationModel,
    authModel,
    userModel,
    onChangeLang,
    loading
  } = props;

  const [transform, setTransform] = useState(false);
  const { refreshPageIn, siderPanelConfig: { collapsed } } = landingModel;
  const { selectedUser } = userModel;

  const [api, contextHolder] = notification.useNotification();

  useScrollPosition(position, topUnder, setTransform);

  effectHook(() => {
    if (selectedUser?.metadata?.refreshRoles) {
      handleRefresh({
        api,
        intl,
        className: styles.notification,
        refreshPageIn
      });
    }
  }, [selectedUser]);

  /**
   * @constant
   * @param {Event} e
   */
  const handleHomeNavigation = e => {
    e.preventDefault();
    history.push('/');
  };

  const actionProps = {
    loading,
    authModel,
    collapsed,
    notificationModel
  };

  return (
      <header className={classnames(styles.header,
          transform ? styles.transform : '')}
              style={{ position }}>
        <Row>
          <Col span={6}>
            <img src={icon}
                 onClick={handleHomeNavigation}
                 className={styles.icon}
                 alt={title ? t(intl, `${title}`) : null}/>
          </Col>
          <Col span={18}>
            <Row justify={'end'}
                 gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
              <Col className={classnames(styles.headerText, styles.col)}>
                <CommentOutlined/>
                <span>{t(intl, 'landing.help')}</span>
              </Col>
              <Col className={styles.col}>
                <Language model={landingModel}
                          onChangeLang={onChangeLang}/>
              </Col>
              <Col className={classnames(styles.headerText, styles.col)}>
                <LandingActions {...actionProps}/>
              </Col>
            </Row>
          </Col>
        </Row>
        {contextHolder}
      </header>
  );
};

export default LandingHeader;
