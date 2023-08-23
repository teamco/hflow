import React, { useState } from 'react';
import { useIntl } from '@umijs/max';

import { effectHook } from '@/utils/hooks';
import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';

import { requiredField } from '@/components/Form';
import CheckboxButtons from '@/components/Buttons/checkbox.buttons';
import { handleDurationValueChange } from '@/components/Scheduler/handlers';
import { MonthlyBehavior } from '@/components/Scheduler/behaviors/monthly.behavior';
import { setDefaultRepeats } from '@/components/Scheduler/metadata/entityForm.defaults';

import styles from '../scheduler.module.less';
import { Spin } from 'antd';

/**
 * @constant
 * @returns {JSX.Element}
 * @constructor
 */
export const YearlyBehavior = (props) => {
  const {
    shortFormat = true,
    isActive = false,
    isMultiple = false,
    setPeriod = stub,
    loading,
    form,
    prefix,
    disabled,
    entityFormDefaults = {}
  } = props;

  const intl = useIntl();

  const [months, setMonths] = useState([]);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [spinning, setSpinning] = useState(loading);

  const longMonths = [
    t(intl, 'scheduler.months.january'),
    t(intl, 'scheduler.months.february'),
    t(intl, 'scheduler.months.march'),
    t(intl, 'scheduler.months.april'),
    t(intl, 'scheduler.months.may'),
    t(intl, 'scheduler.months.june'),
    t(intl, 'scheduler.months.july'),
    t(intl, 'scheduler.months.august'),
    t(intl, 'scheduler.months.september'),
    t(intl, 'scheduler.months.october'),
    t(intl, 'scheduler.months.november'),
    t(intl, 'scheduler.months.december')
  ];

  const shortMonths = [
    t(intl, 'scheduler.months.short.january'),
    t(intl, 'scheduler.months.short.february'),
    t(intl, 'scheduler.months.short.march'),
    t(intl, 'scheduler.months.short.april'),
    t(intl, 'scheduler.months.short.may'),
    t(intl, 'scheduler.months.short.june'),
    t(intl, 'scheduler.months.short.july'),
    t(intl, 'scheduler.months.short.august'),
    t(intl, 'scheduler.months.short.september'),
    t(intl, 'scheduler.months.short.october'),
    t(intl, 'scheduler.months.short.november'),
    t(intl, 'scheduler.months.short.december')
  ];

  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  effectHook(() => {
    if (isActive) {
      const _months = MONTHS.map((month, idx) => ({
        label: (shortFormat ? shortMonths : longMonths)[idx],
        value: month
      }));

      setMonths(_months);

      let scheduler = form.getFieldValue(prefix);
      let values = scheduler?.repeat?.yearly?.months;

      if (!values) {
        setDefaultRepeats(form, prefix, scheduler, { yearly: entityFormDefaults?.repeat?.yearly });
        scheduler = form.getFieldValue(prefix);
      }

      onChange(scheduler?.repeat?.yearly?.months);
    }

  }, [isActive]);

  /**
   * @description Prevent to uncheck all.
   * @constant
   * @param values
   */
  const onChange = values => {
    setSpinning(true);

    let _values = [...values];

    if (_values.length) {
      if (_values.length === 1) {
        form.setFieldsValue({ [prefix]: { repeat: { yearly: { months: _values } } } });
      } else if (isMultiple) {
        // TODO (teamco): Do something.
      } else {
        _values = _values.find(day => !selectedMonths.includes(day));
        form.setFieldsValue({ [prefix]: { repeat: { yearly: { months: [_values] } } } });
      }

      setSelectedMonths(_values);

    } else {
      form.setFieldsValue({ [prefix]: { repeat: { yearly: { months: selectedMonths } } } });
    }

    const scheduler = form.getFieldValue(prefix);

    handleDurationValueChange(
        scheduler?.duration,
        scheduler?.repeat,
        { intl, formRef: form, setPeriod, prefix }
    );

    setSpinning(false);
  };

  return (
      <div className={styles.yearWrapper}>
        <Spin spinning={spinning}>
          <CheckboxButtons options={months}
                           disabled={disabled}
                           form={form}
                           className={styles.monthsWrapper}
                           loading={loading}
                           name={[prefix, 'repeat', 'yearly', 'months']}
                           rules={[requiredField(intl, t(intl, 'scheduler.months'))]}
                           onChange={onChange}/>
          <MonthlyBehavior loading={loading}
                           form={form}
                           prefix={prefix}
                           isActive={isActive}
                           entityFormDefaults={entityFormDefaults}
                           disabled={disabled}
                           setPeriod={setPeriod}
                           handlerProps={{ ...props, intl, formRef: form }}/>
        </Spin>
      </div>
  );
};