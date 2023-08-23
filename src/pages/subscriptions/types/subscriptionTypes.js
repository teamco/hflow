import React, { useRef } from 'react';
import { Form } from 'antd';
import { FontSizeOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';

import Page from '@/components/Page/page.connect';
import FormComponents from '@/components/Form';
import Main from '@/components/Main';
import { SubHeader } from '@/components/Page/page.subheader';

import { effectHook } from '@/utils/hooks';
import { fromForm } from '@/utils/object';
import { t } from '@/utils/i18n';
import { componentAbilities } from '@/utils/auth/component.setting';

import styles from '@/pages/subscriptions/types/subscriptionTypes.module.less';

const { GenericPanel, EditableTags } = FormComponents;
const { Info } = Main;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const subscriptionTypes = props => {
  const intl = useIntl();
  const [formRef] = Form.useForm();

  const {
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

  const subTitle = (
      <>
        <FontSizeOutlined style={{ marginRight: 10 }}/>
        {t(intl, 'panel.subscriptionConfig')}
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

  const component = 'subscription.types';
  const {
    ableFor,
    disabled,
    canUpdate,
    canCreate,
    canRead,
    canDelete,
    canExport
  } = componentAbilities(authModel, component, true);

  effectHook(() => {
    (canUpdate || canRead) && onQuery();
  }, [canUpdate, canRead]);

  /**
   * @constant
   */
  const onFinish = () => {
    canUpdate && onSave();
  };

  const MODEL_NAME = 'simpleModel';
  const refTarget = useRef(null);

  const pageHeaderProps = {
    subTitle,
    loading,
    disabled,
    MODEL_NAME,
    component,
    actions: {
      closeBtn: false,
      menuBtn: false,
      newBtn: false,
      saveBtn: { ableFor, touched, formRef },
      exportBtn: { refTarget, tags, disabled: !canExport }
    }
  };

  return (
      <Page spinEffects={[`${MODEL_NAME}/query`]}
            touched={touched}
            ableFor={ableFor}
            component={component}>
        <div className={styles.preparationWrapper}>
          <SubHeader {...pageHeaderProps}/>
          <div ref={refTarget}>
            <Form layout={'vertical'}
                  className={styles.form}
                  form={formRef}
                  fields={entityForm}
                  onFinish={onFinish}>
              <GenericPanel header={t(intl, 'panel.subscriptionTypes')}
                            name={'subscriptionTypes'}
                            defaultActiveKey={['subscriptionTypes']}>
                <div>
                  <EditableTags name={'tags'}
                                formRef={formRef}
                                canDelete={canDelete}
                                canUpdate={canUpdate}
                                canCreate={canCreate}
                                disabled={disabled}
                                onChange={onUpdateTags}
                                tags={tags}/>
                </div>
              </GenericPanel>
              <Info {...infoProps} />
            </Form>
          </div>
        </div>
      </Page>
  );
};
