import React from 'react';
import { Affix } from 'antd';

import { stub } from '@/utils/function';

import CloseButton from '@/components/Buttons/close.button';
import SaveButton from '@/components/Buttons/save.button';
import DropdownButton from '@/components/Buttons/dropdown.button';
import ExportButton from '@/components/Buttons/export.button';
import BasicButton from '@/components/Buttons/basic.button';

import styles from './page.module.less';

export const SubHeader = props => {
  const {
    subTitle,
    loading,
    MODEL_NAME,
    isEdit = false,
    disabled = false,
    component,
    actions: {
      closeBtn = { onClose: stub },
      exportBtn = {
        data: [],
        refTarget: null,
        disabled: true
      },
      newBtn = {
        onClick: stub,
        spinOn: []
      },
      saveBtn = {
        formRef: null,
        spinOn: [],
        touched: false,
        ableFor: null,
        onClick: stub,
        title: false
      },
      menuBtn = {
        label: '',
        selectedEntity: null,
        menuProps: {},
        dropDownMenu: stub,
        testId: null
      },
      extra = []
    },
    offsetTop = 48,
    isFixed = true

  } = props;

  const closeButton = closeBtn ? (
      <CloseButton key={`${component}.close`}
                   loading={loading}
                   disabled={disabled}
                   modelName={MODEL_NAME}
                   onClick={closeBtn.onClose}/>
  ) : null;

  const exportButton = exportBtn ? (
      <ExportButton key={`${component}.export`}
                    disabled={exportBtn.disabled}
                    component={component}
                    loading={loading}
                    refTarget={exportBtn.refTarget}
                    modelName={MODEL_NAME}
                    json={exportBtn.data}/>
  ) : null;

  const newButton = newBtn ? (
      <BasicButton key={`${component}.next`}
                   loading={loading}
                   component={component}
                   spinOn={[...(newBtn.spinOn ?? [])]}
                   onClick={newBtn.onClick}
                   modelName={MODEL_NAME}/>
  ) : null;

  const saveButton = saveBtn ? (
      <SaveButton key={`${component}.save`}
                  isEdit={isEdit}
                  component={component}
                  canType={saveBtn.ableFor}
                  modelName={MODEL_NAME}
                  disabled={!saveBtn.touched || disabled}
                  title={saveBtn.title}
                  spinOn={[
                    `${MODEL_NAME}/prepareToSave`,
                    ...saveBtn?.spinOn ?? []
                  ]}
                  onClick={saveBtn.onClick}
                  formRef={saveBtn.formRef}
                  loading={loading}/>
  ) : null;

  const menuButton = menuBtn?.selectedEntity ? (
      <DropdownButton key={`${component}.manage`}
                      overlay={menuBtn.dropDownMenu({ record: menuBtn.selectedEntity, ...menuBtn.menuProps })}
                      data-testid={menuBtn.testId}
                      disabled={!isEdit || disabled}
                      spinOn={[...menuBtn?.spinOn ?? []]}
                      loading={loading}
                      label={menuBtn.label}/>
  ) : null;

  const actionBtns = [
    ...extra,
    exportButton,
    newButton,
    closeButton,
    saveButton,
    menuButton
  ];

  const buttons = actionBtns.map((Btn, idx) => Btn);

  const header = (
      <div className={styles.subTitle}>
        <div className={styles.title}>{subTitle}</div>
        <div className={styles.extra}>{buttons}</div>
      </div>
  );

  return isFixed ? (
      <Affix offsetTop={offsetTop}>
        {header}
      </Affix>
  ) : header;
};