import React, { useRef } from 'react';
import { ControlOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';

import Page from '@/components/Page/page.connect';
import Main from '@/components/Main';
import { SubHeader } from '@/components/Page/page.subheader';

import { t } from '@/utils/i18n';
import { effectHook } from '@/utils/hooks';
import { componentAbilities } from '@/utils/auth/component.setting';

import { expandableFeature, metadata } from '@/pages/subscriptions/features/features.metadata';

import styles from './features.module.less';

const { Table } = Main;

const MODEL_NAME = 'featureModel';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const features = props => {
  const intl = useIntl();

  const {
    authModel,
    featureModel,
    loading,
    onQuery,
    onNew,
    onDeleteFeature
  } = props;

  const {
    touched,
    data
  } = featureModel;

  const tableProps = {
    pagination: false,
    expandable: expandableFeature({ intl })
  };

  effectHook(() => {
    authModel.user && onQuery();
  }, [authModel.user]);

  const subTitle = (
      <>
        <ControlOutlined style={{ marginRight: 10 }}/>
        {t(intl, 'panel.featureConfig')}
      </>
  );

  const component = 'features';
  const {
    ability,
    disabled,
    canUpdate,
    canDelete,
    canExport
  } = componentAbilities(authModel, component, true);

  const featuresProps = {
    loading,
    ability,
    disabled,
    canUpdate,
    canDelete,
    onDeleteFeature
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
      newBtn: { onClick: onNew, spinOn: [`${MODEL_NAME}/newFeature`] },
      closeBtn: false,
      saveBtn: false,
      menuBtn: false
    }
  };

  return (
      <Page touched={touched}
            component={component}
            spinEffects={[`${MODEL_NAME}/query`]}>
        <div className={styles.featureWrapper}>
          <SubHeader {...pageHeaderProps}/>
          <div ref={refTarget}>
            <Table data={data}
                   {...tableProps}
                   {...metadata({ ...featuresProps })} />
          </div>
        </div>
      </Page>
  );
};
