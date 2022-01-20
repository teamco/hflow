import React from 'react';
import { Link } from 'umi';

import FormComponents from '@/components/Form';

const { GenericPanel } = FormComponents;

export default class MainInfo extends React.Component {

  render() {
    const {
      t,
      touched,
      isEdit = false,
      info: {
        createdBy = {},
        updatedBy = {},
        createdAt,
        updatedAt
      }
    } = this.props;

    return isEdit && (
        <GenericPanel header={t('form:entityInfo', { entity: t('panel:details') })}
                      collapsible={touched ? 'disabled' : 'header'}
                      name={'entityInfo'}>
          <div>
            <div label={t('form:createdBy')}>
              <Link to={`/admin/users/${createdBy.id}`}>{createdBy.displayName}</Link>
            </div>
            <div label={t('form:updatedBy')}>
              <Link to={`/admin/users/${updatedBy.id}`}>{updatedBy.displayName}</Link>
            </div>
          </div>
          <div>
            <div label={t('form:createdAt')}>{createdAt}</div>
            <div label={t('form:updatedAt')}>{updatedAt}</div>
          </div>
        </GenericPanel>
    );
  }
}
