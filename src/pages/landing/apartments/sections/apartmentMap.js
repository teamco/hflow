import React, { useState } from 'react';
import { useIntl } from '@umijs/max';
import { Spin, Modal } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import classnames from 'classnames';

import Map from '@/components/Map';

import { stub } from '@/utils/function';
import { t } from '@/utils/i18n';

import googleConfig from '@/services/config/google.config';

import styles from '../apartment.module.less';
import landingStyles from '@/layouts/landing/landing.layout.module.less';

const { MAP_JS_API, MAP_KEY, MAP_LIBS } = googleConfig;
const { Google: { JsMap } } = Map;

const Handler = props => {
  const {
    className,
    label,
    icon,
    onClick = stub
  } = props;

  return (
      <div className={className}
           onClick={onClick}>
        {icon}{label}
      </div>
  );
};

export const ApartmentMap = props => {
  const intl = useIntl();

  const {
    open = false,
    spinning = false,
    Trigger = Handler,
    icon = (<AimOutlined className={classnames(landingStyles.prettified, landingStyles.white)}/>),
    label = t(intl, 'actions.showOnMap'),
    width = '90%',
    height = '100%',
    address,
    inline = true,
    mapOpts,
    loadingElement = (<div className={styles.loadingElement} style={{ height }}/>),
    mapElement = (<div className={styles.mapElement} style={{ height }}/>),
    containerElement = (<div className={styles.mapWrapper}/>)
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(open);

  const isSpinning = spinning || !address?.coordinate;

  const map = () => isSpinning ? (
      <Spin spinning={true}/>
  ) : (
      <JsMap address={address}
             googleMapURL={`${MAP_JS_API}?key=${MAP_KEY}&v=3.exp&libraries=${MAP_LIBS}`}
             containerElement={containerElement}
             loadingElement={loadingElement}
             mapElement={mapElement}
             options={mapOpts}/>
  );

  return inline ? map() : (
      <>
        <Trigger className={styles.trigger}
                 label={label}
                 icon={icon}
                 onClick={() => setIsModalOpen(true)}/>
        <Modal title={null}
               open={isModalOpen}
               width={width}
               centered
               className={styles.modalMap}
               closeIcon={t(intl, 'actions.close')}
               onCancel={() => setIsModalOpen(false)}
               footer={null}>
          {map()}
        </Modal>
      </>
  );
};