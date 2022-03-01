import React from 'react';
import { useIntl } from 'umi';
import { Progress } from 'antd';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
const strength = props => {
  const intl = useIntl();
  const { meterValue, meterText, className, t } = props;

  const strength = [
    { text: intl.formatMessage({id: 'auth.pwdStrengthWorst', defaultMessage: 'Worst'}), colors: ['#1a301f', '#fd1d1d'] },
    { text: intl.formatMessage({id: 'auth.pwdStrengthBad', defaultMessage: 'Bad'}), colors: ['#fd1d1d', '#fd7c1d'] },
    { text: intl.formatMessage({id: 'auth.pwdStrengthWeak', defaultMessage: 'Weak'}), colors: ['#fd7c1d', '#fdfc1d'] },
    { text: intl.formatMessage({id: 'auth.pwdStrengthGood', defaultMessage: 'Good'}), colors: ['#fdfc1d', '#1dfd4b'] },
    { text: intl.formatMessage({id: 'auth.pwdStrengthStrong', defaultMessage: 'Strong' }), colors: ['#1dfd4b', '#1d36fd'] }
  ];

  const _strength = strength[meterValue] || { colors: ['#ffffff', '#ffffff'] };
  const percent = meterValue === null ? 0 : (meterValue + 1) * 20;

  return (
      <div className={className}>
        <Progress strokeColor={{ '0%': _strength.colors[0], '100%': _strength.colors[1] }}
                  status={'active'}
                  showInfo={false}
                  percent={percent}/>
        <span>{(strength[meterText] || {}).text || ''}</span>
      </div>
  );
};

export default strength;
