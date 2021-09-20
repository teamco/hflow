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

import { fromForm } from 'utils/object';

import styles from 'pages/userRoles/user.roles.module.less';

const { GenericPanel, EditableTags } = FormComponents;
const { Info } = Main;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
const userRoles = props => {
  const [formRef] = Form.useForm();

  const {
    t,
    userRolesModel,
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
  const component = 'userRoles';
  const disabled = !ability.can('update', component);

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
  ({ authModel, userRolesModel, loading }) => {
    return {
      loading,
      authModel,
      userRolesModel
    };
  },
  (dispatch) => ({
    dispatch,
    onQuery() {
      dispatch({ type: `userRolesModel/query` });
    },
    onFieldsChange(changedFields, allFields) {
      dispatch({
        type: 'userRolesModel/updateFields',
        payload: {
          changedFields,
          allFields,
          model: 'userRolesModel'
        }
      });
    },
    onSave(payload) {
      dispatch({
        type: 'userRolesModel/prepareToSave',
        payload
      });
    },
    onUpdateTags(tags) {
      dispatch({
        type: 'userRolesModel/updateTags',
        payload: { tags }
      });
    }
  })
)(withTranslation()(userRoles));
