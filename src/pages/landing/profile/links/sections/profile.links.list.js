import React from 'react';
import { useIntl } from '@umijs/max';
import { Tag } from 'antd';
import classnames from 'classnames';

import { t } from '@/utils/i18n';
import { stub } from '@/utils/function';

import EmptyData from '@/components/EmptyData';
import Loader from '@/components/Loader';
import { FormListActions } from '@/components/Form/FormListActions';
import { PrivateTag } from '@/components/Form/formProps';
import { AnchorBlank } from '@/components/Common/Anchor/Blank';

import styles from '@/pages/landing/profile/links/profile.links.module.less';

const MODEL_NAME = 'profileLinkModel';

export const ProfileLinksList = props => {
  const intl = useIntl();

  const {
    loading,
    formRef,
    canDelete,
    sLinks = [],
    selected,
    setSelected = stub,
    onUpdateTags = stub,
    onEdit = stub,
    onDelete = stub
  } = props;

  const handleEdit = (link) => {
    setSelected(link);
    onEdit(link);

    formRef.setFields([
      { name: 'private', value: link?.private },
      { name: 'url', value: link?.url },
      { name: 'title', value: link?.title },
      { name: 'description', value: link?.description },
      { name: 'tags', value: link?.tags }
    ]);

    onUpdateTags(link?.tags || []);
  };

  const handleDelete = (logo) => {
    canDelete && onDelete(logo);
    handleUnselect(logo);
  };

  const handleUnselect = (logo) => {
    formRef.resetFields();

    onUpdateTags([]);
    setSelected(null);
    onEdit(logo, true);
  };

  const actionProps = {
    className: styles.actions,
    disabledClassName: styles.disabled,
    entityType: t(intl, 'profile.link'),
    selected,
    handleEdit,
    handleDelete,
    handleUnselect
  };

  const spinOn = [
    `${MODEL_NAME}/getLinks`,
    `${MODEL_NAME}/deleteLink`,
    `${MODEL_NAME}/updateLinks`
  ];

  return (
      <Loader loading={loading} spinOn={spinOn}>
        <ul className={styles.linkSectionWrapper}>
          {sLinks.length ? sLinks?.map((link, idx) => {
            const isSelected = link.id === selected?.id;

            return (
                <li key={idx}
                    className={classnames({ [styles.selected]: isSelected })}>
                  <div>
                    <PrivateTag entity={{ private: link?.private }}/>

                    <p>{link?.title}</p>
                    <AnchorBlank href={link.url} title={link?.title}>{link?.url}</AnchorBlank>
                  </div>
                  {link?.description ? (
                      <div className={styles.metadata}>
                        {link?.description}
                      </div>
                  ) : null}
                  {link?.tags?.length ?
                      (<div>{link?.tags?.map(
                          (tag, idx) => (<Tag key={idx}>{tag}</Tag>))}</div>) :
                      null}
                  <FormListActions {...actionProps}
                                   isSelected={isSelected}
                                   entity={link}/>
                </li>
            );
          }) : (
              <EmptyData/>
          )}
        </ul>
      </Loader>
  );
};