import Page from 'components/Page';
import userStyles from 'pages/users/users.module.less';
import React, {useEffect} from 'react';
import {useParams} from 'umi';
import {Button, PageHeader} from 'antd';
import {AppstoreAddOutlined, TrademarkOutlined} from '@ant-design/icons';

import Main from 'components/Main';
import {metadata} from 'pages/users/[user]/businesses/businesses.metadata';

import styles from 'pages/users/[user]/businesses/businesses.module.less';
import {Can} from 'utils/auth/can';

const {Table} = Main;

export const businesses = (props) => {
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

  /**
   * @type {{user}}
   */
  const {user} = useParams();

  useEffect(() => {
    onGetBusinesses(selectedUser, user);
  }, [authModel.user, user]);

  const subTitle = (
      <>
        <TrademarkOutlined style={{marginRight: 10}}/>
        {t('business')}
      </>
  );

  const {ability} = authModel;
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
                        <Can I={'create'} a={component} key={'add'}>
                          <Button size={'small'}
                                  loading={loading.effects['businessModel/newBusiness']}
                                  disabled={disabled}
                                  icon={<AppstoreAddOutlined/>}
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
                   user,
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
