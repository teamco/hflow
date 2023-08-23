import { objValue } from './table.utils';

/**
 * @constant
 * @param key
 * @param dataSource
 * @return {{text: *, value: *}[]}
 */
const filterBy = (key, dataSource = []) => {
  const _filter = dataSource?.map(data => ({
    text: data[key],
    value: data[key]
  }));

  return [
    ...new Map(_filter.map(item => [item['value'], item])).values()
  ];
};

// Specify the condition of filtering result.
// Here is that finding the name started with `value`
const onFilter = key => (value, record) => !objValue(record[key]).
    indexOf(value);

/**
 * @export
 * @param {{columns}} props
 * @return {*[]}
 */
export const filterColumns = (props) => {
  const {
    columns = [],
    dataSource = []
  } = props;

  return columns.map(column => {
    const _column = { ...column };

    if (_column.filterable) {
      _column.filters = filterBy(column.key, dataSource);
      _column.onFilter = onFilter(column.key, dataSource);

      delete _column.filterable;
    }

    return _column;
  });
};