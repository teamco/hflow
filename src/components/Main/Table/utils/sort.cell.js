import { objValue } from './table.utils';

/**
 * @constant
 * @param key
 * @return {function(*, *): *}
 */
const sorter = key => (a, b) => objValue(a[key]).length -
    objValue(b[key]).length;

/**
 * @export
 * @param props
 * @return {*[]}
 */
export const sortColumns = (props) => {
  const {
    columns = [],
  } = props;

  return columns.map(column => {
    const _column = { ...column };

    if (_column.sortable) {
      _column.sorter = sorter(column.key);
      _column.sortDirections = ['descend', 'ascend'];

      delete _column.sortable;
    }

    return _column;
  });
};