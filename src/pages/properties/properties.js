import React, { useRef } from 'react';
import { HomeOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';

import Page from '@/components/Page/page.connect';
import Main from '@/components/Main';
import { SubHeader } from '@/components/Page/page.subheader';

import { effectHook } from '@/utils/hooks';
import { t } from '@/utils/i18n';
import { componentAbilities } from '@/utils/auth/component.setting';

import { metadata } from '@/pages/properties/properties.metadata';

import styles from '@/pages/properties/properties.module.less';
import userStyles from '@/pages/users/users.module.less';

const { Table } = Main;

const MODEL_NAME = 'apartmentModel';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 */
export const properties = (props) => {
  const intl = useIntl();

  const {
    authModel,
    propertyModel,
    onQuery,
    onNew,
    onDeleteProperty,
    style,
    loading
  } = props;

  const {
    campaigns: data
  } = propertyModel;

  effectHook(() => {
    authModel.user && onQuery();
  }, [authModel.user]);

  const component = 'properties';
  const {
    ability,
    disabled,
    canUpdate,
    canDelete,
    canCreate,
    canExport
  } = componentAbilities(authModel, component, true);

  const refTarget = useRef(null);

  const subTitle = (
      <>
        <HomeOutlined style={{ marginRight: 10 }}/>
        {t(intl, 'menu.properties')}
      </>
  );

  const propertyProps = {
    loading,
    ability,
    disabled,
    onDeleteProperty
  };

  const tableProps = {
    pagination: false
  };

  const pageHeaderProps = {
    subTitle,
    loading,
    disabled,
    MODEL_NAME,
    component,
    actions: {
      exportBtn: { refTarget, data, disabled: !canExport },
      newBtn: { onClick: onNew, spinOn: [`${MODEL_NAME}/newProperty`] },
      closeBtn: false,
      saveBtn: false,
      menuBtn: false
    }
  };

  return (
      <Page className={userStyles.users}
            component={component}
            spinEffects={[`${MODEL_NAME}/query`]}>
        <div className={styles.propertyWrapper}
             style={style}>
          <SubHeader {...pageHeaderProps}/>
          <div ref={refTarget}>
            <Table data={data}
                   {...tableProps}
                   {...metadata({ ...propertyProps })} />
          </div>
        </div>
      </Page>
  );
};
