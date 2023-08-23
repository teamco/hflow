import React, { useState } from 'react';
import { useIntl } from '@umijs/max';
import { DatePicker, Form, Select } from 'antd';
import ReactHtmlParser from 'react-html-parser';

import { DEFAULT_DATE_TIME_FORMAT, disabledDate } from '@/utils/timestamp';

import SaveButton from '@/components/Buttons/save.button';
import Duration from '@/components/Price/Range/Duration';
import {
  WeeklyBehavior
} from '@/components/Scheduler/behaviors/weekly.behavior';
import {
  MonthlyBehavior
} from '@/components/Scheduler/behaviors/monthly.behavior';
import {
  YearlyBehavior
} from '@/components/Scheduler/behaviors/yearly.behavior';

import FormComponents, {
  validateFields,
  requiredField
} from '@/components/Form';
import {
  handleChangeStartDate,
  handleDurationTypeChange,
  handleDurationValueChange,
  handleEndType,
  onThisDay
} from '@/components/Scheduler/handlers';

import { effectHook } from '@/utils/hooks';
import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';

import styles from '@/components/Scheduler/scheduler.module.less';

const { Option } = Select;
const { GenericPanel } = FormComponents;

/**
 * @export
 * @const
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const Scheduler = props => {
  const [formRef] = Form.useForm();
  const intl = useIntl();

  const {
    prefix,
    entityName,
    onFinish,
    isEdit = false,
    disabled = false,
    durationTypes = [],
    loading,
    modelName,
    component = 'scheduler',
    onHandleScheduler = stub,
    entityType,
    canAbility,
    schedulerModel = {}
  } = props;

  const {
    entityFormDefaults = {}
  } = schedulerModel;

  const entityForm = Object.keys(props.entityForm || {}).length ?
      props.entityForm :
      entityFormDefaults;

  if (typeof prefix !== 'string') {
    throw new Error('Prefix must be a string.');
  }

  if (typeof entityType !== 'string') {
    throw new Error('EntityType must be a string.');
  }

  const endReasonTypes = ['Date', 'Number', 'Permanent'];
  const filterOutDurationTypes = ['Hour', 'Permanent'];

  const [endTypeComponent, setEndTypeComponent] = useState(
      onThisDay({ intl, formRef, disabled }));
  const [weekComponent, setWeekComponent] = useState(false);
  const [monthComponent, setMonthComponent] = useState(false);
  const [yearComponent, setYearComponent] = useState(false);
  const [startAt, setStartAt] = useState(null);
  const [period, setPeriod] = useState(0);

  effectHook(() => {
    const scheduler = formRef.getFieldValue(prefix) || {};

    handleDurationTypeChange(scheduler?.duration?.type, { ...handlerProps });
    handleDurationValueChange(
        scheduler?.duration,
        scheduler?.repeat,
        { ...handlerProps });
    handleChangeStartDate(scheduler?.range?.startedAt, { ...handlerProps });
    handleEndType(scheduler?.range?.endReason?.type, { ...handlerProps });
  });

  const handlerProps = {
    intl,
    prefix,
    disabled,
    formRef,
    setWeekComponent,
    setMonthComponent,
    setYearComponent,
    setPeriod,
    setStartAt,
    setEndTypeComponent
  };

  const colProps = { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 };

  const startedAt = t(intl, 'scheduler.startedAt');
  const duration = t(intl, 'scheduler.duration');

  /**
   * @constant
   * @return {boolean}
   */
  const handleScheduler = () => {
    validateFields(formRef, () => {
      let values = formRef.getFieldsValue();
      if (props?.entityForm?.id) {
        values = {
          ...values,
          [prefix]: {
            ...values[prefix],
            id: props.entityForm.id,
            version: props.entityForm.version
          }
        };
      }

      onHandleScheduler(entityName, prefix, values, isEdit);
    });
  };

  return (
      <Form layout={'vertical'}
            className={styles.form}
            form={formRef}
            scrollToFirstError={true}
            onFinish={onFinish}
            initialValues={{
              [prefix]: { ...entityForm }
            }}>
        <GenericPanel
            header={t(intl, 'scheduler.header.title', { entity: entityType })}
            name={'info'}
            defaultActiveKey={['info']}
            extra={(
                <SaveButton key={'save'}
                            isEdit={typeof isEdit === 'number'}
                            component={component}
                            canType={'create'}
                            modelName={modelName}
                            disabled={disabled}
                            spinOn={[]}
                            canAbility={canAbility}
                            onClick={handleScheduler}
                            formRef={formRef}
                            loading={loading}/>
            )}>
          <div colProps={colProps}>
            <Duration form={formRef}
                      label={duration}
                      disabled={disabled}
                      onTypeChange={(value) => handleDurationTypeChange(value,
                          { ...handlerProps })}
                      onValueChange={() => {
                        const scheduler = formRef.getFieldValue(prefix) || {};

                        handleDurationValueChange(
                            scheduler?.duration,
                            scheduler?.repeat,
                            { ...handlerProps }
                        );
                      }}
                      prefix={[prefix]}
                      required={true}
                      durationTypes={durationTypes.filter(d =>
                          !filterOutDurationTypes.includes(d))}/>
            <DatePicker name={[prefix, 'range', 'startedAt']}
                        label={startedAt}
                        config={{
                          // valuePropName: 'date',
                          rules: [
                            requiredField(intl, t(intl, 'scheduler.startedAt'))
                          ]
                        }}
                        form={formRef}
                        onChange={(value) => handleChangeStartDate(value, {
                          ...handlerProps
                        })}
                        showTime
                        format={DEFAULT_DATE_TIME_FORMAT}
                        disabledDate={disabledDate}
                        disabled={false}/>
          </div>
          {weekComponent ? (
              <div colProps={colProps}>
                <WeeklyBehavior loading={loading}
                                form={formRef}
                                firstDayIdx={1}
                                isActive={weekComponent}
                                prefix={prefix}
                                isMultiple={true}
                                disabled={disabled}
                                setPeriod={setPeriod}/>
              </div>
          ) : null}
          {monthComponent ? (
              <div colProps={colProps}>
                <MonthlyBehavior loading={loading}
                                 form={formRef}
                                 prefix={prefix}
                                 isActive={monthComponent}
                                 entityFormDefaults={entityFormDefaults}
                                 disabled={disabled}
                                 setPeriod={setPeriod}
                                 handlerProps={handlerProps}/>
              </div>
          ) : null}
          {yearComponent ? (
              <div colProps={{
                xs: 16,
                sm: 16,
                md: 16,
                lg: 16,
                xl: 16,
                xxl: 16
              }}>
                <YearlyBehavior loading={loading}
                                form={formRef}
                                prefix={prefix}
                                isActive={yearComponent}
                                entityFormDefaults={entityFormDefaults}
                                disabled={disabled}
                                setPeriod={setPeriod}
                                handlerProps={handlerProps}/>
              </div>
          ) : null}
          <div colProps={colProps}>
            <Select
                onChange={(value) => handleEndType(value, { ...handlerProps })}
                form={formRef}
                name={[prefix, 'range', 'endReason', 'type']}
                label={t(intl, 'scheduler.duration.end')}
                config={{
                  rules: [
                    requiredField(intl, t(intl, 'scheduler.duration.end'))]
                }}>
              {[
                t(intl, 'scheduler.duration.end.day'),
                t(intl, 'scheduler.duration.end.after'),
                t(intl, 'scheduler.duration.end.no')
              ].map((type, idx) => (
                  <Option value={endReasonTypes[idx]} key={idx}>{type}</Option>
              ))}
            </Select>
            {endTypeComponent}
          </div>
        </GenericPanel>
        <span className={styles.result}>
          {ReactHtmlParser(t(intl, 'scheduler.result', { period, startAt }))}
        </span>
      </Form>
  );
};
