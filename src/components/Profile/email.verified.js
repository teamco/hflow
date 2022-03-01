import React from 'react';
import { CheckCircleTwoTone, WarningTwoTone } from '@ant-design/icons';
import { useIntl } from 'umi';

import { Can } from '@/utils/auth/can';
import { COLORS } from '@/utils/colors';

import styles from 'pages/users/users.module.less';

/**
 * @export
 * @default
 * @param props
 * @return {JSX.Element}
 */
function emailVerified(props) {
  const { data, verification = { component: null } } = props;
  const intl = useIntl();
  return (
      <div>
        {data.emailVerified ? (
            <>
              <CheckCircleTwoTone twoToneColor={COLORS.success}/>
              <strong>{intl.formatMessage({id: 'auth.emailVerified', defaultMessage: 'Verified'})}</strong>
            </>
        ) : (
            <>
              <WarningTwoTone twoToneColor={COLORS.warning}/>
              <strong>{intl.formatMessage({id: 'auth.emailNotVerified', defaultMessage: 'Not Verified'})}</strong>
              {verification.onSendVerification && (
                  <Can I={'sendVerificationEmail'} a={verification.component}>
                    {verification.verificationSent && (
                        <div>{intl.formatMessage({id: 'auth.pendingVerification', defaultMessage: 'Pending Verification'})}</div>
                    )}
                    <div className={styles.verification}
                         onClick={() => verification.onSendVerification(data)}>
                      {verification.verificationSent ? intl.formatMessage({id: 'auth.reSendVerification', defaultMessage: 'e-Send Email Verification'}) : intl.formatMessage({id: 'auth.sendVerification', defaultMessage: 'Send Email Verification'})}
                    </div>
                  </Can>
              )}
            </>
        )}
      </div>
  );
}

export default emailVerified;
