import React from 'react';
import { useIntl } from 'umi';
import FormComponents from '@/components/Form';
import { stub } from '@/utils/function';

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
  formRef,
  tags = [],
  disabled,
  onUpdateTags = stub(),
  name = 'tags',
  defaultActiveKey = null,
  ...rest
}) => {
  const intl = useIntl();
  const { header = intl.formatMessage({id: 'form.tags', defaultMessage: 'Tags'}) } = rest;

  return (
      <GenericPanel header={header}
                    data-testid={'common-tags'}
                    name={name}
                    defaultActiveKey={defaultActiveKey}>
        <div>
          <EditableTags label={intl.formatMessage({id: 'form.tags', defaultMessage: 'Tags'})}
                        name={'tags'}
                        form={formRef}
                        disabled={disabled}
                        newTag={intl.formatMessage({id: 'actions.new', defaultMessage: 'New'})}
                        onChange={onUpdateTags}
                        tags={tags}/>
        </div>
      </GenericPanel>
  );
};

export default CommonTags;
