import React, { useEffect } from 'react';
import { DownOutlined, SettingOutlined, TrademarkOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, PageHeader } from 'antd';

import SaveButton from 'components/Buttons/save.button';

import Main from 'components/Main';
import Page from 'components/Page';

import { CampaignInfo } from 'pages/campaigns/[campaign]/form/campaign.info';

import CampaignMenu from 'pages/campaigns/metadata/campaigns.menu';

import { useParams } from 'umi';

import { fromForm } from 'utils/object';
import { isLoading } from 'utils/state';

import menuStyles from 'components/menu.less';
import styles from 'pages/campaigns/campaigns.module.less';
import userStyles from 'pages/users/users.module.less';

const { Info } = Main;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const campaignEdit = (props) => {
  const [formRef] = Form.useForm();

  const {
    t,
    authModel,
    campaignModel,
    loading,
    onEditCampaign,
    onFieldsChange,
    onUpdateTags,
    onSave,
    onClose,
    onDeleteCampaign,
    onSubscriptions
  } = props;

  /**
   * @type {{campaign}}
   */
  const params = useParams();

  const {
    entityForm,
    selectedCampaign,
    campaignTypes,
    campaignPeriod,
    discountTypes,
    businessUsers,
    tags,
    isEdit,
    touched
  } = campaignModel;

  const { ability } = authModel;
  const component = 'campaigns';
  const disabled = ability.cannot('update', component);
  const canUpdate = ability.can('update', component);

  useEffect(() => {
    canUpdate && onEditCampaign(params);
    onSubscriptions()
  }, [authModel.user, canUpdate]);

  /**
   * @constant
   * @param formValues
   */
  const onFinish = formValues => {
    onSave(formValues, params);
  };

  const campaignInfoProps = {
    t,
    formRef,
    disabled,
    campaignTypes,
    campaignPeriod,
    discountTypes,
    businessUsers
  };

  const campaignPrefsProps = {
    t,
    formRef,
    disabled
  };

  const tagsProps = {
    t,
    formRef,
    onUpdateTags,
    disabled,
    tags
  };

  const {
    createdBy,
    updatedBy,
    createdAt,
    updatedAt
  } = fromForm(entityForm, 'metadata') || {};

  const infoProps = {
    t,
    isEdit,
    touched,
    info: {
      createdBy,
      updatedBy,
      createdAt,
      updatedAt
    }
  };

  const menuProps = {
    ability,
    isEdit,
    loading,
    params,
    component,
    onDeleteCampaign
  };

  const subTitle = (
      <>
        <TrademarkOutlined style={{ marginRight: 10 }}/>
        {isEdit ?
            t('actions:edit', { type: t('menu:campaign') }) :
            t('actions:addNew', { type: t('menu:campaign') })
        }
      </>
  );

  return (
      <Page className={userStyles.users}
            component={component}
            touched={!disabled && touched}
            spinEffects={[
              'campaignModel/editCampaign',
              'campaignModel/campaignTypes',
              'campaignModel/prepareToSave'
            ]}>
        <div className={styles.campaignWrapper}>
          <PageHeader ghost={false}
                      subTitle={subTitle}
                      extra={[
                        <Button key={'close'}
                                size={'small'}
                                loading={isLoading(loading.effects['campaignModel/prepareToSave'])}
                                onClick={() => onClose()}>
                          {t('actions:close')}
                        </Button>,
                        <SaveButton key={'save'}
                                    isEdit={isEdit}
                                    disabled={!touched || disabled}
                                    formRef={formRef}
                                    loading={loading.effects['campaignModel/prepareToSave']}/>,
                        <Dropdown overlay={<CampaignMenu record={selectedCampaign} {...menuProps} />}
                                  disabled={!isEdit || disabled}
                                  trigger={['click']}
                                  overlayClassName={menuStyles.customActionMenu}
                                  key={'custom'}>
                          <Button size={'small'}
                                  icon={<SettingOutlined/>}
                                  className={menuStyles.customAction}>
                            {t('actions:manage', { type: t('menu:campaign') })} <DownOutlined/>
                          </Button>
                        </Dropdown>
                      ]}/>
          <Form layout={'vertical'}
                className={styles.form}
                form={formRef}
                fields={entityForm}
                scrollToFirstError={true}
                onFinish={onFinish}
                onFieldsChange={onFieldsChange}
                initialValues={{
                  discountType: t('currency'),
                  price: 0,
                  discount: 0,
                  users: 1,
                  accessToMessages: true,
                  notifications: true,
                  dashboard: true,
                  placementOnMap: true
                }}>
            <CampaignInfo {...campaignInfoProps} />
            {/*<CampaignPreferences {...campaignPrefsProps} />*/}
            {/*<CampaignTags {...tagsProps} />*/}
            <Info {...infoProps} />
          </Form>
        </div>
      </Page>
  );
};
