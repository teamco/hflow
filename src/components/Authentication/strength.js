import React from 'react';
import { withTranslation } from 'react-i18next';
import { Progress } from 'antd';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
const strength = props => {
  const { meterValue, meterText, className, t } = props;

  const strength = [
    { text: t('auth:pwdStrengthWorst'), colors: ['#1a301f', '#fd1d1d'] },
    { text: t('auth:pwdStrengthBad'), colors: ['#fd1d1d', '#fd7c1d'] },
    { text: t('auth:pwdStrengthWeak'), colors: ['#fd7c1d', '#fdfc1d'] },
    { text: t('auth:pwdStrengthGood'), colors: ['#fdfc1d', '#1dfd4b'] },
    { text: t('auth:pwdStrengthStrong'), colors: ['#1dfd4b', '#1d36fd'] }
  ];

  const _strength = strength[meterValue] || { colors: ['#ffffff', '#ffffff'] };
  const percent = meterValue === null ? 0 : (meterValue + 1) * 20;

  return (
    <div className={className}>
      <Progress strokeColor={{ '0%': _strength.colors[0], '100%': _strength.colors[1] }}
                status={'active'}
                showInfo={false}
                percent={percent} />
      <span>{(strength[meterText] || {}).text || ''}</span>
    </div>
  );
};

export default withTranslation()(strength);