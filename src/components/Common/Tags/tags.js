import React from 'react';
import { useIntl } from '@umijs/max';

import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';

import GenericPanel from '@/components/Form/GenericPanel';
import EditableTags from '@/components/Form/EditableTags';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const CommonTags = (props) => {
  const intl = useIntl();

  const {
    testId,
    formRef,
    tags = [],
    disabled,
    onUpdateTags = stub,
    canUpdate = false,
    canDelete = false,
    canCreate = false,
    name = 'tags',
    defaultActiveKey = null,
    ...rest
  } = props;

  const { header = t(intl, 'form.tags') } = rest;

  return (
      <GenericPanel header={header}
                    data-testid={testId}
                    name={name}
                    defaultActiveKey={defaultActiveKey}>
        <div>
          <EditableTags label={t(intl, 'form.tags')}
                        name={'tags'}
                        form={formRef}
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

export default CommonTags;
