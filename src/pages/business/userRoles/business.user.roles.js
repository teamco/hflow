import React, { useEffect } from 'react';
import { connect } from 'dva';
import { withTranslation } from 'react-i18next';
import { Form, PageHeader } from 'antd';
import {
  PieChartOutlined
} from '@ant-design/icons';

import Page from 'components/Page';
import SaveButton from 'components/Buttons/save.button';
import FormComponents from 'components/Form';
import Main from 'components/Main';
import styles from 'pages/business/userRoles/user.roles.module.less';
import { fromForm } from 'utils/object';

const { GenericPanel, EditableTags } = FormComponents;
const { Info } = Main;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
const businessUserRoles = props => {
  const [formRef] = Form.useForm();

  const {
    t,
    businessUserRolesModel,
    authModel,
    loading,
    onQuery,
    onFieldsChange,
    onUpdateTags,
    onSave
  } = props;

  const {
    tags,
    isEdit,
    entityForm
  } = businessUserRolesModel;

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
      {t('business:userRoles')}
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
  const component = 'businessUserRoles';
  const disabled = !ability.can('update', component);

  return (
    <Page spinEffects={['businessUserRolesModel/query']}
          component={component}>
      <div className={styles.preparationWrapper}>
        <PageHeader ghost={false}
                    subTitle={subTitle}
                    extra={[
                      <SaveButton key={'save'}
                                  isEdit={isEdit}
                                  disabled={disabled}
                                  formRef={formRef}
                                  loading={loading.effects['businessUserRolesModel/prepareToSave']} />
                    ]}>
        </PageHeader>
        <Form layout={'vertical'}
              className={styles.form}
              form={formRef}
              fields={entityForm}
              onFinish={onFinish}
              onFieldsChange={onFieldsChange}>
          <GenericPanel header={t('panel:userRoles')}
                        name={'userRoles'}
                        defaultActiveKey={['userRoles']}>
            <div>
              <EditableTags label={t('business:roles')}
                            name={'tags'}
                            disabled={disabled}
                            newTag={t('business:newRole')}
                            onChange={onUpdateTags}
                            tags={tags} />
            </div>
          </GenericPanel>
          <Info {...infoProps} />
        </Form>
      </div>
    </Page>
  );
};

export default connect(
  ({ authModel, businessUserRolesModel, loading }) => {
    return {
      loading,
      authModel,
      businessUserRolesModel
    };
  },
  (dispatch) => ({
    dispatch,
    onQuery() {
      dispatch({ type: `businessUserRolesModel/query` });
    },
    onFieldsChange(changedFields, allFields) {
      dispatch({
        type: 'businessUserRolesModel/updateFields',
        payload: {
          changedFields,
          allFields,
          model: 'businessUserRolesModel'
        }
      });
    },
    onSave(payload) {
      dispatch({
        type: 'businessUserRolesModel/prepareToSave',
        payload
      });
    },
    onUpdateTags(tags) {
      dispatch({
        type: 'businessUserRolesModel/updateTags',
        payload: { tags }
      });
    }
  })
)(withTranslation()(businessUserRoles));