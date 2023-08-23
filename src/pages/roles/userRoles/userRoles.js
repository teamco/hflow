import React from 'react';
import { Form } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';

import Page from '@/components/Page/page.connect';
import FormComponents from '@/components/Form';
import Main from '@/components/Main';
import { SubHeader } from '@/components/Page/page.subheader';

import { fromForm } from '@/utils/object';
import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';
import { layout } from '@/utils/layout';
import { componentAbilities } from '@/utils/auth/component.setting';

import styles from '@/pages/roles/userRoles/userRoles.module.less';

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
    roleModel,
    authModel,
    loading,
    onQuery,
    onUpdateRoles,
    onSave
  } = props;

  const {
    userRoles,
    isEdit,
    entityForm,
    touched
  } = roleModel;

  const subTitle = (
      <>
        <PieChartOutlined style={{ marginRight: 10 }}/>
        {t(intl, 'panel.manageRoles')}
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

  const component = 'user.roles';

  const {
    ableFor,
    disabled,
    canUpdate,
    canDelete,
    canCreate,
    canRead
  } = componentAbilities(authModel, component, isEdit);

  effectHook(() => {
    (canUpdate || canRead) && onQuery();
  }, [canUpdate, canRead]);

  /**
   * @constant
   * @param formValues
   */
  const onFinish = formValues => {
    canUpdate && onSave(formValues);
  };

  const MODEL_NAME = 'roleModel';

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
      closeBtn: false,
      saveBtn: {
        ableFor,
        touched,
        formRef
      },
      menuBtn: false
    }
  };

  const handleChange = roles => {
    onUpdateRoles(roles.sort());
  }

  return (
      <Page spinEffects={[
        `${MODEL_NAME}/query`,
        `${MODEL_NAME}/save`
      ]}
            ableFor={ableFor}
            component={component}>
        <div className={styles.preparationWrapper}>
          <SubHeader {...pageHeaderProps}/>
          <Form layout={'vertical'}
                className={styles.form}
                form={formRef}
                fields={entityForm}
                onFinish={onFinish}>
            <GenericPanel header={t(intl, 'panel.userRoles')}
                          name={'userRoles'}
                          defaultActiveKey={['userRoles']}>
              <div colProps={layout.fullColumn}>
                <EditableTags name={'tags'}
                              formRef={formRef}
                              canDelete={canDelete}
                              canUpdate={canUpdate}
                              canCreate={canCreate}
                              disabled={disabled}
                              onChange={handleChange}
                              tags={[...(userRoles?.roles || [])].sort()}/>
              </div>
            </GenericPanel>
            <Info {...infoProps} />
          </Form>
        </div>
      </Page>
  );
};
