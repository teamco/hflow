import React, { useEffect } from 'react';
import { DownOutlined, SettingOutlined, TrademarkOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, PageHeader } from 'antd';

import SaveButton from 'components/Buttons/save.button';

import Main from 'components/Main';
import Page from 'components/Page';

import { SubscriptionInfo } from 'pages/subscriptions/[subscription]/form/subscription.info';
import { SubscriptionTags } from 'pages/subscriptions/[subscription]/form/subscription.tags';
import SubscriptionMenu from 'pages/subscriptions/metadata/subscriptions.menu';

import { isNew } from 'services/common.service';
import { useParams } from 'umi';

import { fromForm } from 'utils/object';
import { isLoading } from 'utils/state';

import menuStyles from 'components/menu.less';
import styles from 'pages/subscriptions/subscriptions.module.less';
import userStyles from 'pages/users/users.module.less';

const { Info } = Main;

export const subscriptionEdit = (props) => {
  const [formRef] = Form.useForm();

  const {
    t,
    authModel,
    subscriptionModel,
    loading,
    onEditSubscription,
    onFieldsChange,
    onUpdateTags,
    onSave,
    onClose,
    onDeleteSubscription
  } = props;

  /**
   * @type {{subscription}}
   */
  const params = useParams();

  const {
    entityForm,
    selectedSubscription,
    subscriptionTypes,
    businessUsers,
    tags,
    isEdit,
    touched
  } = subscriptionModel;

  const { ability } = authModel;
  const component = 'subscriptions';
  const disabled = ability.cannot('update', component);
  const update = ability.can('update', component);

  useEffect(() => {
    if (update) {
      onEditSubscription(params);
    } else if (isNew(params.subscription)) {
      onEditSubscription(params);
    }
  }, [authModel.user, update]);

  /**
   * @constant
   * @param formValues
   */
  const onFinish = formValues => {
    onSave(formValues, params);
  };

  const subscriptionInfoProps = {
    t,
    formRef,
    disabled,
    subscriptionTypes,
    businessUsers
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
    isEdit,
    loading,
    params,
    onDeleteSubscription
  };

  const subTitle = (
      <>
        <TrademarkOutlined style={{ marginRight: 10 }}/>
        {isEdit ?
            t('actions:edit', { type: t('menu:subscription') }) :
            t('actions:addNew', { type: t('menu:subscription') })
        }
      </>
  );

  return (
      <Page className={userStyles.users}
            component={component}
            touched={!disabled && touched}
            spinEffects={[
              'subscriptionModel/editSubscription',
              'subscriptionModel/subscriptionTypes',
              'subscriptionModel/prepareToSave'
            ]}>
        <div className={styles.subscriptionWrapper}>
          <PageHeader ghost={false}
                      subTitle={subTitle}
                      extra={[
                        <Button key={'close'}
                                size={'small'}
                                loading={isLoading(loading.effects['subscriptionModel/prepareToSave'])}
                                onClick={() => onClose()}>
                          {t('actions:close')}
                        </Button>,
                        <SaveButton key={'save'}
                                    isEdit={isEdit}
                                    disabled={!touched || disabled}
                                    formRef={formRef}
                                    loading={loading.effects['subscriptionModel/prepareToSave']}/>,
                        <Dropdown overlay={<SubscriptionMenu record={selectedSubscription} {...menuProps} />}
                                  disabled={!isEdit || disabled}
                                  trigger={['click']}
                                  overlayClassName={menuStyles.customActionMenu}
                                  key={'custom'}>
                          <Button size={'small'}
                                  icon={<SettingOutlined/>}
                                  className={menuStyles.customAction}>
                            {t('actions:manage', { type: t('menu:subscription') })} <DownOutlined/>
                          </Button>
                        </Dropdown>
                      ]}/>
          <Form layout={'vertical'}
                className={styles.form}
                form={formRef}
                fields={entityForm}
                scrollToFirstError={true}
                onFinish={onFinish}
                onFieldsChange={onFieldsChange}>
            <SubscriptionInfo {...subscriptionInfoProps} />
            <SubscriptionTags {...tagsProps} />
            <Info {...infoProps} />
          </Form>
        </div>
      </Page>
  );
};
