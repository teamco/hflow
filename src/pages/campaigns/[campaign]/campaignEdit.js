import React  from 'react';
import { DownOutlined, SettingOutlined, TrademarkOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, PageHeader } from 'antd';

import SaveButton from '@/components/Buttons/save.button';
import Main from '@/components/Main';
import Page from '@/components/Page';
import { DEFAULT_PRICE_VALUES } from '@/components/Price/form.price';
import  Common  from '@/components/Common';

import { CampaignInfo } from '@/pages/campaigns/[campaign]/form/campaign.info';
import { CampaignDiscount } from '@/pages/campaigns/[campaign]/form/campaign.discount';

import CampaignMenu from '@/pages/campaigns/metadata/campaigns.menu';

import { useParams } from 'umi';

import { fromForm } from '@/utils/object';
import { isLoading } from '@/utils/state';
import { effectHook } from '@/utils/hooks';

import menuStyles from '@/components/menu.less';
import styles from '@/pages/campaigns/campaigns.module.less';
import userStyles from '@/pages/users/users.module.less';

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
    onSave,
    onClose,
    onDeleteCampaign,
    onSubscriptions,
    onUpdateTags
  } = props;

  /**
   * @type {{campaign}}
   */
  const params = useParams();

  const {
    entityForm,
    selectedCampaign,
    subscriptions,
    campaignTypes,
    campaignPeriod,
    durationTypes,
    businessUsers,
    currencies,
    featureTypes,
    isEdit,
    touched,
    tags
  } = campaignModel;

  const { ability } = authModel;
  const component = 'campaigns';
  const disabled = ability.cannot('update', component);
  const canUpdate = ability.can('update', component);


  effectHook(() => {
    canUpdate && onEditCampaign(params);
    onSubscriptions();
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
    businessUsers,
    subscriptions,
  };

  const discountProps = {
    formRef,
    disabled,
    currencies,
    durationTypes
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

  const tagsProps = {
    t,
    formRef,
    onUpdateTags,
    disabled,
    tags,
    header: t('campaign:tags')
  };

  const translateProps = {
    formRef,
    disabled
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
                initialValues={{
                  helper: true,
                  defaultState: true,
                  ...DEFAULT_PRICE_VALUES(currencies[0]),
                  featureType: featureTypes[0],
                  translateKeys: {
                    on: 'actions:yes',
                    off: 'actions:no'
                  },
                }}
                onFieldsChange={onFieldsChange}>
            <CampaignInfo {...campaignInfoProps} />
            <CampaignDiscount {...discountProps} />
            <Common.Translate {...translateProps} />
            <Common.Tags {...tagsProps} />
            <Info {...infoProps} />
          </Form>
        </div>
      </Page>
  );
};
