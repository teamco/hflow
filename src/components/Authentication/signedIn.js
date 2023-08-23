import React from 'react';
import classnames from 'classnames';
import { useIntl } from '@umijs/max';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

import styles from '@/components/Authentication/authentication.module.less';
import { t } from '@/utils/i18n';

/**
 * @constant
 * @param props
 * @return {JSX.Element}
 */
export const SignedIn = props => {
  const intl = useIntl();

  const {
    className,
    authModel,
    onSignOut
  } = props;

  return (
      <div className={classnames(styles.authWrapper, className)}>
        {authModel.user && (
            <Button type={'primary'}
                    onClick={onSignOut}
                    icon={<LogoutOutlined/>}
                    size={'small'}>
              {t(intl, 'auth.signOut')}
            </Button>
        )}
      </div>
  );
};
