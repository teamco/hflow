import React, { useEffect, useState, useRef } from 'react';
import { Input, Tag, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useIntl } from '@umijs/max';

import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';
import { focusAt } from '@/utils/dom';

import styles from '@/components/Form/form.module.less';

/**
 * @export
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const EditableTags = props => {
  const intl = useIntl();

  const {
    formRef,
    name,
    disabled,
    forceUpdateForm = false,
    canDelete = false,
    canUpdate = false,
    canCreate = false,
    onChange = stub,
    size = 'small',
    newTag = t(intl, 'actions.new'),
    tags = [],
    truncateOn = 20
  } = props;

  const [_tags, set_tags] = useState(tags);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');

  // textInput must be declared here so the ref can refer to it
  const inputRef = useRef(null);
  const editRef = useRef(null);

  /**
   * @function
   * @param removedTag
   */
  const handleClose = removedTag => {
    const updatedTags = _tags.filter(tag => tag !== removedTag);
    onChange(updatedTags);
    forceUpdateForm && formRef?.setFields([{ name, value: updatedTags }]);
  };

  useEffect(() => {
    set_tags(tags);
  }, [tags]);

  focusAt({condition: inputVisible, ref: inputRef});
  focusAt({condition: editInputIndex > -1, ref: editRef});

  const showInput = () => {
    setInputVisible(!disabled);
  };

  /**
   * @function
   * @param {string} value
   */
  const handleInputChange = ({ target: { value } }) => {
    canUpdate && setInputValue(value);
  };

  /**
   * @function
   */
  const handleInputConfirm = () => {
    if (inputValue && _tags.indexOf(inputValue) === -1) {
      const updatedTags = [..._tags, inputValue];
      set_tags([...updatedTags]);
      onChange(updatedTags);
      forceUpdateForm && formRef?.setFields([{ name, value: updatedTags }]);
    }

    setInputVisible(false);
    setInputValue('');
  };

  /**
   * @function
   * @param value
   */
  const handleEditInputChange = ({ target: { value } }) => {
    setEditInputValue(value);
  };

  /**
   * @function
   */
  const handleEditInputConfirm = () => {
    const newTags = [..._tags];
    newTags[editInputIndex] = editInputValue;

    onChange(newTags);
    forceUpdateForm && formRef?.setFields([{ name, value: newTags }]);

    setEditInputValue('');
    setEditInputIndex(-1);
  };

  return (
      <div>
        {_tags?.map((tag, idx) => {
          if (editInputIndex === idx) {
            return (
                <Input ref={editRef}
                       key={tag}
                       size={size}
                       disabled={disabled}
                       className={styles.tagInput}
                       value={editInputValue}
                       onChange={handleEditInputChange}
                       onBlur={handleEditInputConfirm}
                       onPressEnter={handleEditInputConfirm}/>
            );
          }

          const isLongTag = tag.length > 20;

          const tagElem = (
              <Tag className={styles.editTag}
                   key={tag}
                   closable={!disabled && canDelete}
                   onClose={() => handleClose(tag)}>
                  <span onDoubleClick={e => {
                    e.preventDefault();

                    if (canUpdate) {
                      setEditInputIndex(idx);
                      setEditInputValue(tag);
                    }
                  }}>
                    {isLongTag ? `${tag.slice(0, truncateOn)}...` : tag}
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
            <Input ref={inputRef}
                   type={'text'}
                   size={size}
                   disabled={disabled}
                   className={styles.tagInput}
                   value={inputValue}
                   onChange={handleInputChange}
                   onBlur={handleInputConfirm}
                   onPressEnter={handleInputConfirm}/>
        )}
        {!inputVisible && canCreate && (
            <Tag className={disabled ? styles.siteTagDisabled : styles.siteTagPlus}
                 onClick={showInput}>
              <PlusOutlined/> {newTag}
            </Tag>
        )}
      </div>
  );
};

export default EditableTags;
