import React from 'react';

import { Input } from 'antd';
import FormComponents from 'components/Form';

const { GenericPanel } = FormComponents;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const CampaignTranslate = (props) => {
  const {
    t,
    formRef,
    disabled
  } = props;

  return (
      <GenericPanel header={t('feature:translate')}
                    name={'translate'}
                    defaultActiveKey={['translate']}>
        <div>
          <Input type={'text'}
                 label={t('campaign:title')}
                 name={['translateKeys', 'title']}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: false }] }} />
          <Input type={'text'}
                 label={t('campaign:description')}
                 name={['translateKeys', 'description']}
                 form={formRef}
                 disabled={disabled}
                 config={{ rules: [{ required: false }] }}/>
        </div>
      </GenericPanel>
  );
};
