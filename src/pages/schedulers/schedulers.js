import React, { useRef } from 'react';
import { useIntl } from '@umijs/max';
import { ScheduleOutlined } from '@ant-design/icons';

import Main from '@/components/Main';
import Page from '@/components/Page/page.connect';
import { SubHeader } from '@/components/Page/page.subheader';

import { expandableScheduler, metadata } from '@/pages/schedulers/metadata/schedulers.metadata';

import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';
import { effectHook } from '@/utils/hooks';
import { componentAbilities } from '@/utils/auth/component.setting';

import styles from '@/pages/schedulers/schedulers.less';

const MODEL_NAME = 'schedulerModel';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const Schedulers = props => {
  const intl = useIntl();

  const {
    loading,
    prefix,
    authModel,
    schedulerModel,
    onQuery = stub,
    onDeleteScheduler = stub
  } = props;

  const {
    data = [],
    touched
  } = schedulerModel;

  effectHook(() => {
    authModel.user && onQuery();
  }, [authModel.user]);

  const subTitle = (
      <>
        <ScheduleOutlined style={{ marginRight: 10 }}/>
        {t(intl, 'panel.schedulersConfig')}
      </>
  );

  const component = 'schedulers';
  const {
    ability,
    disabled,
    canUpdate,
    canDelete,
    canExport
  } = componentAbilities(authModel, component, true);

  const schedulerProps = {
    loading,
    ability,
    disabled,
    prefix,
    onDeleteScheduler
  };

  const refTarget = useRef(null);

  const pageHeaderProps = {
    subTitle,
    loading,
    disabled,
    MODEL_NAME,
    component,
    actions: {
      exportBtn: { refTarget, data, disabled: !canExport },
      newBtn: false,
      closeBtn: false,
      saveBtn: false,
      menuBtn: false
    }
  };

  return (
      <Page touched={touched}
            component={component}
            spinEffects={[`${MODEL_NAME}/query`]}>
        <div className={styles.schedulersWrapper}>
          <SubHeader {...pageHeaderProps}/>
          <div ref={refTarget}>
            <Main.Table data={data}
                        expandable={expandableScheduler({ intl })}
                        {...metadata({
                          data,
                          intl,
                          ...schedulerProps
                        })} />
          </div>
        </div>
      </Page>
  );
};