import React, { useEffect } from 'react';
import { Button, PageHeader } from 'antd';
import { AppstoreAddOutlined, ShoppingCartOutlined } from '@ant-design/icons';

import Page from 'components/Page';
import { Can } from 'utils/auth/can';

import CampaignCard from 'pages/campaigns/templates/campaignCard';
import { campaignCardMetadata } from 'pages/campaigns/campaigns.metadata';

import styles from 'pages/campaigns/campaigns.module.less';
import userStyles from 'pages/users/users.module.less';
import {cardProps} from './data';

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
    onDeleteCampaign,
    style,
    loading
  } = props;

  const {
    campaigns = { data: [] },
    colorsToType
  } = campaignModel;

  useEffect(() => {
    // onQuery();
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

  const menuProps = {
    isEdit: false,
    ability,
    loading,
    component,
    onDeleteCampaign
  };

  const campaignsTemp =
      {
        t,
        menuProps,
        iEdit: true,
        ...campaignProps,
        data: cardProps
      };
  return (
      <Page className={userStyles.users}
            component={component}
            spinEffects={[
              'campaignModel/prepareToSave'
            ]}>
        <div className={styles.campaignWrapper}
             style={style}>
          <PageHeader ghost={false}
                      subTitle={subTitle}
                      extra={[
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
          <div className={styles.campaignCards}>
          {campaignsTemp?.data?.length ? campaignsTemp?.data?.map((data, idx) => {
            const props = {
              t,
              isEdit: true,
              colorsToType,
              ...campaignCardMetadata(t, {
                data,
                className: styles.campaignCard,
                menuProps,
                ...campaignProps
              })
            };
            return (<CampaignCard key={idx} {...props} />);
          }) : null}
        </div>
        </div>
      </Page>
  );
};
