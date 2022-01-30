import React from 'react';

import FormComponents from '@/components/Form';

const { GenericPanel, EditableTags } = FormComponents;

/**
 * @export
 * @param t
 * @param formRef
 * @param tags
 * @param {boolean} disabled
 * @param onUpdateTags
 * @return {JSX.Element}
 * @constructor
 */
export const BusinessTags = ({
  t,
  formRef,
  tags,
  disabled,
  onUpdateTags
}) => {
  return (
      <GenericPanel header={t('business:tags')}
                    name={'tags'}>
        <div>
          <EditableTags label={t('form:tags')}
                        name={'tags'}
                        disabled={disabled}
                        newTag={t('actions:new')}
                        onChange={onUpdateTags}
                        tags={tags}/>
        </div>
      </GenericPanel>
  );
};
