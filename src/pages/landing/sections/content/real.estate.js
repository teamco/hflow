import React from 'react';
import { withTranslation } from 'react-i18next';
import classnames from 'classnames';

import Trends from './trends';
import WorkFlow from './workFlow';
import Areas from './areas';
import Deals from './deals';

import styles from 'pages/landing/landing.module.less';

const RealEstate = props => {
  const {
    t,
    className,
    realEstate = {
      areas: [],
      deals: [],
      trends: []
    }
  } = props;

  return (
      <div className={classnames(className, styles.realEstate)}>
        <Trends {...realEstate.trends}/>
        <WorkFlow/>
        <Areas {...realEstate.areas}/>
        <Deals {...realEstate.deals}/>
      </div>
  );
};

export default withTranslation()(RealEstate);
