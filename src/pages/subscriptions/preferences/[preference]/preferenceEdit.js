import React, { useEffect } from 'react';
import { DownOutlined, SettingOutlined, TrademarkOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, PageHeader } from 'antd';

import SaveButton from 'components/Buttons/save.button';

import Main from 'components/Main';
import Page from 'components/Page';

import { useParams } from 'umi';

import { fromForm } from 'utils/object';
import { isLoading } from 'utils/state';

import { PreferenceTags } from './form/preference.tags';
import { PreferenceMenu } from 'pages/subscriptions/preferences/metadata/preference.menu';

import menuStyles from 'components/menu.less';
import styles from 'pages/subscriptions/preferences/subscriptionPrefs.module.less';
import userStyles from 'pages/users/users.module.less';
import { PreferenceInfo } from './form/preference.info';

const { Info } = Main;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const preferenceEdit = (props) => {
  const [formRef] = Form.useForm();

  const {
    t,
    authModel,
    subscriptionModel,
    loading,
    onEditPreference,
    onFieldsChange,
    onUpdateTags,
    onSave,
    onClose,
    onDeletePreference
  } = props;

  /**
   * @type {{subscription}}
   */
  const params = useParams();

  const {
    entityForm,
    selectedPreference,
    subscriptionTypes,
    subscriptionPeriod,
    discountTypes,
    businessUsers,
    tags,
    isEdit,
    touched
  } = subscriptionModel;

  const { ability } = authModel;
  const component = 'subscriptions';
  const disabled = ability.cannot('update', component);
  const canUpdate = ability.can('update', component);

  useEffect(() => {
    canUpdate && onEditPreference(params);
  }, [authModel.user, canUpdate]);

  /**
   * @constant
   * @param formValues
   */
  const onFinish = formValues => {
    onSave(formValues, params);
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
    onDeletePreference
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
              'subscriptionPrefsModel/editPreference',
              'subscriptionPrefsModel/prepareToSave'
            ]}>
        <div className={styles.preferenceWrapper}>
          <PageHeader ghost={false}
                      subTitle={subTitle}
                      extra={[
                        <Button key={'close'}
                                size={'small'}
                                loading={isLoading(loading.effects['subscriptionPrefsModel/prepareToSave'])}
                                onClick={() => onClose()}>
                          {t('actions:close')}
                        </Button>,
                        <SaveButton key={'save'}
                                    isEdit={isEdit}
                                    disabled={!touched || disabled}
                                    formRef={formRef}
                                    loading={loading.effects['subscriptionPrefsModel/prepareToSave']}/>,
                        <Dropdown overlay={<PreferenceMenu record={selectedPreference} {...menuProps} />}
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
                onFieldsChange={onFieldsChange}
                initialValues={{}}>
            <PreferenceInfo {...infoProps} />
            <PreferenceTags {...tagsProps} />
            <Info {...infoProps} />
          </Form>
        </div>
      </Page>
  );
};
