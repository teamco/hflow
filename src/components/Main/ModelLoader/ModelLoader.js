import React from 'react';

import { prettifyCamelCase } from '@/utils/string';
import { isSpinning } from '@/utils/state';

import styles from './model.loader.module.less';

export const ModelLoader = props => {
  const { loading, spinEffects = [] } = props;

  const spinning = isSpinning(loading, spinEffects, false, true);

  return spinning?.status && DEBUG ? (
      <div className={styles.spinner}>
        {spinning.effects.map((effect, idx) => {
          const tip = prettifyCamelCase(effect.replace(/\w+Model\//, ''));
          return (
              <div key={idx}>{tip}</div>
          );
        })}
      </div>
  ) : null;
};