import React, { useEffect, useState } from 'react';
import { DownOutlined, SettingOutlined, TrademarkOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, PageHeader } from 'antd';

import SaveButton from 'components/Buttons/save.button';

import Main from 'components/Main';
import Page from 'components/Page';

import { useParams } from 'umi';

import { fromForm } from 'utils/object';
import { isLoading } from 'utils/state';

import { PreferenceInfo } from './form/preference.info';
import { PreferenceTranslate } from './form/preference.translate';
import { PreferenceMenu } from 'pages/subscriptions/preferences/metadata/preference.menu';
import { PreferenceTags } from './form/preference.tags';

import menuStyles from 'components/menu.less';
import styles from 'pages/subscriptions/preferences/subscriptionPrefs.module.less';
import userStyles from 'pages/users/users.module.less';

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
    subscriptionPrefsModel,
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
    preferenceTypes,
    currencies,
    tags,
    isEdit,
    touched
  } = subscriptionPrefsModel;

  const { ability } = authModel;
  const component = 'subscriptions';
  const disabled = ability.cannot('update', component);
  const canUpdate = ability.can('update', component);

  const [disabledDescription, setDisabledDescription] = useState(false);

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

  const prefsProps = {
    t,
    formRef,
    disabled,
    preferenceTypes,
    currencies,
    setDisabledDescription
  }

  const translateProps = {
    t,
    formRef,
    disabled,
    disabledDescription
  }

  const infoProps = {
    t,
    isEdit,
    touched,
    formRef,
    disabled,
    info: {
      createdBy,
      updatedBy,
      createdAt,
      updatedAt
    }
  };

  const menuProps = {
    t,
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
            t('actions:edit', { type: t('menu:preference') }) :
            t('actions:addNew', { type: t('menu:preference') })
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
                            {t('actions:manage', { type: t('menu:preference') })} <DownOutlined/>
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
                  helper: true,
                  defaultState: true,
                  currency: currencies[0],
                  preferenceType: preferenceTypes[0],
                  translate: {
                    on: 'actions:yes',
                    off: 'actions:no'
                  }
                }}>
            <PreferenceInfo {...prefsProps} />
            <PreferenceTranslate {...translateProps} />
            <PreferenceTags {...tagsProps} />
            <Info {...infoProps} />
          </Form>
        </div>
      </Page>
  );
};
