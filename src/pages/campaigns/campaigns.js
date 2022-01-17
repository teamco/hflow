import React  from 'react';
import { Button, PageHeader } from 'antd';
import { AppstoreAddOutlined, ShoppingCartOutlined } from '@ant-design/icons';

import Page from '@/components/Page';
import Main from '@/components/Main';
import { Can } from '@/utils/auth/can';

import styles from '@/pages/campaigns/campaigns.module.less';
import userStyles from '@/pages/users/users.module.less';
import { metadata } from '@/pages/campaigns/campaigns.metadata';
import ExportButton from '@/components/Buttons/export.button';
import { effectHook } from '@/utils/state';

const { Table } = Main;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const campaigns = (props) => {
  const {
    t,
    authModel,
    campaignModel,
    onQuery,
    onNew,
    style,
    loading
  } = props;

  const {
    data,
  } = campaignModel;

  effectHook(() => {
    onQuery();
  }, [authModel.user]);

  const { ability } = authModel;
  const component = 'campaigns';
  const disabled = ability.cannot('create', component);

  const subTitle = (
      <>
        <ShoppingCartOutlined style={{ marginRight: 10 }}/>
        {t('menu:campaigns')}
      </>
  );
  const campaignProps = {
    loading,
    ability
  };

  const tableProps = {
    pagination: false
  };

  return (
      <Page className={userStyles.users}
            component={component}
            spinEffects={[
              'campaignModel/query',
              'campaignModel/prepareToSave'
            ]}>
        <div className={styles.campaignWrapper}
             style={style}>
          <PageHeader ghost={false}
                      subTitle={subTitle}
                      extra={[
                        <ExportButton key={'export'}
                                      disabled={disabled}
                                      component={component}
                                      json={data}/>,
                        <Can I={'create'} a={component} key={'add'}>
                          <Button size={'small'}
                                  loading={loading.effects['campaignModel/newCampaign']}
                                  disabled={disabled}
                                  icon={<AppstoreAddOutlined/>}
                                  onClick={() => onNew()}
                                  type={'primary'}>
                            {t('actions:new')}
                          </Button>
                        </Can>
                      ]}>
          </PageHeader>
          <Table data={data}
                 {...tableProps}
                 {...metadata({ t, ...campaignProps })} />
        </div>
      </Page>
  );
};
