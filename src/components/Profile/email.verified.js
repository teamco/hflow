import React from 'react';
import { CheckCircleTwoTone, WarningTwoTone } from '@ant-design/icons';
import { useIntl } from '@umijs/max';

import { Can } from '@/utils/auth/can';
import { COLORS } from '@/utils/colors';

import styles from '@/pages/users/users.module.less';
import { t } from '@/utils/i18n';

/**
 * @export
 * @default
 * @param props
 * @return {JSX.Element}
 */
function emailVerified(props) {
  const { data, verification = { component: null }, className } = props;
  const intl = useIntl();

  return (
      <div className={className}>
        {data?.emailVerified ? (
            <>
              <CheckCircleTwoTone twoToneColor={COLORS.success}/>
              <strong>{t(intl, 'auth.emailVerified')}</strong>
            </>
        ) : (
            <>
              <WarningTwoTone twoToneColor={COLORS.warning}/>
              <strong>{t(intl, 'auth.emailNotVerified')}</strong>
              {verification.onSendVerification && (
                  <Can I={'email.verification'} a={verification.component}>
                    {verification.verificationSent && (
                        <div>{t(intl, 'auth.pendingVerification')}</div>
                    )}
                    <div className={styles.verification}
                         onClick={() => verification.onSendVerification(data, intl)}>
                      {verification.verificationSent ?
                          t(intl, 'auth.reSendVerification') :
                          t(intl, 'auth.sendVerification')}
                    </div>
                  </Can>
              )}
            </>
        )}
      </div>
  );
}

export default emailVerified;
