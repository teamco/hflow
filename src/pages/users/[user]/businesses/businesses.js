import React  from 'react';
import { useParams, useIntl } from 'umi';

import Page from '@/components/Page';
import { Button, PageHeader } from 'antd';
import { AppstoreAddOutlined, TrademarkOutlined } from '@ant-design/icons';
import Main from '@/components/Main';

import { Can } from '@/utils/auth/can';
import ExportButton from '@/components/Buttons/export.button';

import { metadata } from 'pages/users/[user]/businesses/businesses.metadata';
import userStyles from 'pages/users/users.module.less';
import styles from 'pages/users/[user]/businesses/businesses.module.less';
import { effectHook } from '@/utils/hooks';

const { Table } = Main;

export const businesses = (props) => {
  const intl = useIntl();
  const {
    businessModel,
    authModel,
    loading,
    selectedUser,
    onNew,
    onGetBusinesses,
    onDeleteBusiness,
    onHoldBusiness,
    onActivateBusiness,
    style
  } = props;

  const {
    data = []
  } = businessModel;

  /**
   * @type {{user}}
   */
  const { user = authModel.user?.id } = useParams();

  effectHook(() => {
    onGetBusinesses(selectedUser, user);
  }, [authModel.user, user]);

  const subTitle = (
      <>
        <TrademarkOutlined style={{ marginRight: 10 }}/>
        {intl.formatMessage({id: 'business.meta', defaultMessage: 'Business'})}
      </>
  );

  const { ability } = authModel;
  const component = 'businesses';
  const disabled = ability.cannot('create', component);

  return (
      <Page className={userStyles.users}
            component={component}
            spinEffects={[
              'businessModel/query',
              'businessModel/validateBusiness'
            ]}>
        <div className={styles.businessWrapper}
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
                                  loading={loading.effects['businessModel/newBusiness']}
                                  disabled={disabled}
                                  icon={<AppstoreAddOutlined/>}
                                  onClick={() => onNew(user)}
                                  type={'primary'}>
                            {intl.formatMessage({id: 'actions:new', defaultMessage: 'New'})}
                          </Button>
                        </Can>
                      ]}>
          </PageHeader>
          <Table data={data}
                 {...metadata({
                   data,
                   user,
                   isEdit: false,
                   multiple: true,
                   ability,
                   loading,
                   onDeleteBusiness,
                   onHoldBusiness,
                   onActivateBusiness
                 })} />
        </div>
      </Page>
  );
};
