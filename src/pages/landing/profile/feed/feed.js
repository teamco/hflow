import React, { useRef } from 'react';
import styles from '@/pages/landing/profile/feed/feed.module.less';
import { Link } from '@umijs/max';
import { Row, Spin, Card, Avatar, Col } from 'antd';
import { API } from '@/services/config/api.config';

const { Meta } = Card;

import { isSpinning } from '@/utils/state';
import { effectHook } from '@/utils/hooks';
import Loader from '@/components/Loader';

const MODEL_NAME = 'profileModel';

export const ProfileFeed = (props) => {

  const {
    loading,
    authModel,
    profileModel,
    onQuery
  } = props;

  const {
    profiles: { content }
  } = profileModel;

  const component = 'profile.feed';

  effectHook(() => {
    if (authModel && authModel.user) {
      onQuery();
    }
    ;
  }, [authModel.user]);

  const getProfileImage = (primaryLogo) => {
    return primaryLogo ? primaryLogo?.url : API.avatar;
  };

  const getProfileEmail = (primaryEmail) => {
    return primaryEmail ? primaryEmail : '&nbsp;';
  };

  function getBlank() {
    return <>&nbsp;</>;
  }

  const returnProfile = (url, mail, first, second) => {
    return (
        <div className={styles.wrapper}>
          <div className={styles.topIcons}>
            <i className="fas fa-long-arrow-alt-left"></i>
            <i className="fas fa-ellipsis-v"></i>
            <i className="far fa-heart"></i>
          </div>

          <div className={styles.profile}>
            <Avatar
                size={100}
                src={getProfileImage(url)}
                className={styles.thumbnail}
            />
            <div className={styles.check}><i className="fas fa-check"></i></div>
            <h3 className={styles.name}>{`${first} ${second}`}</h3>
            <p className={styles.title}>{mail ? getProfileEmail(mail) : getBlank()}</p>
            <p className={styles.description}>&nbsp;</p>
            <button type="button" className={styles.btn}>Connect</button>
          </div>
        </div>
    );
  };

  const spitToChunk = (size) => {
    let data = [];
    data = Array.isArray(content) && Array.from({ length: Math.ceil(content.length / size) }, (v, i) =>
        content.slice(i * size, i * size + size)
    );
    return data;
  };

  const getProfileCard = () => {
    const rowData = spitToChunk(4);
    return Array.isArray(rowData) && rowData.map((item, ind) => {
      return <Row gutter={24} key={ind}>
        {item && item.map((colData, colInd) => {
          const {
            name: { first, second } = [],
            primaryLogo: { url = false } = [],
            primaryEmail: { mail = false } = [],
            id
          } = colData;
          return (
              <Col key={colInd} span={6}>
                <Link to={`/profile/overview/${id}`}>
                  <Card hoverable={false}>
                    {returnProfile(url, mail, first, second)}
                  </Card>
                </Link>
              </Col>
          );
        })};
      </Row>;
    });
  };

  return (
      <div className={styles.profilesOverview}>
        <Loader spinning={!content} loading={loading} spinOn={[`${MODEL_NAME}/query`]}>
          <Row>
            <Col span={16}>{getProfileCard()}</Col>
            <Col span={8}></Col>
          </Row>
        </Loader>
      </div>
  );
};