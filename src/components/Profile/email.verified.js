import React from 'react';
import { CheckCircleTwoTone, WarningTwoTone } from '@ant-design/icons';
import { withTranslation } from 'react-i18next';
import { Can } from 'utils/auth/can';

import styles from 'pages/users/users.module.less';

/**
 * @export
 * @default
 * @param props
 * @return {JSX.Element}
 */
function emailVerified(props) {
  const { t, data, verification = { component: null } } = props;

  return (
    <div>
      {data.emailVerified ? (
        <>
          <CheckCircleTwoTone twoToneColor='#52c41a' />
          <strong>{t('auth:emailVerified')}</strong>
        </>
      ) : (
        <>
          <WarningTwoTone twoToneColor='#FFCC00' />
          <strong>{t('auth:emailNotVerified')}</strong>
          {verification.onSendVerification && (
            <Can I={'sendVerificationEmail'} a={verification.component}>
              {verification.verificationSent && (
                <div>{t('auth:pendingVerification')}</div>
              )}
              <div className={styles.verification}
                   onClick={() => verification.onSendVerification(data)}>
                {verification.verificationSent ? t('auth:reSendVerification') : t('auth:sendVerification')}
              </div>
            </Can>
          )}
        </>
      )}
    </div>
  );
}

export default withTranslation()(emailVerified);