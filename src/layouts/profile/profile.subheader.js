import React from 'react';
import classnames from 'classnames';
import { useIntl } from '@umijs/max';
import { Affix, Layout, Spin } from 'antd';
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';

import { t } from '@/utils/i18n';
import { Can } from '@/utils/auth/can';

import SaveButton from '@/components/Buttons/save.button';
import ReloadButton from '@/components/Buttons/reload.button';
import BasicButton from '@/components/Buttons/basic.button';

import styles from '@/pages/landing/landing.module.less';

const { Header } = Layout;

const MODEL_NAME = 'profileModel';

const ProfileSubheader = props => {
  const {
    component = 'profile',
    fixed = true,
    offsetTop = 48,
    model,
    ableFor,
    disabled,
    loading
  } = props;

  const intl = useIntl();

  const {
    label,
    actionBtns
  } = model;

  const {
    reload,
    save,
    addNew,
    navigation,
    assignedModel
  } = actionBtns;

  let touched = assignedModel?.touched;
  let isEdit = assignedModel?.isEdit;

  if (typeof assignedModel === 'undefined') {
    touched = model?.touched;
    isEdit = model?.isEdit;
  }

  const _header = (
      <Can I={'manage'} a={component}>
        <Header className={classnames(styles.header, styles.headerSection)}
                style={{ justifyContent: 'space-between' }}>
          <div className={styles.headerLabel}>
            {label ? t(intl, label) : (<Spin spinning={true}/>)}
          </div>
          <div className={styles.headerActions}>
            {reload ? (
                <ReloadButton key={`${component}.reload`}
                              component={component}
                              disabled={disabled}
                              spinOn={[...(save?.spinOn || [])]}
                              onClick={reload.onClick}
                              loading={loading}/>
            ) : null}
            {addNew ? (
                <BasicButton key={`${component}.add`}
                             loading={loading}
                             url={'/profile/apartments/new'}
                             component={component}
                             spinOn={[...(addNew.spinOn ?? [])]}
                             onClick={addNew.onClick}
                             modelName={MODEL_NAME}/>
            ) : null}
            {navigation ? (
                <div key={`${component}.route`} className={classnames(styles.groupButtons, navigation.className)}>
                  <BasicButton key={`${component}.next`}
                               loading={loading}
                               icon={typeof navigation.prev.icon === 'undefined' ?
                                   (<CaretLeftOutlined/>) :
                                   navigation.prev.icon
                               }
                               url={null}
                               disabled={disabled || navigation.prev.disabled}
                               title={navigation.prev.title}
                               component={component}
                               spinOn={[...(navigation.prev.spinOn ?? [])]}
                               onClick={e => {
                                 e.preventDefault();
                                 e.stopPropagation();
                                 navigation.prev.onClick(navigation.prev.direction ?? -1);
                               }}
                               modelName={MODEL_NAME}/>
                  <BasicButton key={`${component}.prev`}
                               loading={loading}
                               icon={typeof navigation.next.icon === 'undefined' ?
                                   (<CaretRightOutlined/>) :
                                   navigation.next.icon
                               }
                               url={null}
                               disabled={disabled || navigation.next.disabled}
                               title={navigation.next.title}
                               component={component}
                               spinOn={[...(navigation.next.spinOn ?? [])]}
                               onClick={e => {
                                 e.preventDefault();
                                 e.stopPropagation();
                                 navigation.next.onClick(navigation.next.direction ?? 1);
                               }}
                               modelName={MODEL_NAME}/>
                </div>
            ) : null}
            {save ? (
                <SaveButton key={`${component}.save`}
                            isEdit={isEdit}
                            component={component}
                            canType={ableFor}
                            modelName={MODEL_NAME}
                            disabled={!touched || disabled || save.disabled}
                            spinOn={[...(save?.spinOn || [])]}
                            onClick={save.onClick}
                            loading={loading}/>
            ) : null}
          </div>
        </Header>
      </Can>
  );

  return fixed ? (
      <Affix offsetTop={offsetTop}>
        {_header}
      </Affix>
  ) : _header;
};

export default ProfileSubheader;
