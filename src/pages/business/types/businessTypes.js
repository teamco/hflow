import React  from 'react';
import { Form, PageHeader } from 'antd';
import { FontSizeOutlined } from '@ant-design/icons';

import Page from 'components/Page';
import SaveButton from 'components/Buttons/save.button';
import FormComponents from 'components/Form';
import Main from 'components/Main';

import { fromForm } from 'utils/object';
import { Can } from 'utils/auth/can';

import styles from 'pages/business/types/businessTypes.module.less';
import ExportButton from '@/components/Buttons/export.button';
import { effectHook } from '@/utils/hooks';

const { GenericPanel, EditableTags } = FormComponents;
const { Info } = Main;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const businessTypes = props => {
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

  effectHook(() => {
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
        <FontSizeOutlined style={{ marginRight: 10 }}/>
        {t('panel:businessConfig')}
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
  const component = 'businessTypes';
  const disabled = ability.cannot('update', component);

  return (
      <Page spinEffects={['simpleModel/query']}
            touched={touched}
            component={component}>
        <div className={styles.preparationWrapper}>
          <PageHeader ghost={false}
                      subTitle={subTitle}
                      extra={[
                        <ExportButton key={'export'}
                                      disabled={disabled}
                                      component={component}
                                      json={tags}/>,
                        <Can I={'create'} a={component} key={'add'}>
                          <SaveButton key={'save'}
                                      isEdit={isEdit}
                                      disabled={disabled || !touched}
                                      formRef={formRef}
                                      loading={loading.effects['simpleModel/prepareToSave']}/>
                        </Can>
                      ]}>
          </PageHeader>
          <Form layout={'vertical'}
                className={styles.form}
                form={formRef}
                fields={entityForm}
                onFinish={onFinish}>
            <GenericPanel header={t('panel:businessTypes')}
                          name={'businessTypes'}
                          defaultActiveKey={['businessTypes']}>
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
