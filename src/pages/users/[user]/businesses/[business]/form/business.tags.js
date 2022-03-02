import React from 'react';
import { useIntl } from 'umi';
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
  formRef,
  tags,
  disabled,
  onUpdateTags
}) => {
  const intl = useIntl();
  return (
      <GenericPanel header={intl.formatMessage({id: 'business.tags', defaultMessage: 'Tags'})}
                    name={'tags'}>
        <div>
          <EditableTags label={intl.formatMessage({id: 'form.tags', defaultMessage: 'Tags'})}
                        name={'tags'}
                        disabled={disabled}
                        newTag={intl.formatMessage({id: 'actions.new', defaultMessage: 'New'})}
                        onChange={onUpdateTags}
                        tags={tags}/>
        </div>
      </GenericPanel>
  );
};
