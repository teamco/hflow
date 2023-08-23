import React, { useRef } from 'react';
import { FundOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';

import Page from '@/components/Page/page.connect';
import Main from '@/components/Main';
import { SubHeader } from '@/components/Page/page.subheader';

import { t } from '@/utils/i18n';
import { effectHook } from '@/utils/hooks';
import { componentAbilities } from '@/utils/auth/component.setting';

import { metadata } from '@/pages/campaigns/campaigns.metadata';

import styles from '@/pages/campaigns/campaigns.module.less';
import userStyles from '@/pages/users/users.module.less';

const { Table } = Main;

const MODEL_NAME = 'campaignModel';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const campaigns = (props) => {
  const intl = useIntl();

  const {
    authModel,
    campaignModel,
    onQuery,
    onNew,
    onDeleteCampaign,
    style,
    loading
  } = props;

  const {
    campaigns: data
  } = campaignModel;

  effectHook(() => {
    authModel.user && onQuery();
  }, [authModel.user]);

  const component = 'campaigns';
  const {
    ability,
    disabled,
    canUpdate,
    canDelete,
    canExport
  } = componentAbilities(authModel, component, true);

  const refTarget = useRef(null);

  const subTitle = (
      <>
        <FundOutlined style={{ marginRight: 10 }}/>
        {t(intl, 'menu.campaigns')}
      </>
  );

  const campaignProps = {
    loading,
    ability,
    disabled,
    canUpdate,
    canDelete,
    onDeleteCampaign
  };

  const tableProps = {
    pagination: false
  };

  const pageHeaderProps = {
    subTitle,
    loading,
    disabled,
    MODEL_NAME,
    component,
    actions: {
      exportBtn: { refTarget, data, disabled: !canExport },
      newBtn: { onClick: onNew, spinOn: [`${MODEL_NAME}/newCampaign`] },
      closeBtn: false,
      saveBtn: false,
      menuBtn: false
    }
  };

  return (
      <Page className={userStyles.users}
            component={component}
            spinEffects={[
              `${MODEL_NAME}/query`,
              `${MODEL_NAME}/newCampaign`,
              `${MODEL_NAME}/validateCampaign`
            ]}>
        <div className={styles.campaignWrapper}
             style={style}>
          <SubHeader {...pageHeaderProps}/>
          <div ref={refTarget}>
            <Table data={data}
                   {...tableProps}
                   {...metadata({ ...campaignProps })} />
          </div>
        </div>
      </Page>
  );
};
