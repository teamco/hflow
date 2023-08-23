import React from 'react';
import { Modal } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const ErrorModal = props => {
  const { errorProps, isErrorVisible, handleErrorCancel, className } = props;
  return (
      <Modal title={(
          <>
            <WarningOutlined/>
            {errorProps?.title}
          </>
      )}
             open={isErrorVisible}
             footer={null}
             wrapClassName={className}
             onCancel={handleErrorCancel}>
        <span>{errorProps?.error}</span>
      </Modal>
  );
};

export default ErrorModal;
