import React, {useEffect, useState} from 'react';
import Page from 'components/Page';
import userStyles from 'pages/users/users.module.less';
import {connect} from 'dva';
import {useParams, history, NavLink} from 'umi';
import {withTranslation} from 'react-i18next';
import {Button, Form, PageHeader, Menu, Dropdown} from 'antd';
import {
  TrademarkOutlined,
  DeleteOutlined,
  DownOutlined,
  FileDoneOutlined,
  PauseCircleOutlined,
  SettingOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';

import Main from 'components/Main';
import {BusinessAddress} from 'pages/users/[user]/businesses/[business]/form/business.address';
import {BusinessInfo} from 'pages/users/[user]/businesses/[business]/form/business.info';

import SaveButton from 'components/Buttons/save.button';

import styles from 'pages/users/[user]/businesses/businesses.module.less';
import {fromForm} from 'utils/object';
import {isLoading} from 'utils/state';

const {Info} = Main;

const businessEdit = (props) => {
  const [formRef] = Form.useForm();

  const {
    t,
    authModel,
    businessModel,
    loading,
    onEditBusiness,
    onFieldsChange,
    onUpdateTags,
    onSave,
    onClose,
    onGetBusinesses,
    onDeleteBusiness,
    onHoldBusiness,
    onActivateBusiness,
    onManageBusinessUsers,
    onFileRemove,
    onFileChange,
    onHandleStates
  } = props;

  /**
   * @type {{user, business}}
   */
  const params = useParams();

  const {
    entityForm,
    countries,
    states,
    selectedCountry,
    tags,
    fileList,
    fileName,
    fileType,
    previewUrl,
    isEdit
  } = businessModel;

  const {ability} = authModel;
  const component = 'businesses';
  const disabled = ability.cannot('update', component);

  const update = ability.can('update', component);

  useEffect(() => {
    if (update && (params.user === authModel.user.id)) {
      onEditBusiness(params);
    }
  }, [
    authModel.user,
    update
  ]);

  /**
   * @constant
   * @param formValues
   */
  const onFinish = formValues => {
    onSave(formValues, params);
  };

  const infoProps = {
    t,
    formRef,
    upload: {
      allowed: [
        'application/pdf',
        'application/docx',
        'image/png',
        'image/jpeg'
      ],
      type: '*',
      ui: 'dragger',
      fileName,
      fileType,
      fileList,
      previewUrl,
      onFileRemove,
      onFileChange
    }
  };

  const addressProps = {
    t,
    formRef,
    countries,
    states,
    onHandleStates
  };

  const businessProps = {
    t,
    formRef,
    onUpdateTags,
    tags
  };

  const {
    createdBy,
    updatedBy,
    createdAt,
    updatedAt
  } = fromForm(entityForm, 'metadata') || {};

  const detailProps = {
    t,
    isEdit,
    info: {
      createdBy,
      updatedBy,
      createdAt,
      updatedAt
    }
  };

  const subTitle = (
      <>
        <TrademarkOutlined style={{marginRight: 10}}/>
        {isEdit ?
            t('actions:edit', {type: t('business')}) :
            t('actions:addNew', {type: t('business')})
        }
      </>
  );

  const menu = (
      <Menu>
        <Menu.Item key={'users'}
                   loading={loading.effects['businessModel/manageBusinessUsers']}
                   disabled={!isEdit}
                   icon={<UsergroupAddOutlined/>}>
          <NavLink to={`/admin/users/${params.user}/businesses/${params.business}/users`}>
            {t('actions:manage', {type: t('auth:users')})}
          </NavLink>
        </Menu.Item>
        <Menu.Item key={'activate'}
                   loading={loading.effects['businessModel/activateBusiness']}
                   disabled={!isEdit}
                   icon={<FileDoneOutlined/>}
                   onClick={() => onActivateBusiness(params.business)}>
          {t('actions:activate')}
        </Menu.Item>
        <Menu.Item key={'hold'}
                   loading={loading.effects['businessModel/holdBusiness']}
                   disabled={!isEdit}
                   icon={<PauseCircleOutlined/>}
                   onClick={() => onHoldBusiness(params.business)}>
          {t('actions:hold')}
        </Menu.Item>
        <Menu.Item key={'delete'}
                   danger
                   loading={loading.effects['businessModel/prepareToSave']}
                   disabled={!isEdit}
                   icon={<DeleteOutlined/>}
                   onClick={() => onDeleteBusiness(params.business)}>
          {t('actions:delete')}
        </Menu.Item>
      </Menu>
  );

  return (
      <Page className={userStyles.users}
            component={component}
            spinEffects={[
              'businessModel/editBusiness',
              'businessModel/prepareToSave'
            ]}>
        <div className={styles.businessWrapper}>
          <PageHeader ghost={false}
                      subTitle={subTitle}
                      extra={[
                        <Button key={'close'}
                                size={'small'}
                                loading={isLoading(loading.effects['businessModel/prepareToSave'])}
                                onClick={() => onClose(params.user)}>
                          {t('actions:close')}
                        </Button>,
                        <SaveButton key={'save'}
                                    isEdit={isEdit}
                                    disabled={disabled}
                                    formRef={formRef}
                                    loading={
                                      loading.effects['businessModel/query'] ||
                                      loading.effects['businessModel/prepareToSave']
                                    }/>,
                        <Dropdown overlay={menu}
                                  disabled={!isEdit || disabled}
                                  overlayClassName={styles.customActionMenu}
                                  key={'custom'}>
                          <Button size={'small'}
                                  icon={<SettingOutlined/>}
                                  className={styles.customAction}>
                            {t('actions:manage', {type: t('business')})} <DownOutlined/>
                          </Button>
                        </Dropdown>
                      ]}/>
          <Form layout={'vertical'}
                className={styles.form}
                form={formRef}
                fields={entityForm}
                onFinish={onFinish}
                initialValues={{
                  country: selectedCountry
                }}
                onFieldsChange={onFieldsChange}>
            <BusinessInfo {...infoProps} />
            <BusinessAddress {...addressProps} />
            <Info {...detailProps} />
          </Form>
        </div>
      </Page>
  );
};

export default connect(
    ({
      authModel,
      businessServiceModel,
      businessPreparationModel,
      businessModel,
      dietaryModel,
      startersAndDessertsModel,
      loading
    }) => {
      return {
        authModel,
        businessServiceModel,
        businessPreparationModel,
        businessModel,
        dietaryModel,
        startersAndDessertsModel,
        loading
      };
    },
    (dispatch) => ({
      dispatch,
      onFieldsChange(changedFields, allFields) {
        dispatch({
          type: 'businessModel/updateFields',
          payload: {
            changedFields,
            allFields,
            model: 'businessModel'
          }
        });
      },
      onFileChange(payload) {
        dispatch({
          type: 'businessModel/handleAddFile',
          payload: {
            ...payload,
            model: 'businessModel'
          }
        });
      },
      onFileRemove(payload) {
        dispatch({
          type: 'businessModel/handleRemoveFile',
          payload: {
            ...payload,
            model: 'businessModel'
          }
        });
      },
      onDietaryQuery() {
        dispatch({type: 'dietaryModel/query'});
      },
      onStartersAndDessertsModelQuery() {
        dispatch({type: 'startersAndDessertsModel/query'});
      },
      onPreparationQuery() {
        dispatch({type: 'businessPreparationModel/query'});
      },
      onServiceQuery() {
        dispatch({type: 'businessServiceModel/query'});
      },
      onSave(payload, params) {
        dispatch({type: 'businessModel/prepareToSave', payload, params});
      },
      onClose(userId) {
        history.push(`/admin/users/${userId}/businesses`);
      },
      onUpdateTags(tags) {
        dispatch({type: 'businessModel/updateTags', payload: {tags}});
      },
      onEditBusiness(params) {
        dispatch({type: `userModel/validateUser`, payload: {userId: params.user}});
        dispatch({type: `businessModel/editBusiness`, payload: {params}});
      },
      onHandleStates(country) {
        dispatch({type: `businessModel/handleStates`, payload: {country}});
      }
    })
)(withTranslation()(businessEdit));
