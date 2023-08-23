import React, { useState } from 'react';
import { useIntl } from '@umijs/max';
import { Modal, Spin, Tooltip } from 'antd';
import {
  CopyOutlined,
  FacebookOutlined,
  MailOutlined,
  TwitterOutlined
} from '@ant-design/icons';
import classnames from 'classnames';

import { t } from '@/utils/i18n';

import { ShareIcon } from '@/components/Icons';
import { AnchorBlank } from '@/components/Common/Anchor/Blank';

import styles from '../apartment.module.less';
import landingStyles from '@/layouts/landing/landing.layout.module.less';

export const ApartmentShare = props => {
  const intl = useIntl();

  const { href, host } = window.location;
  const url = encodeURIComponent(href);

  if (!props.address) {
    return (<Spin spinning={true} className={props.className}/>);
  }

  const { streetAddress, city, state, zipCode } = props.address || {};

  const address = encodeURIComponent([
    streetAddress,
    city,
    state,
    zipCode
  ].join(' '));

  const {
    className,
    title = encodeURIComponent('Check out this property on'),
    shareTo = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${title}%20${url}`,
      email: `mailto:?subject=${title}%20${host}&body=${address}%20-%20${url}`,
      copy: href,
      pdf: url
    },
    modal = {
      header: t(intl, 'apartment.share.title'),
      width: 300,
      footer: null,
      centered: true
    }
  } = props;

  const [isSharingOpen, setIsSharingOpen] = useState(false);
  const [copy, setCopy] = useState(t(intl, 'apartment.share.copy'));

  return (
      <div className={classnames(className)}>
        <div onClick={() => setIsSharingOpen(true)}>
          <Tooltip title={t(intl, 'actions.share')}>
            <ShareIcon className={classnames(landingStyles.prettified, landingStyles.regular)}/>
          </Tooltip>
        </div>
        <Modal title={modal?.header}
               open={isSharingOpen}
               centered={modal?.centered}
               className={styles.shareModal}
               footer={modal?.footer}
               width={modal?.width}
               onCancel={() => setIsSharingOpen(false)}>
          <div className={styles.shareItems}>
            <AnchorBlank href={shareTo.facebook}>
              <FacebookOutlined/> Facebook
            </AnchorBlank>
            <AnchorBlank href={shareTo.twitter}>
              <TwitterOutlined/> Twitter
            </AnchorBlank>
            <a href={shareTo.email}>
              <MailOutlined/> {t(intl, 'apartment.share.email')}
            </a>
            <div onClick={async () => {
              await navigator.clipboard.writeText(shareTo.copy);
              setCopy(t(intl, 'apartment.share.copied'));
            }}><CopyOutlined/> {copy}</div>
          </div>
        </Modal>
      </div>
  );
};