import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';

import { handleResize } from './resizable.cell';

/**
 * @constant
 * @param data
 * @param {string} type
 * @returns {string|*}
 * @private
 */
export const objValue = (data, type = 'string') => {
  if (type === 'string') {
    return data ?? '';
  }

  return data;
};

/**
 * @description Add keys to dataSource
 * @type {function([]=): (*&{key: *})[]}
 */
export const dataSourceTransform = (data = [], type = 'key') =>
    data.map((entity, idx) => ({ ...entity, ...{ [type]: idx } }));

/**
 * @export
 * @param props
 * @param dataSource
 * @return {*}
 */
export const gridConfig = ({ props, dataSource = [] }) => {
  const _props = { ...props };

  _props.dataSource = dataSource;

  delete _props.t;
  delete _props.data;
  delete _props.columns;

  return _props;
};

/**
 * @export
 * @param props
 * @return {{pagination: (*&{tablePageSize, position: (string)[], showQuickJumper: boolean, showSizeChanger: boolean})}|{pagination: {position: string[]}}}
 */
export const handlePagination = (props) => {
  const {
    tablePageSize,
    pagination,
    dataSource = []
  } = props;

  return {
    pagination: pagination ? {
      showSizeChanger: dataSource.length > 10,
      showQuickJumper: dataSource.length > tablePageSize,
      position: [dataSource.length ? 'bottomRight' : 'none'],
      tablePageSize,
      ...pagination
    } : { position: ['none'] }
  };
};

/**
 * @export
 * @param props
 * @return {(*&{onHeaderCell: function(*): {onResize: *, width: *}})[]}
 */
export const mergeColumns = (props = {}) => {
  const {
    columns = [],
    setColumns = stub
  } = props;

  return columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: handleResize({
        index,
        columns,
        setColumns
      })
    })
  }));
};

/**
 * @export
 * @param intl
 * @param footer
 * @param total
 * @return {*}
 */
export const tFooter = ({ intl, footer, total }) =>
    footer ? `${t(intl, 'table.total')}: ${total}` : null;