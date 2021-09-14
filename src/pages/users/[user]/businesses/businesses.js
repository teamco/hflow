import Page from 'components/Page';
import userStyles from 'pages/users/users.module.less';
import React, { useEffect } from 'react';
import { connect } from 'dva';
import { useParams } from 'umi';
import { withTranslation } from 'react-i18next';
import { PageHeader, Button } from 'antd';
import {
  AppstoreAddOutlined,
  TrademarkOutlined
} from '@ant-design/icons';

import Main from 'components/Main';
import { metadata } from 'pages/users/[user]/businesses/businesses.metadata';

import styles from 'pages/users/[user]/businesses/businesses.module.less';
import { Can } from 'utils/auth/can';

const { Table } = Main;

const businesses = (props) => {
  const params = useParams();

  const {
    t,
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

  useEffect(() => {
    onGetBusinesses(selectedUser, params.user);
  }, [authModel.user]);

  const subTitle = (
    <>
      <TrademarkOutlined style={{ marginRight: 10 }} />
      {t('business')}
    </>
  );

  const { ability } = authModel;
  const component = 'businesses';
  const disabled = ability.cannot('create', component);

  return (
    <Page className={userStyles.users}
          component={component}
          spinEffects={['businessModel/query']}>
      <div className={styles.businessWrapper}
           style={style}>
        <PageHeader ghost={false}
                    subTitle={subTitle}
                    extra={[
                      <Can I={'create'} a={component} key={'add'}>
                        <Button size={'small'}
                                disabled={disabled}
                                icon={<AppstoreAddOutlined />}
                                onClick={() => onNew(params.user)}
                                type={'primary'}>
                          {t('actions:new')}
                        </Button>
                      </Can>
                    ]}>
        </PageHeader>
        <Table data={data}
               {...metadata({
                 t,
                 data,
                 many: true,
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

export default connect(
  ({ authModel, businessModel, loading }) => {
    return {
      authModel,
      businessModel,
      loading
    };
  },
  (dispatch) => ({
    dispatch,
    onNew(userId) {
      dispatch({ type: `businessModel/newBusiness`, payload: { userId } });
    },
    onGetBusinesses(selectedUser, userId) {
      dispatch({ type: `businessModel/query`, payload: { selectedUser, userId } });
    }
  })
)(withTranslation()(businesses));
