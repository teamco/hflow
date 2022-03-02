import React  from 'react';
import { Form, PageHeader } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import Page from '@/components/Page';
import SaveButton from '@/components/Buttons/save.button';
import FormComponents from '@/components/Form';
import Main from '@/components/Main';

import { fromForm } from '@/utils/object';

import styles from 'pages/userRoles/userRoles.module.less';
import { effectHook } from '@/utils/hooks';

const { GenericPanel, EditableTags } = FormComponents;
const { Info } = Main;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const userRoles = props => {
  const [formRef] = Form.useForm();
  const intl = useIntl();
  const {
    userRoleModel,
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
    entityForm,
    touched
  } = userRoleModel;

  effectHook(() => {
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
        <PieChartOutlined style={{ marginRight: 10 }}/>
        {intl.formatMessage({id: 'panel.manageRoles', defaultMessage: 'Roles'})}
      </>
  );

  const {
    createdBy,
    updatedBy,
    createdAt,
    updatedAt
  } = fromForm(entityForm, 'metadata') || {};

  const infoProps = {
    isEdit,
    touched,
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
      <Page spinEffects={['userRoleModel/query']}
            component={component}>
        <div className={styles.preparationWrapper}>
          <PageHeader ghost={false}
                      subTitle={subTitle}
                      extra={[
                        <SaveButton key={'save'}
                                    isEdit={isEdit}
                                    disabled={disabled || !touched}
                                    formRef={formRef}
                                    loading={loading.effects['userRoleModel/prepareToSave']}/>
                      ]}>
          </PageHeader>
          <Form layout={'vertical'}
                className={styles.form}
                form={formRef}
                fields={entityForm}
                onFinish={onFinish}>
            <GenericPanel header={intl.formatMessage({id: 'panel.userRoles', defaultMessage: 'User Roles'})}
                          name={'userRoles'}
                          defaultActiveKey={['userRoles']}>
              <div>
                <EditableTags label={false}
                              name={'tags'}
                              disabled={disabled}
                              newTag={intl.formatMessage({id: 'actions.new', defaultMessage: 'New'})}
                              onChange={onUpdateUserRoles}
                              tags={userRoles?.roles}/>
              </div>
            </GenericPanel>
            <GenericPanel header={intl.formatMessage({id: 'panel.businessRoles', defaultMessage: 'Business Roles'})}
                          name={'businessRoles'}
                          defaultActiveKey={['businessRoles']}>
              <div>
                <EditableTags label={false}
                              name={'tags'}
                              disabled={disabled}
                              newTag={intl.formatMessage({id: 'actions.new', defaultMessage: 'New'})}
                              onChange={onUpdateBusinessRoles}
                              tags={businessRoles?.roles}/>
              </div>
            </GenericPanel>
            <Info {...infoProps} />
          </Form>
        </div>
      </Page>
  );
};
