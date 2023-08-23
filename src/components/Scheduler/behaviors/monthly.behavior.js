import React, { useState } from 'react';
import { useIntl } from '@umijs/max';
import { InputNumber, Radio, Space, Form, Spin } from 'antd';

import { handleDurationValueChange, handleSelectWeeklyDay } from '@/components/Scheduler/handlers';
import { WeeklyBehavior } from '@/components/Scheduler/behaviors/weekly.behavior';
import { requiredField } from '@/components/Form';
import { setDefaultRepeats } from '@/components/Scheduler/metadata/entityForm.defaults';

import { stub } from '@/utils/function';
import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';

import styles from '../scheduler.module.less';

/**
 * @constant
 * @returns {JSX.Element}
 * @constructor
 */
export const MonthlyBehavior = (props) => {
  const {
    min = 1,
    max = 31,
    loading,
    prefix,
    disabled = false,
    isActive = false,
    form,
    setPeriod = stub,
    entityFormDefaults = {}
  } = props;

  const intl = useIntl();

  const [dayComponent, setDayComponent] = useState(null);
  const [weekComponent, setWeekComponent] = useState(null);
  const [spinning, setSpinning] = useState(loading);

  const day = t(intl, 'scheduler.day');

  effectHook(() => {
    if (isActive) {
      let scheduler = form.getFieldValue(prefix);
      let value = scheduler?.repeat?.monthly?.type;

      if (!value) {
        setDefaultRepeats(form, prefix, scheduler, { monthly: entityFormDefaults?.repeat?.monthly });
        scheduler = form.getFieldValue(prefix);
      }

      onChange({ target: { value: scheduler?.repeat?.monthly?.type }, preventDefault: stub });
    }
  }, [isActive]);

  /**
   * @description Handle radio box changing.
   * @param e
   */
  const onChange = (e) => {
    e.preventDefault();
    const type = e.target.value;

    setSpinning(true);

    if (type === 'Day') {
      setDayComponent(days(false));
      setWeekComponent(weeks(true));

      const scheduler = form.getFieldValue(prefix);

      const repeat = scheduler?.repeat;
      const duration = scheduler?.duration;
      const monthDay = repeat?.monthly?.monthDay;

      handleSelectWeeklyDay(
          monthDay, duration, repeat,
          { intl, formRef: form, setPeriod, prefix }
      );
    } else if (type === 'Period') {
      setDayComponent(days(true));
      setWeekComponent(weeks(false));
    }

    setSpinning(false);
  };

  /**
   * @constant
   */
  const handleWeekPeriodType = () => {
    setWeekComponent(weeks(false));

    const scheduler = form.getFieldValue(prefix) || {};

    handleDurationValueChange(
        scheduler?.duration,
        scheduler?.repeat,
        { intl, formRef: form, setPeriod, prefix });
  };

  /**
   * @constant
   * @param {boolean} [hidden]
   * @return {JSX.Element}
   */
  const weeks = (hidden = false) => {
    const periods = [
      { value: 'First', label: t(intl, 'scheduler.day.first') },
      { value: 'Second', label: t(intl, 'scheduler.day.second') },
      { value: 'Third', label: t(intl, 'scheduler.day.third') },
      { value: 'Fourth', label: t(intl, 'scheduler.day.fourth') },
      { value: 'Last', label: t(intl, 'scheduler.day.last') }
    ];

    return (
        <div className={styles.monthlyGridWeek}>
          <Form.Item noStyle
                     name={[prefix, 'repeat', 'monthly', 'weekDay']}
                     rules={[requiredField(intl, 'scheduler.weekday')]}>
            <Radio.Group loading={loading}
                         disabled={hidden || disabled}
                         optionType={'button'}
                         buttonStyle={'solid'}
                         onChange={handleWeekPeriodType}>
              {periods.map(({ value, label }, idx) => (
                  <Radio.Button key={idx}
                                disabled={hidden || disabled}
                                value={value}>
                    {label}
                  </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
          <WeeklyBehavior loading={loading}
                          form={form}
                          firstDayIdx={1}
                          prefix={prefix}
                          isMultiple={false}
                          entityFormDefaults={entityFormDefaults}
                          isActive={!hidden}
                          disabled={disabled || hidden}
                          extendBy={[
                            { label: t(intl, 'scheduler.day'), value: 'Day' },
                            { label: t(intl, 'scheduler.weekday'), value: 'Weekday' },
                            { label: t(intl, 'scheduler.weekend'), value: 'Weekend Day' }
                          ]}
                          setPeriod={setPeriod}/>
        </div>
    );
  };

  /**
   * @constant
   * @param {boolean} [hidden]
   * @return {JSX.Element}
   */
  const days = (hidden = false) => {
    return (
        <div className={styles.monthlyGridDay}>
          <Form.Item noStyle
                     name={[prefix, 'repeat', 'monthly', 'monthDay']}
                     hasFeedback
                     rules={[requiredField(intl, t(intl, 'scheduler.days'))]}>
            <InputNumber min={min}
                         max={max}
                         onBlur={() => {
                           const scheduler = form.getFieldValue(prefix);

                           const monthDay = scheduler?.repeat?.monthly?.monthDay;
                           const duration = scheduler?.duration;
                           const repeat = scheduler?.repeat;

                           handleSelectWeeklyDay(
                               monthDay, duration, repeat,
                               { intl, formRef: form, setPeriod, prefix }
                           );
                         }}
                         addonAfter={day}
                         disabled={disabled || hidden}
                         placeholder={t(intl, 'form.placeholder', { field: day })}/>
          </Form.Item>
        </div>
    );
  };

  return (
      <div className={styles.monthWrapper}>
        <Spin spinning={spinning}>
          <Form.Item noStyle
                     name={[prefix, 'repeat', 'monthly', 'type']}
                     rules={[requiredField(intl, 'scheduler.meta.period')]}>
            <Radio.Group onChange={onChange}>
              <Space direction={'vertical'}>
                <Radio value={'Day'}/>
                <Radio value={'Period'}/>
              </Space>
            </Radio.Group>
          </Form.Item>
          <div className={styles.monthComponents}>
            {dayComponent}
            {weekComponent}
          </div>
        </Spin>
      </div>
  );
};