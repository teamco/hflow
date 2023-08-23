import React from 'react';
import { Spin } from 'antd';
import classnames from 'classnames';
import { useIntl } from '@umijs/max';

import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';

import LandingPage from '@/layouts/landing/page';

import styles from './logout.module.less';
import loginStyles from '@/pages/landing/authentication/login/login.module.less';

/**
 * @constant
 * @param props
 * @returns {JSX.Element}
 */
const LandingLogout = props => {
  const { onSignOut } = props;
  const intl = useIntl();

  effectHook(() => {
    onSignOut();
  });

  const component = 'landing.logout';

  return (
      <LandingPage spinEffects={['authModel/signOut']}>
        <div className={classnames(loginStyles.loginWrapper, styles.wrapper)}>
          <Spin/>
          <span>
            {t(intl, 'auth.signOut')}
          </span>
        </div>
      </LandingPage>
  );
};

export default LandingLogout;
