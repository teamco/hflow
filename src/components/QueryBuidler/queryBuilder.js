import React, { useState, useCallback } from 'react';
import classnames from 'classnames';
import {
  Utils as QbUtils,
  Query,
  Builder,
  AntdConfig
} from '@react-awesome-query-builder/antd';

import { queryBuilderMock } from './__mock__/queryBuilder.mock';

import styles from './queryBuilder.module.less';

const InitialConfig = AntdConfig;

// You can load query value from your backend storage (for saving see `Query.onChange()`)
const queryValue = {id: QbUtils.uuid(), type: 'group'};

export const QueryBuilder = props => {
  const {
    className,
    config = queryBuilderMock({config: InitialConfig})
  } = props;

  const [state, setState] = useState({
    tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), config),
    config: config
  });

  const onChange = useCallback((immutableTree, config) => {
    // Tip: for better performance you can apply `throttle` - see `examples/demo`
    setState(prevState => ({
      ...prevState,
      tree: immutableTree,
      config: config
    }));

    const jsonTree = QbUtils.getTree(immutableTree);
    console.log(jsonTree);
    // `jsonTree` can be saved to backend, and later loaded to `queryValue`
  }, []);

  const renderBuilder = useCallback((props) => (
      <div className="query-builder-container" style={{padding: '10px'}}>
        <div className="query-builder qb-lite">
          <Builder {...props} />
        </div>
      </div>
  ), []);

  return (
      <div className={classnames(styles.queryBuilder, className)}>
        <Query {...config}
               value={state.tree}
               onChange={onChange}
               renderBuilder={renderBuilder}/>
        <div className="query-builder-result">
          <div>
            Query string:{' '}
            <pre>
            {JSON.stringify(QbUtils.queryString(state.tree, state.config))}
          </pre>
          </div>
          <div>
            MongoDb query:{' '}
            <pre>
            {JSON.stringify(QbUtils.mongodbFormat(state.tree, state.config))}
          </pre>
          </div>
          <div>
            SQL where:{' '}
            <pre>
            {JSON.stringify(QbUtils.sqlFormat(state.tree, state.config))}
          </pre>
          </div>
          <div>
            JsonLogic:{' '}
            <pre>
            {JSON.stringify(QbUtils.jsonLogicFormat(state.tree, state.config))}
          </pre>
          </div>
        </div>
      </div>
  );
};