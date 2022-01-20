import React from 'react';
import { Button, PageHeader } from 'antd';
import { AppstoreAddOutlined, ControlOutlined } from '@ant-design/icons';

import Page from '@/components/Page';
import Main from '@/components/Main';
import ExportButton from '@/components/Buttons/export.button';

import { Can } from '@/utils/auth/can';
import { effectHook } from '@/utils/hooks';

import { expandableFeature, metadata } from '@/pages/subscriptions/features/feature.metadata';

import styles from 'pages/subscriptions/features/features.module.less';

const { Table } = Main;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const features = props => {
  const {
    t,
    authModel,
    featureModel,
    loading,
    onQuery,
    onNew
  } = props;

  const {
    touched,
    data
  } = featureModel;

  const tableProps = {
    pagination: false,
    expandable: expandableFeature({ t })
  };

  effectHook(() => {
    onQuery();
  }, [authModel.user]);

  const subTitle = (
      <>
        <ControlOutlined style={{ marginRight: 10 }}/>
        {t('panel:featureConfig')}
      </>
  );

  const { ability } = authModel;
  const component = 'features';
  const disabled = ability.cannot('update', component);

  const userProps = {
    loading,
    ability
  };

  return (
      <Page touched={touched}
            component={component}
            spinEffects={[
              'featureModel/query',
              'featureModel/prepareToSave'
            ]}>
        <div className={styles.featureWrapper}>
          <PageHeader ghost={false}
                      subTitle={subTitle}
                      extra={[
                        <ExportButton key={'export'}
                                      disabled={disabled}
                                      component={component}
                                      json={data}/>,
                        <Can I={'create'} a={component} key={'add'}>
                          <Button size={'small'}
                                  loading={loading.effects['featureModel/newFeature']}
                                  disabled={disabled}
                                  icon={<AppstoreAddOutlined/>}
                                  onClick={onNew}
                                  type={'primary'}>
                            {t('actions:new')}
                          </Button>
                        </Can>
                      ]}>
          </PageHeader>
          <Table data={data}
                 {...tableProps}
                 {...metadata({ t, ...userProps })} />
        </div>
      </Page>
  );
};
