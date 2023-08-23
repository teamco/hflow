import React, { useRef } from 'react';
import { Form } from 'antd';
import { FontSizeOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';

import Page from '@/components/Page/page.connect';
import FormComponents from '@/components/Form';
import Main from '@/components/Main';
import { SubHeader } from '@/components/Page/page.subheader';

import { fromForm } from '@/utils/object';
import { effectHook } from '@/utils/hooks';
import { componentAbilities } from '@/utils/auth/component.setting';
import { t } from '@/utils/i18n';
import { layout } from '@/utils/layout';

import styles from '@/pages/business/types/businessTypes.module.less';

const { GenericPanel, EditableTags } = FormComponents;
const { Info } = Main;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const businessTypes = props => {
  const [formRef] = Form.useForm();
  const intl = useIntl();

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
        {t(intl, 'panel.businessConfig')}
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

  const component = 'business.types';

  const {
    ableFor,
    disabled,
    canUpdate,
    canDelete,
    canCreate,
    canRead,
    canExport
  } = componentAbilities(authModel, component, isEdit);

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
              <GenericPanel header={t(intl, 'panel.businessTypes')}
                            name={'businessTypes'}
                            defaultActiveKey={['businessTypes']}>
                <div colProps={layout.fullColumn}>
                  <EditableTags name={'tags'}
                                formRef={formRef}
                                disabled={disabled}
                                canDelete={canDelete}
                                canUpdate={canUpdate}
                                canCreate={canCreate}
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
