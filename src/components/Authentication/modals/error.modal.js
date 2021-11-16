import React from 'react';
import { Modal } from 'antd';

/**
 * @export
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
const ErrorModal = props => {
  const { errorProps, isErrorVisible, handleErrorCancel } = props;
  return (
      <Modal title={errorProps.title}
             visible={isErrorVisible}
             footer={null}
             onCancel={handleErrorCancel}>
        <span>{errorProps.error}</span>
      </Modal>
  );
};

export default ErrorModal;
