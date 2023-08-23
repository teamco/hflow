import React, { useState } from 'react';
import { Table } from 'antd';
import { useIntl } from '@umijs/max';

import { stub } from '@/utils/function';
import { effectHook } from '@/utils/hooks';

import { filterColumns } from './utils/filter.cell';
import { sortColumns } from './utils/sort.cell';
import { ResizableTitle } from './utils/resizable.cell';
import {
  dataSourceTransform, gridConfig, handlePagination, mergeColumns,
  tFooter
} from './utils/table.utils';

import styles from './table.module.less';

/**
 * @function
 * @constructor
 * @param props
 * @return {JSX.Element}
 */
function MainTable(props = {}) {
  const intl = useIntl();

  const {
    data = [],
    scroll,
    columns,
    pagination = null,
    pageSize = 15,
    footer = true,
    onChange = stub,
    ...rest
  } = props;

  const dataSource = dataSourceTransform(data);
  const gridProps = gridConfig({ props, dataSource });

  const fColumns = filterColumns({ columns, dataSource });
  const sColumns = sortColumns({ columns: [...fColumns] });

  const [tablePageSize, setTablePageSize] = useState(pageSize);
  const [tColumns, setColumns] = useState(sColumns);

  effectHook(() => {
    setTablePageSize(pageSize);
  });

  const PAGINATION = handlePagination({
    dataSource,
    tablePageSize,
    pagination
  });

  const handleChange = pagination => {
    setTablePageSize(pagination.pageSize);
    onChange(pagination);
  };

  return (
      <Table className={styles.grid}
             components={{
               header: {
                 cell: ResizableTitle
               }
             }}
             scroll={scroll}
             onChange={handleChange}
             expandable={gridProps.expandable}
             footer={() => tFooter({ intl, footer, total: dataSource.length })}
             columns={mergeColumns({
               setColumns,
               columns: tColumns
             })}
             {...PAGINATION}
             {...gridProps}
             {...rest}/>
  );
}

export default MainTable;
