import React from 'react';

import FormComponents from '@/components/Form';
import { stub } from '@/utils/function';
import { withTranslation } from 'react-i18next';

const { GenericPanel, EditableTags } = FormComponents;

/**
 * @export
 * @param t
 * @param formRef
 * @param [tags]
 * @param {string} header
 * @param {boolean} disabled
 * @param {function} [onUpdateTags]
 * @return {JSX.Element}
 * @constructor
 */
const CommonTags = ({
  t,
  formRef,
  tags = [],
  disabled,
  onUpdateTags = stub(),
  name = 'tags',
  defaultActiveKey = null,
  ...rest
}) => {

  const { header = t('form:tags') } = rest;

  return (
      <GenericPanel header={header}
                    data-testid={'common-tags'}
                    name={name}
                    defaultActiveKey={defaultActiveKey}>
        <div>
          <EditableTags label={t('form:tags')}
                        name={'tags'}
                        form={formRef}
                        disabled={disabled}
                        newTag={t('actions:new')}
                        onChange={onUpdateTags}
                        tags={tags}/>
        </div>
      </GenericPanel>
  );
};

export default withTranslation()(CommonTags);
