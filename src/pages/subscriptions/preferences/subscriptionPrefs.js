import React, { useEffect } from 'react';
import { Button, Form, PageHeader } from 'antd';
import { AppstoreAddOutlined, ControlOutlined } from '@ant-design/icons';

import Page from 'components/Page';
import SaveButton from 'components/Buttons/save.button';
import FormComponents from 'components/Form';
import Main from 'components/Main';

import { fromForm } from 'utils/object';
import { Can } from 'utils/auth/can';

import styles from 'pages/subscriptions/preferences/subscriptionPrefs.module.less';

const { GenericPanel, EditableTags } = FormComponents;
const { Info } = Main;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const subscriptionPrefs = props => {
  const [formRef] = Form.useForm();

  const {
    t,
    authModel,
    subscriptionPrefsModel,
    loading,
    onQuery,
    onSave,
    onNew
  } = props;

  const {
    isEdit,
    entityForm,
    touched
  } = subscriptionPrefsModel;

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
  const component = 'subscriptionPrefs';
  const disabled = ability.cannot('update', component);

  return (
      <Page touched={touched}
            component={component}
            spinEffects={[
              'subscriptionPrefsModel/query',
              'subscriptionPrefsModel/prepareToSave'
            ]}>
        <div className={styles.preferenceWrapper}>
          <PageHeader ghost={false}
                      subTitle={subTitle}
                      extra={[
                        <Can I={'create'} a={component} key={'add'}>
                          <Button size={'small'}
                                  loading={loading.effects['subscriptionPrefsModel/newPreference']}
                                  disabled={disabled}
                                  icon={<AppstoreAddOutlined/>}
                                  onClick={() => onNew()}
                                  type={'primary'}>
                            {t('actions:new')}
                          </Button>
                        </Can>
                      ]}>
          </PageHeader>
          <Form layout={'vertical'}
                className={styles.form}
                form={formRef}
                fields={entityForm}
                onFinish={onFinish}>
            <GenericPanel header={t('panel:subscriptionPrefs')}
                          name={'subscriptionPrefs'}
                          defaultActiveKey={['subscriptionPrefs']}>

            </GenericPanel>
            <Info {...infoProps} />
          </Form>
        </div>
      </Page>
  );
};
