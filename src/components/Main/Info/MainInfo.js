import React from 'react';
import { Link, useIntl } from 'umi';
import FormComponents from '@/components/Form';

const { GenericPanel } = FormComponents;

export default class MainInfo extends React.Component {

  render() {
    const {
      touched,
      isEdit = false,
      info: {
        createdBy = {},
        updatedBy = {},
        createdAt,
        updatedAt
      }
    } = this.props;
    const intl = useIntl();

    return isEdit && (
        <GenericPanel header={intl.formatMessage({id: 'form.entityInfo', defaultMessage: '{entity} Information'}, { entity: intl.formatMessage({id: 'panel.details', defaultMessage: 'Details'}) })}
                      collapsible={touched ? 'disabled' : 'header'}
                      name={'entityInfo'}>
          <div>
            <div label={intl.formatMessage({id: 'form.createdBy', defaultMessage: 'Created by'})}>
              <Link to={`/admin/users/${createdBy.id}`}>{createdBy.displayName}</Link>
            </div>
            <div label={intl.formatMessage({id: 'form.updatedBy', defaultMessage: 'Updated by'})}>
              <Link to={`/admin/users/${updatedBy.id}`}>{updatedBy.displayName}</Link>
            </div>
          </div>
          <div>
            <div label={intl.formatMessage({id: 'form.createdAt', defaultMessage: 'Create at'})}>{createdAt}</div>
            <div label={intl.formatMessage({id: 'form.updatedAt', defaultMessage: 'Updated At'})}>{updatedAt}</div>
          </div>
        </GenericPanel>
    );
  }
}
