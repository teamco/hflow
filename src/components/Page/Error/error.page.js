import React from 'react';
import { Result } from 'antd';
import classnames from 'classnames';
import { useIntl } from '@umijs/max';

import LandingPage from '@/layouts/landing/page';
import BackButton from '@/components/Buttons/back.button';

import { effectHook } from '@/utils/hooks';
import { logger } from '@/utils/console';
import { t } from '@/utils/i18n';

import styles from './error.module.less';

/**
 * @export
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const ErrorPage = props => {
  const intl = useIntl();

  const {
    component,
    authModel,
    errorModel,
    isLanding = false,
    title = t(intl, 'error.page404'),
    status,
    className,
    spinOn = [],
    onQuery
  } = props;

  const { user } = authModel;
  const { errors = [] } = errorModel;

  const MODEL_NAME = 'errorModel';

  const _error = (
      <div className={styles.errorFlexCenter}>
        <Result status={user ? status : 404}
                title={user ? title : t(intl, 'error.page404')}
                className={classnames(styles[component], className)}/>
        <BackButton/>
      </div>
  );

  effectHook(() => {
    errors.length && logger({ type: 'warn', log: errors });
  }, [errors]);

  effectHook(() => {
    onQuery({ status, title });
  });

  if (isLanding) {
    return (
        <LandingPage spinEffects={[`${MODEL_NAME}/query`, ...spinOn]}>
          {_error}
        </LandingPage>
    );
  }

  return _error;
};
