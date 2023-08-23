import React from 'react';
import { Col, Divider, Row } from 'antd';
import { useIntl } from '@umijs/max';

import { layout } from '@/utils/layout';
import { t } from '@/utils/i18n';
import { useGeolocation } from '@/utils/geolocation';

import { FormInput } from '@/components/Form';
import { fieldName } from '@/components/Form/formProps';
import { effectHook } from '@/utils/hooks';

export const AddressGeo = props => {
  const intl = useIntl();

  const {
    messageApi,
    geo,
    ns,
    disabled,
    divider = true,
    rules = {},
    helper
  } = props;

  const isCoordinate = rules?.mandatory?.includes('coordinate');

  let geoLocation = useGeolocation(geo);

  // TODO (teamco): Handle current geo location.
  const { longitude = 0, latitude = 0, error } = geoLocation;

  effectHook(async () => {
    if (error) {
      messageApi.open({
        type: 'warning',
        content: error
      });
    } else {

    }
  }, [geoLocation]);

  return geo && isCoordinate ? (
      <>
        <Row gutter={[24, 24]}>
          <Col {...layout.halfColumn}>
            <FormInput name={fieldName(ns, 'longitude')}
                       label={t(intl, 'address.longitude')}
                       extra={helper ? t(intl, 'address.longitude.helper') : null}
                       intl={intl}
                       required={false}
                       disabled={disabled}/>
          </Col>
          <Col {...layout.halfColumn}>
            <FormInput name={fieldName(ns, 'latitude')}
                       label={t(intl, 'address.latitude')}
                       extra={helper ? t(intl, 'address.latitude.helper') : null}
                       intl={intl}
                       required={false}
                       disabled={disabled}/>
          </Col>
        </Row>
        {divider && <Divider/>}
      </>
  ) : null;
};