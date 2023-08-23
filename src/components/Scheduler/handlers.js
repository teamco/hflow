import React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

import { DEFAULT_DATE_TIME_FORMAT, disabledDate } from '@/utils/timestamp';
import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';

import { AfterBehavior } from '@/components/Scheduler/behaviors/after.behavior';
import { dayHandler } from '@/components/Scheduler/handlers/day.handler';
import { weekHandler } from '@/components/Scheduler/handlers/week.handler';
import { monthHandler } from '@/components/Scheduler/handlers/month.handler';
import { yearHandler } from '@/components/Scheduler/handlers/year.handler';

/**
 * @export
 * @param props
 * @returns {JSX.Element}
 */
export const onThisDay = (props) => {
  const { intl, formRef, disabled, prefix } = props;

  const dayProps = {
    form: formRef,
    name: [prefix, 'range', 'endReason', 'expiredAt'],
    label: t(intl, 'scheduler.duration.endDate'),
    config: {
      // valuePropName: 'date',
      rules: [{ required: true }]
    },
    format: DEFAULT_DATE_TIME_FORMAT,
    showTime: true,
    disabledDate,
    disabled
  };

  return (
      <DatePicker {...dayProps}/>
  );
};

/**
 * @constant
 * @param {string} value
 * @param {*} intl
 * @param {*} formRef
 * @param {boolean} disabled
 * @param {string} prefix
 * @param {function} setEndTypeComponent
 */
export const handleEndType = (value, { intl, formRef, disabled, setEndTypeComponent, prefix }) => {
  let _endTypeComponent = null;

  switch (value) {
    case 'Date':
      _endTypeComponent = onThisDay({ intl, formRef, disabled, prefix });
      break;
    case 'Number':
      _endTypeComponent = <AfterBehavior formRef={formRef}
                                         prefix={[prefix]}
                                         label={t(intl, 'scheduler.occurrences')}/>;
      break;
  }

  setEndTypeComponent(_endTypeComponent);
};

/**
 * @export
 * @constant
 * @param {string} singular
 * @param {string} plural
 * @param value
 * @param intl
 * @return {string}
 */
export const handleMsg = ({ singular, plural }, value, intl) => {
  let msg = `${value} ${t(intl, plural)}`;
  if (value === 1) {
    msg = t(intl, singular);
  }

  return msg;
};

/**
 * @constant
 * @param duration
 * @param repeat
 * @param {*} props
 * @param {string} [extender]
 */
export const handleDurationValueChange = (duration, repeat, props, extender = '') => {
  const { intl, formRef, setPeriod = stub, prefix } = props;
  let msg;

  const handlerProps = { intl, formRef, prefix, setPeriod };

  switch (duration.type) {
    case 'Day':
      msg = dayHandler(duration, { ...handlerProps });
      setPeriod(`${extender}${msg}`);
      break;
    case 'Week':
      return weekHandler(duration, repeat, { ...handlerProps });
    case 'Month':
      return monthHandler(duration, repeat, { ...handlerProps });
    case 'Year':
      return yearHandler(duration, repeat, { ...handlerProps });
  }
};

/**
 * @constant
 * @param value
 * @param setStartAt
 */
export const handleChangeStartDate = (value, { setStartAt }) => {
  const _m = dayjs(value);
  const _startAt = [
    _m.format('dddd'),
    `${_m.date()} ${_m.format('MMMM')} ${_m.format('YYYY')}`,
    `at ${_m.hour()}:${_m.minute()}`
  ].join(', ');

  setStartAt(_startAt);
};

/**
 * @constant
 * @param {string} value
 * @param {string} prefix
 * @param {*} formRef
 * @param {*} intl
 * @param {function} [setWeekComponent]
 * @param {function} [setMonthComponent]
 * @param {function} [setYearComponent]
 * @param {function} [setPeriod]
 */
export const handleDurationTypeChange = (value, {
  intl,
  formRef,
  setWeekComponent = stub,
  setMonthComponent = stub,
  setYearComponent = stub,
  setPeriod = stub,
  prefix
}) => {

  const scheduler = formRef.getFieldValue(prefix) || {};

  switch (value) {
    case 'Day':
      setWeekComponent(false);
      setMonthComponent(false);
      setYearComponent(false);
      break;
    case 'Week':
      setWeekComponent(true);
      setMonthComponent(false);
      setYearComponent(false);
      break;
    case 'Month':
      setWeekComponent(false);
      setMonthComponent(true);
      setYearComponent(false);
      break;
    case 'Year':
      setWeekComponent(false);
      setMonthComponent(false);
      setYearComponent(true);
      break;
  }

  handleDurationValueChange(
      scheduler?.duration,
      scheduler?.repeat,
      { intl, formRef, setPeriod, prefix }
  );
};

/**
 *
 * @param intl
 * @param monthDay
 * @param duration
 * @param repeat
 * @param formRef
 * @param setPeriod
 * @param prefix
 * @param [extra]
 */
export const handleSelectWeeklyDay = (monthDay, duration, repeat, { intl, formRef, setPeriod = stub, prefix }, extra) => {
  const _day = t(intl, 'scheduler.separator.day');
  const _of = t(intl, 'scheduler.separator.of');
  const _every = t(intl, 'scheduler.separator.every');
  const period = `${_day} ${monthDay} ${_of} ${_every} `;

  if (extra?.msg) {
    setPeriod(`${period} ${extra?.msg}`);
  } else {
    handleDurationValueChange(
        duration,
        repeat,
        { intl, formRef, setPeriod, prefix },
        period
    );
  }
};

/**
 * @export
 * @param intl
 * @param {Array} values
 * @return {string}
 */
export const handleMultipleDurations = (intl, values = []) => {
  const _and = t(intl, 'scheduler.separator.and');

  return [...values].join(', ').
      replace(/,*$/, '').
      replace(/,(?=[^,]*$)/, _and);
};