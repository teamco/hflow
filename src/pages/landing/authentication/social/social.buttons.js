import React from 'react';
import { Col, Divider, Form, Row } from 'antd';
import { useIntl } from '@umijs/max';

import { t } from '@/utils/i18n';

import styles
  from '@/pages/landing/authentication/social/social.buttons.module.less';

export const SocialButtons = props => {
  const intl = useIntl();

  const {
    disabled,
    spinning,
    buttons = []
  } = props;

  return buttons.length ? (
      <>
        <Divider plain>
          {t(intl, 'auth.signInWithProvider')}
        </Divider>
        <Form.Item style={{ marginBottom: 0 }}>
          <Row gutter={[8, 16]}
               className={styles.loginBtns}>
            {buttons?.map((ButtonComponent, idx) => (
                <Col span={Math.floor(24 / buttons.length)} key={idx}>
                  {React.cloneElement(ButtonComponent, {
                    disabled: disabled || ButtonComponent?.props?.disabled,
                    loading: spinning
                  })}
                </Col>
            ))}
          </Row>
        </Form.Item>
      </>
  ) : null;
};