import React from 'react';
import { useIntl } from '@umijs/max';
import FormComponents from '@/components/Form';
import { t } from '@/utils/i18n';

const { GenericPanel, EditableTags } = FormComponents;

/**
 * @export
 * @param formRef
 * @param tags
 * @param {boolean} disabled
 * @param onUpdateTags
 * @return {JSX.Element}
 * @constructor
 */
export const BusinessTags = (props) => {
  const intl = useIntl();

  const {
    formRef,
    tags,
    disabled,
    canDelete,
    canUpdate,
    canCreate,
    onUpdateTags
  } = props;

  return (
      <GenericPanel header={t(intl, 'business.tags')}
                    name={'tags'}>
        <div>
          <EditableTags label={t(intl, 'form.tags')}
                        name={'tags'}
                        formRef={formRef}
                        canDelete={canDelete}
                        canUpdate={canUpdate}
                        canCreate={canCreate}
                        disabled={disabled}
                        onChange={onUpdateTags}
                        tags={tags}/>
        </div>
      </GenericPanel>
  );
};
