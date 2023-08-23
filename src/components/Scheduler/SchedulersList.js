import React from 'react';
import { useIntl } from '@umijs/max';
import { ScheduleOutlined } from '@ant-design/icons';

import FormComponents from '@/components/Form';
import Main from '@/components/Main';
import EmptyData from '@/components/EmptyData';
import OpenPanelButton from '@/components/Buttons/openPanel.button';
import HiddenField from '@/components/Form/HiddenField';

import { metadata } from '@/components/Scheduler/metadata/schedulersList.metadata';

import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';

const { GenericPanel } = FormComponents;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const SchedulersList = props => {
  const intl = useIntl();

  const {
    data = [],
    loading,
    ability,
    disabled,
    entityType = '',
    prefix,
    formRef,
    component,
    onOpenSiderPanel = stub,
    onDeleteScheduler = stub
  } = props;

  const schedulerProps = {
    loading,
    ability,
    disabled,
    prefix,
    component,
    onOpenSiderPanel,
    onDeleteScheduler
  };

  const disabledAddScheduler = ability.cannot('addScheduler', `${component}.scheduler`);

  const colProps = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 };

  return (
      <GenericPanel header={t(intl, 'scheduler.header.title', { entity: entityType })}
                    name={'info'}
                    defaultActiveKey={['info']}
                    extra={(
                        <OpenPanelButton onClick={() => onOpenSiderPanel(true)}
                                         loading={loading}
                                         disabled={disabledAddScheduler}
                                         icon={<ScheduleOutlined/>}
                                         label={t(intl, 'scheduler')}/>
                    )}>
        <div colProps={colProps}>
          {data.length ? (
              <Main.Table data={data}
                          style={{ padding: 0 }}
                          {...metadata({
                            data,
                            intl,
                            ...schedulerProps
                          })} />

          ) : (
              <>
                <EmptyData/>
                {formRef && (
                    <HiddenField name={`${entityType}.schedulers`}
                                 label={t(intl, 'scheduler')}
                                 form={formRef}
                                 required={true}
                                 data={data}
                                 disabled={disabled}/>
                )}
              </>
          )}
        </div>
      </GenericPanel>
  );
};