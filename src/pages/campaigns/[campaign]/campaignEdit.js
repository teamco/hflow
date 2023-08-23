import React, { useState } from 'react';
import { FundOutlined } from '@ant-design/icons';
import { Col, Form, Row } from 'antd';
import { useIntl, useParams } from '@umijs/max';

import Main from '@/components/Main';
import Page from '@/components/Page/page.connect';
import Common from '@/components/Common';
import { DEFAULT_PRICE_VALUES } from '@/components/Price/form.price';
import { SchedulersList } from '@/components/Scheduler/SchedulersList';
import { formProps } from '@/components/Form/formProps';
import { SubHeader } from '@/components/Page/page.subheader';
import { validateFieldsOnLoad } from '@/components/Form';

import { updateSchedulerPanel } from '@/pages/subscriptions/[subscription]/panels';
import { CampaignInfo } from '@/pages/campaigns/[campaign]/form/campaign.info';
import { CampaignDiscount } from '@/pages/campaigns/[campaign]/form/campaign.discount';
import { campaignMenu } from '@/pages/campaigns/metadata/campaigns.menu';
import CampaignTrial from '@/pages/campaigns/[campaign]/form/campaign.trial';

import { fromForm } from '@/utils/object';
import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';
import { layout } from '@/utils/layout';
import { componentAbilities } from '@/utils/auth/component.setting';
import { isNew } from '@/services/common.service';

import styles from '@/pages/campaigns/campaigns.module.less';
import userStyles from '@/pages/users/users.module.less';

const { Info } = Main;

const MODEL_NAME = 'campaignModel';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const campaignEdit = (props) => {
  const intl = useIntl();
  const [formRef] = Form.useForm();

  const {
    authModel,
    campaignModel,
    loading,
    testId,
    onEditCampaign,
    onFieldsChange,
    onSave,
    onClose,
    onDeleteCampaign,
    onSubscriptions,
    onUpdateTags,
    onUpdateEntityForm,
    onHandleScheduler,
    onDeleteScheduler,
    onUpdateSider
  } = props;

  /**
   * @type {{campaign}}
   */
  const params = useParams();

  const {
    entityForm,
    selectedCampaign,
    subscriptions,
    typeSubscriptionsMap,
    campaignTypes,
    campaignPeriod,
    durationTypes,
    businessUsers,
    currencies,
    featureTypes,
    schedulers,
    schedulerTypes,
    isEdit,
    touched,
    tags,
    translateMessages
  } = campaignModel;

  const component = 'campaigns';

  const {
    ability,
    ableFor,
    disabled,
    canUpdate
  } = componentAbilities(authModel, component, !isNew(params.campaign));

  const [featuresPriceAccumulation, setFeaturesPriceAccumulations] = useState(0);
  const [isTrialed, setIsTrialed] = useState(false);

  effectHook(() => {
    if (canUpdate) {
      onEditCampaign(params);
      onSubscriptions();
    }
  }, [canUpdate]);

  validateFieldsOnLoad(formRef, entityForm);

  const metaProps = {
    intl,
    loading,
    ability,
    disabled,
    formRef,
    component,
    MODEL_NAME
  };

  const panelProps = {
    ...metaProps,
    onUpdateSider
  };

  /**
   * @constant
   * @param price
   */
  const setPriceAccumulation = price => {
    setFeaturesPriceAccumulations(price);
  };

  const campaignInfoProps = {
    formRef,
    disabled,
    isEdit,
    campaignTypes,
    campaignPeriod,
    businessUsers,
    subscriptions,
    typeSubscriptionsMap,
    setPriceAccumulation,
    onUpdateEntityForm,
    loading
  };

  const discountProps = {
    formRef,
    disabled,
    loading,
    isTrialed,
    setIsTrialed,
    currencies,
    durationTypes,
    originalPrice: featuresPriceAccumulation,
    readOnlyFields: ['originalPrice']
  };

  const {
    createdBy,
    updatedBy,
    createdAt,
    updatedAt
  } = fromForm(entityForm, 'metadata') || {};

  const infoProps = {
    isEdit,
    touched,
    loading,
    info: {
      createdBy,
      updatedBy,
      createdAt,
      updatedAt
    }
  };

  const tagsProps = {
    formRef,
    onUpdateTags,
    disabled,
    tags,
    loading,
    canDelete: canUpdate,
    canCreate: canUpdate,
    canUpdate,
    header: t(intl, 'campaigns.tags')
  };

  const translateProps = {
    formRef,
    loading,
    disabled,
    translateMessages
  };

  const subTitle = (
      <>
        <FundOutlined style={{ marginRight: 10 }}/>
        {isEdit ?
            t(intl, 'campaigns.actions.edit') :
            t(intl, 'campaigns.actions.addNew')
        }
      </>
  );

  const gutter = { xs: 8, sm: 16, md: 18, lg: 24 };

  const onChangeFormProps = {
    touched,
    loading,
    spinOn: [
      `${MODEL_NAME}/validateCampaign`,
      `${MODEL_NAME}/campaignSubscriptions`,
      `${MODEL_NAME}/editCampaign`,
      `${MODEL_NAME}/getSimpleEntity`,
      `${MODEL_NAME}/cleanForm`
    ],
    entityForm,
    onFinish(formValues) {
      canUpdate && onSave(formValues, params);
    },
    onFieldsChange
  };

  const pageHeaderProps = {
    subTitle,
    loading,
    disabled,
    MODEL_NAME,
    isEdit,
    component,
    actions: {
      exportBtn: false,
      newBtn: false,
      closeBtn: { onClose },
      saveBtn: { ableFor, touched, formRef },
      menuBtn: {
        selectedEntity: selectedCampaign,
        label: t(intl, 'campaigns.actions.manage'),
        menuProps: {
          ...metaProps,
          isEdit,
          params,
          intl,
          onDeleteCampaign
        },
        dropDownMenu: campaignMenu,
        testId: `${testId}.menuBtn`
      }
    }
  };

  return (
      <Page className={userStyles.users}
            component={component}
            ableFor={ableFor}
            touched={!disabled && touched}
            spinEffects={[
              `${MODEL_NAME}/validateCampaign`,
              `${MODEL_NAME}/campaignSubscriptions`,
              `${MODEL_NAME}/editCampaign`,
              `${MODEL_NAME}/getSimpleEntity`,
              `${MODEL_NAME}/cleanForm`,
              `${MODEL_NAME}/handleUpdate`,
              `${MODEL_NAME}/handleSave`,
              `${MODEL_NAME}/prepareToSave`
            ]}>
        <div className={styles.campaignWrapper}>
          <SubHeader {...pageHeaderProps}/>
          <Form {...formProps(onChangeFormProps)}
                form={formRef}
                initialValues={{
                  helper: true,
                  trialed: false,
                  selectedByDefault: true,
                  defaultState: true,
                  ...DEFAULT_PRICE_VALUES(currencies[0], false, {
                    originalPrice: featuresPriceAccumulation
                  }),
                  trialPeriod: {
                    ...DEFAULT_PRICE_VALUES(currencies[0], false),
                    duration: {
                      type: 'Week',
                      period: 1
                    }
                  },
                  featureType: featureTypes[0],
                  translateKeys: {
                    title: '',
                    description: ''
                  }
                }}>
            <CampaignInfo {...campaignInfoProps} />
            <SchedulersList data={schedulers[schedulerTypes.sale]} {...metaProps}
                            prefix={schedulerTypes.sale}
                            formRef={formRef}
                            entityType={t(intl, 'subscription.saleAt')}
                            onDeleteScheduler={onDeleteScheduler}
                            onOpenSiderPanel={(visible, entityForm = {}) => {
                              updateSchedulerPanel({
                                ...panelProps,
                                ...entityForm,
                                prefix: schedulerTypes.sale,
                                entityType: t(intl, 'subscription.saleAt'),
                                onHandleScheduler,
                                durationTypes
                              }, visible);
                            }}/>
            <Row gutter={gutter} className={styles.stretched}>
              <Col {...layout.halfColumn}>
                <CampaignDiscount {...discountProps} />
              </Col>
              {isTrialed && (
                  <Col {...layout.halfColumn}>
                    <CampaignTrial {...discountProps} />
                  </Col>
              )}
            </Row>
            <Common.Translate {...translateProps} />
            <Common.Tags {...tagsProps} />
            <Info {...infoProps} />
          </Form>
        </div>
      </Page>
  );
};
