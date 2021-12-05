import React, { useEffect, useState } from 'react';

import { Input, InputNumber, Select, Slider } from 'antd';
import FormComponents from 'components/Form';

const { GenericPanel, MandatoryTextarea } = FormComponents;
const { Option } = Select;

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export const PreferenceInfo = (props) => {
  const {
    t,
    formRef,
    disabled
  } = props;

  return (
      <GenericPanel header={t('preference:info')}
                    name={'info'}
                    defaultActiveKey={['info']}>
        <div>
        </div>
      </GenericPanel>
  );
};
