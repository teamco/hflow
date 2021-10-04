import React, { useEffect } from 'react';
import { Form, PageHeader } from 'antd';
import {
  PieChartOutlined
} from '@ant-design/icons';

import Page from 'components/Page';
import SaveButton from 'components/Buttons/save.button';
import FormComponents from 'components/Form';
import Main from 'components/Main';

import { fromForm } from 'utils/object';

import styles from 'pages/userRoles/userRoles.module.less';

const { GenericPanel, EditableTags } = FormComponents;
const { Info } = Main;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const userRoles = props => {
  const [formRef] = Form.useForm();

  const {
    t,
    userRolesModel,
    authModel,
    loading,
    onQuery,
    onUpdateUserRoles,
    onUpdateBusinessRoles,
    onSave
  } = props;

  const {
    userRoles,
    businessRoles,
    isEdit,
    entityForm
  } = userRolesModel;

  useEffect(() => {
    onQuery();
  }, [authModel.user]);

  /**
   * @constant
   * @param formValues
   */
  const onFinish = formValues => {
    onSave(formValues);
  };

  const subTitle = (
    <>
      <PieChartOutlined style={{ marginRight: 10 }} />
      {t('panel:manageRoles')}
    </>
  );

  const {
    createdBy,
    updatedBy,
    createdAt,
    updatedAt
  } = fromForm(entityForm, 'metadata') || {};

  const infoProps = {
    t,
    isEdit,
    info: {
      createdBy,
      updatedBy,
      createdAt,
      updatedAt
    }
  };

  const { ability } = authModel;
  const component = 'roles';
  const disabled = ability.cannot('update', component);

  return (
    <Page spinEffects={['userRolesModel/query']}
          component={component}>
      <div className={styles.preparationWrapper}>
        <PageHeader ghost={false}
                    subTitle={subTitle}
                    extra={[
                      <SaveButton key={'save'}
                                  isEdit={isEdit}
                                  disabled={disabled}
                                  formRef={formRef}
                                  loading={loading.effects['userRolesModel/prepareToSave']} />
                    ]}>
        </PageHeader>
        <Form layout={'vertical'}
              className={styles.form}
              form={formRef}
              fields={entityForm}
              onFinish={onFinish}>
          <GenericPanel header={t('panel:userRoles')}
                        name={'userRoles'}
                        defaultActiveKey={['userRoles']}>
            <div>
              <EditableTags label={false}
                            name={'tags'}
                            disabled={disabled}
                            newTag={t('actions:new')}
                            onChange={onUpdateUserRoles}
                            tags={userRoles?.roles} />
            </div>
          </GenericPanel>
          <GenericPanel header={t('panel:businessRoles')}
                        name={'businessRoles'}
                        defaultActiveKey={['businessRoles']}>
            <div>
              <EditableTags label={false}
                            name={'tags'}
                            disabled={disabled}
                            newTag={t('actions:new')}
                            onChange={onUpdateBusinessRoles}
                            tags={businessRoles?.roles} />
            </div>
          </GenericPanel>
          <Info {...infoProps} />
        </Form>
      </div>
    </Page>
  );
};
