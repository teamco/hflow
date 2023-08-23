import React from 'react';
import { Steps } from 'antd';
import classnames from 'classnames';

import styles from './steps.module.less';

export const MainSteps = props => {
  const {
    className,
    currentStep,
    formSteps = [],
    size = 'small',
    labelPlacement = 'vertical'
  } = props;

  const items = formSteps.map((item) => ({
    key: item.title,
    title: item.title,
    description: item.description
  }));

  return (
      <div className={classnames(styles.steps, className)}>
        <Steps current={currentStep}
               size={size}
               percent={(currentStep * 100) / (formSteps.length - 1)}
               labelPlacement={labelPlacement}
               items={items}/>
      </div>
  );
};