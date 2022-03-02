import React from 'react';
import { Input, Tag, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';

import styles from '@/components/Form/form.module.less';

/**
 * @class EditableTags
 */
class EditableTags extends React.Component {
  state = {
    inputVisible: false,
    inputValue: '',
    editInputIndex: -1,
    editInputValue: ''
  };
  intl = useIntl();
  /**
   * @function
   * @param removedTag
   */
  handleClose = removedTag => {
    let { onChange, tags } = this.props;
    onChange(tags.filter(tag => tag !== removedTag));
  };

  /**
   * @function
   */
  showInput = () => {
    const isEnabled = !this.props.disabled;
    this.setState({ inputVisible: isEnabled && true }, () => isEnabled && this.input.focus());
  };

  /**
   * @function
   * @param e
   */
  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  /**
   * @function
   */
  handleInputConfirm = () => {
    let { onChange, tags = [] } = this.props;
    const { inputValue } = this.state;

    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }

    onChange(tags);

    this.setState({
      inputVisible: false,
      inputValue: ''
    });
  };

  /**
   * @function
   * @param e
   */
  handleEditInputChange = e => {
    this.setState({ editInputValue: e.target.value });
  };

  /**
   * @function
   */
  handleEditInputConfirm = () => {
    const { tags, onChange } = this.props;

    this.setState(({ editInputIndex, editInputValue }) => {
      const newTags = [...tags];
      newTags[editInputIndex] = editInputValue;

      onChange(newTags);

      return {
        editInputIndex: -1,
        editInputValue: ''
      };
    });
  };

  /**
   * @function
   * @param input
   */
  saveInputRef = input => {
    this.input = input;
  };

  /**
   * @function
   * @param input
   */
  saveEditInputRef = input => {
    this.editInput = input;
  };

  render() {
    const { inputVisible, inputValue, editInputIndex, editInputValue } = this.state;
    const { tags, disabled, size = 'small' } = this.props;
    const { newTag = intl.formatMessage({id: 'actions.newTag', defaultMessage: 'New Tag'}) } = this.props;

    return (
        <div>
          {(tags || []).map((tag, index) => {
            if (editInputIndex === index) {
              return (
                  <Input ref={this.saveEditInputRef}
                         key={tag}
                         size={size}
                         disabled={disabled}
                         className={styles.tagInput}
                         value={editInputValue}
                         onChange={this.handleEditInputChange}
                         onBlur={this.handleEditInputConfirm}
                         onPressEnter={this.handleEditInputConfirm}/>
              );
            }

            const isLongTag = tag.length > 20;

            const tagElem = (
                <Tag className={styles.editTag}
                     key={tag}
                     closable={!disabled}
                     onClose={() => this.handleClose(tag)}>
                  <span onDoubleClick={e => {
                    this.setState({
                      editInputIndex: index,
                      editInputValue: tag
                    }, () => {
                      this.editInput.focus();
                    });
                    e.preventDefault();
                  }}>
                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                  </span>
                </Tag>
            );
            return isLongTag ? (
                <Tooltip title={tag} key={tag}>
                  {tagElem}
                </Tooltip>
            ) : (
                tagElem
            );
          })}
          {inputVisible && (
              <Input ref={this.saveInputRef}
                     type={'text'}
                     size={size}
                     disabled={disabled}
                     className={styles.tagInput}
                     value={inputValue}
                     onChange={this.handleInputChange}
                     onBlur={this.handleInputConfirm}
                     onPressEnter={this.handleInputConfirm}/>
          )}
          {!inputVisible && (
              <Tag className={disabled ? styles.siteTagDisabled : styles.siteTagPlus}
                   onClick={this.showInput}>
                <PlusOutlined/> {newTag}
              </Tag>
          )}
        </div>
    );
  }
}

export default EditableTags;
