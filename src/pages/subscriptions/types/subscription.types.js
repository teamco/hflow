import React, { useEffect } from 'react';
import { Form, PageHeader } from 'antd';
import { ControlOutlined } from '@ant-design/icons';

import Page from 'components/Page';
import SaveButton from 'components/Buttons/save.button';
import FormComponents from 'components/Form';
import Main from 'components/Main';

import { fromForm } from 'utils/object';

import styles from 'pages/subscriptions/types/subscription.types.module.less';

const { GenericPanel, EditableTags } = FormComponents;
const { Info } = Main;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const subscriptionTypes = props => {
  const [formRef] = Form.useForm();

  const {
    t,
    simpleModel,
    authModel,
    loading,
    onQuery,
    onUpdateTags,
    onSave
  } = props;

  const {
    isEdit,
    entityForm,
    tags,
    touched
  } = simpleModel;

  useEffect(() => {
    onQuery();
  }, [authModel.user]);

  /**
   * @constant
   */
  const onFinish = () => {
    onSave();
  };

  const subTitle = (
      <>
        <ControlOutlined style={{ marginRight: 10 }}/>
        {t('panel:subscriptionConfig')}
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
    touched,
    info: {
      createdBy,
      updatedBy,
      createdAt,
      updatedAt
    }
  };

  const { ability } = authModel;
  const component = 'subscriptionTypes';
  const disabled = ability.cannot('update', component);

  return (
      <Page spinEffects={['simpleModel/query']}
            touched={touched}
            component={component}>
        <div className={styles.preparationWrapper}>
          <PageHeader ghost={false}
                      subTitle={subTitle}
                      extra={[
                        <SaveButton key={'save'}
                                    isEdit={isEdit}
                                    disabled={disabled || !touched}
                                    formRef={formRef}
                                    loading={loading.effects['simpleModel/prepareToSave']}/>
                      ]}>
          </PageHeader>
          <Form layout={'vertical'}
                className={styles.form}
                form={formRef}
                fields={entityForm}
                onFinish={onFinish}>
            <GenericPanel header={t('panel:subscriptionTypes')}
                          name={'subscriptionTypes'}
                          defaultActiveKey={['subscriptionTypes']}>
              <div>
                <EditableTags label={false}
                              name={'tags'}
                              disabled={disabled}
                              newTag={t('actions:new')}
                              onChange={onUpdateTags}
                              tags={tags}/>
              </div>
            </GenericPanel>
            <Info {...infoProps} />
          </Form>
        </div>
      </Page>
  );
};
