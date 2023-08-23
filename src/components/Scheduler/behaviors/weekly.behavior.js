import React, { useState } from 'react';
import { Spin, Tooltip } from 'antd';
import { useIntl } from '@umijs/max';

import { effectHook } from '@/utils/hooks';
import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';

import CheckboxButtons from '@/components/Buttons/checkbox.buttons';
import { handleDurationValueChange } from '@/components/Scheduler/handlers';
import { requiredField } from '@/components/Form';
import { setDefaultRepeats } from '@/components/Scheduler/metadata/entityForm.defaults';

import styles from '../scheduler.module.less';

/**
 * @constant
 * @returns {JSX.Element}
 * @constructor
 */
export const WeeklyBehavior = (props) => {
  const {
    firstDayIdx = 1,
    shortFormat = true,
    isActive = false,
    isMultiple = true,
    onSelectDay = stub,
    setPeriod = stub,
    loading,
    extendBy = [],
    namespace = 'repeat',
    form,
    prefix,
    disabled,
    entityFormDefaults = {}
  } = props;

  const intl = useIntl();

  const DAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  const longDays = [
    t(intl, 'scheduler.weekdays.sunday'),
    t(intl, 'scheduler.weekdays.monday'),
    t(intl, 'scheduler.weekdays.tuesday'),
    t(intl, 'scheduler.weekdays.wednesday'),
    t(intl, 'scheduler.weekdays.thursday'),
    t(intl, 'scheduler.weekdays.friday'),
    t(intl, 'scheduler.weekdays.saturday')
  ];

  const shortDays = [
    t(intl, 'scheduler.weekdays.short.sunday'),
    t(intl, 'scheduler.weekdays.short.monday'),
    t(intl, 'scheduler.weekdays.short.tuesday'),
    t(intl, 'scheduler.weekdays.short.wednesday'),
    t(intl, 'scheduler.weekdays.short.thursday'),
    t(intl, 'scheduler.weekdays.short.friday'),
    t(intl, 'scheduler.weekdays.short.saturday')
  ];

  let defaultValues = longDays.filter((_day, idx) => [firstDayIdx].includes(idx));

  const [weekShortDays, setShortWeekDays] = useState([]);
  const [weekLongDays, setLongWeekDays] = useState([]);
  const [realDays, setRealDays] = useState(DAYS);
  const [selectedDays, setSelectedDays] = useState(defaultValues);
  const [spinning, setSpinning] = useState(loading);

  /**
   * @constant
   * @param {number} [firstDayIdx]
   * @param {array} [days]
   * @returns {*[]}
   */
  const orderByFirstDayOfWeek = (firstDayIdx = 0, days = []) => [
    ...days.slice(firstDayIdx),
    ...days.slice(0, firstDayIdx)
  ];

  effectHook(() => {
    if (isActive) {
      setShortWeekDays(orderByFirstDayOfWeek(firstDayIdx, shortDays));
      setLongWeekDays(orderByFirstDayOfWeek(firstDayIdx, longDays));
      setRealDays(orderByFirstDayOfWeek(firstDayIdx, DAYS));

      let scheduler = form.getFieldValue(prefix) || {};
      let values = scheduler?.repeat?.weekly?.days;

      if (!values) {
        setDefaultRepeats(form, prefix, scheduler, { weekly: entityFormDefaults?.repeat?.weekly });
        scheduler = form.getFieldValue(prefix);
        values = scheduler?.repeat?.weekly?.days;
      }

      if (!isMultiple) {
        values = [values[0]];
      }

      onChange(values);
    }
  }, [isActive]);

  let options = (shortFormat ? weekShortDays : weekLongDays).map((day, idx) => ({
    label: shortFormat ? (<Tooltip title={weekLongDays[idx]}>{day}</Tooltip>) : day,
    value: realDays[idx]
  }));

  let _wrapperCss;
  if (extendBy.length) {
    options = [...options, ...extendBy];
    _wrapperCss = styles.weekDaysWrap;
  }

  /**
   * @description Prevent to uncheck all.
   * @constant
   * @param [values]
   */
  const onChange = (values = []) => {
    setSpinning(true);

    let _values = [...values];

    if (_values.length) {
      if (_values.length === 1) {
        // TODO (teamco): Do something.
      } else if (isMultiple) {
        // TODO (teamco): Do something.
      } else {
        _values = [_values.find(day => !selectedDays.includes(day))];
      }

      setSelectedDays(_values);

    } else {
      _values = selectedDays;
    }

    form.setFieldsValue({ [prefix]: { [namespace]: { weekly: { days: _values } } } });

    const scheduler = form.getFieldValue(prefix) || {};

    handleDurationValueChange(
        scheduler?.duration,
        scheduler?.repeat,
        { intl, formRef: form, setPeriod, prefix }
    );

    onSelectDay();

    setSpinning(false);
  };

  return isActive ? (
      <div className={_wrapperCss}>
        <Spin spinning={spinning}>
          <CheckboxButtons options={options}
                           disabled={disabled}
                           form={form}
                           loading={loading}
                           name={[prefix, 'repeat', 'weekly', 'days']}
                           rules={[requiredField(intl, t(intl, 'scheduler.days'))]}
                           onChange={onChange}/>
        </Spin>
      </div>
  ) : null;
};