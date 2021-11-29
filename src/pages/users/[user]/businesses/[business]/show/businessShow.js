import React, { useEffect } from 'react';
import Page from 'components/Page';
import userStyles from 'pages/users/users.module.less';
import { useParams } from 'umi';
import { Button, Form, PageHeader } from 'antd';
import { TrademarkOutlined } from '@ant-design/icons';

import Main from 'components/Main';

import { fromForm } from 'utils/object';
import { isNew } from 'services/common.service';

import styles from 'pages/users/[user]/businesses/businesses.module.less';

const { Info } = Main;

export const businessShow = (props) => {
  const [formRef] = Form.useForm();

  const {
    t,
    authModel,
    businessModel,
    loading,
    onEditBusiness,
    onClose
  } = props;

  /**
   * @type {{user, business}}
   */
  const params = useParams();

  const {
    entityForm,
    countries,
    businessTypes,
    states,
    selectedCountry,
    uploadedFiles,
    tags,
    isEdit,
    touched
  } = businessModel;

  const { ability } = authModel;
  const component = 'businesses';
  const disabled = ability.cannot('update', component);
  const update = ability.can('update', component);

  useEffect(() => {
    if (update) {
      onEditBusiness(params);
    } else if (isNew(params.business)) {
      onEditBusiness(params);
    }
  }, [
    authModel.user,
    update,
    params.user
  ]);

  const businessInfoProps = {
    t,
    formRef,
    disabled,
    businessTypes,
    uploadLogo: {
      field: 'logo',
      allowed: [
        'image/png',
        'image/jpeg'
      ],
      type: '*',
      ui: 'dragger',
      uploadedFiles
    }
  };

  const licenseProps = {
    t,
    formRef,
    disabled,
    uploadLicense: {
      field: 'license',
      allowed: [
        'application/pdf',
        'application/docx',
        'image/png',
        'image/jpeg'
      ],
      type: '*',
      ui: 'dragger',
      uploadedFiles
    }
  };

  const addressProps = {
    t,
    formRef,
    disabled,
    countries,
    states
  };

  const tagsProps = {
    t,
    formRef,
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
    params
  };

  const subTitle = (
      <>
        <TrademarkOutlined style={{ marginRight: 10 }}/>
        {isEdit ?
            t('actions:edit', { type: t('business') }) :
            t('actions:addNew', { type: t('business') })
        }
      </>
  );

  return (
      <Page className={userStyles.users}
            component={component}
            touched={!disabled && touched}
            spinEffects={[
              'businessModel/editBusiness'
            ]}>
        <div className={styles.businessWrapper}>
          <PageHeader ghost={false}
                      subTitle={subTitle}
                      extra={[
                        <Button key={'close'}
                                size={'small'}
                                onClick={() => onClose(params.user)}>
                          {t('actions:close')}
                        </Button>
                      ]}/>
        </div>
      </Page>
  );
};
