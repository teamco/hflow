import React from 'react';
import classnames from 'classnames';

import Trends from './trends';
import WorkFlow from './workFlow';
import Areas from './areas';
import Deals from './deals';
import Search from './search';

import styles from 'pages/landing/landing.module.less';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const RealEstate = props => {
  const {
    className,
    realEstate = {
      areas: [],
      deals: [],
      trends: []
    }
  } = props;

  return (
      <div className={classnames(className, styles.realEstate)}>
        <Search/>
        <Trends {...realEstate.trends}/>
        <WorkFlow/>
        <Areas {...realEstate.areas}/>
        <Deals {...realEstate.deals}/>
      </div>
  );
};

export default withTranslation()(RealEstate);
