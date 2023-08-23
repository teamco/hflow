/**
 * @export
 * @param {{config}} props
 * @return {*&{fields: {color: {label: string, type: string, fieldSettings: {listValues: [{title: string, value: string},{title: string, value: string},{title: string, value: string}]}, valueSources: string[]}, price: {preferWidgets: string[], label: string, type: string, fieldSettings: {min: number, max: number}, valueSources: string[]}, qty: {preferWidgets: string[], label: string, type: string, fieldSettings: {min: number}, valueSources: string[]}, name: {label: string, type: string}, is_promotion: {operators: string[], label: string, type: string, valueSources: string[]}}}}
 */
export const queryBuilderMock = props => {
  return {
    ...props.config,
    fields: {
      qty: {
        label: 'Qty',
        type: 'number',
        fieldSettings: {
          min: 0
        },
        valueSources: ['value'],
        preferWidgets: ['number']
      },
      price: {
        label: 'Price',
        type: 'number',
        valueSources: ['value'],
        fieldSettings: {
          min: 10,
          max: 100
        },
        preferWidgets: ['slider', 'rangeslider']
      },
      name: {
        label: 'Name',
        type: 'text'
      },
      color: {
        label: 'Color',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          listValues: [
            {value: 'yellow', title: 'Yellow'},
            {value: 'green', title: 'Green'},
            {value: 'orange', title: 'Orange'}
          ]
        }
      },
      is_promotion: {
        label: 'Promo?',
        type: 'boolean',
        operators: ['equal'],
        valueSources: ['value']
      }
    }
  };
};