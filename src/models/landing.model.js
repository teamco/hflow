import React from 'react';

/** @type {Function} */
import dvaModelExtend from 'dva-model-extend';
import { commonModel } from 'models/common.model';

import {
  FieldTimeOutlined,
  ExperimentOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

import bigLogo from 'pages/landing/images/big_logo.png';
import swipeImg1 from 'pages/landing/images/main_bg1.jpg';
import swipeImg2 from 'pages/landing/images/main_bg2.jpg';
import swipeImg3 from 'pages/landing/images/main_bg3.jpg';

import diag1 from 'pages/landing/images/save_time_and_money.jpg';
import diag2 from 'pages/landing/images/diag3.jpeg';
import diag3 from 'pages/landing/images/enjoy_your_event_number3_carusel.jpg';

import serviceImg1 from 'pages/landing/images/one_request1.jpg';
import serviceImg2 from 'pages/landing/images/multiple_responces1.jpg';
import serviceImg3 from 'pages/landing/images/choose_your_meal_provider.jpg';

import missionImg from 'pages/landing/images/choose_your_meal_provider.jpg';

/**
 * @export
 */
export default dvaModelExtend(commonModel, {
  namespace: 'landingModel',
  state: {
    data: [],
    topUnder: 160,
    swipeData: [
      {
        background: swipeImg1,
        logo: bigLogo,
        title: 'landing:slogan',
        description: ''
      },
      {
        background: swipeImg2,
        logo: bigLogo,
        title: 'landing:slogan',
        description: ''
      },
      {
        background: swipeImg3,
        logo: bigLogo,
        title: 'landing:slogan',
        description: ''
      }
    ],
    discoveryData: [
      {
        title: 'landing:saveTime',
        description: 'landing:saveTimeDesc',
        icon: FieldTimeOutlined,
        bg: diag1
      },
      {
        title: 'landing:discoverIdeas',
        description: 'landing:discoverIdeasDesc',
        icon: ExperimentOutlined,
        bg: diag2
      },
      {
        title: 'landing:enjoyEvent',
        description: 'landing:enjoyEventDesc',
        icon: CheckCircleOutlined,
        bg: diag3
      }
    ],
    serviceData: [
      {
        title: 'landing:serviceRequest',
        img: serviceImg1,
        color: '#8EB8E5'
      },
      {
        title: 'landing:serviceResponse',
        img: serviceImg2,
        color: '#7C99B4'
      },
      {
        title: 'landing:serviceProvider',
        img: serviceImg3,
        color: '#6B7F82'
      },
    ],
    missionData: {
      title: 'landing:missionTitle',
      description_p1: 'landing:missionDescription_p1',
      description_p2: 'landing:missionDescription_p2',
      img: missionImg
    }
  },
  subscriptions: {
    setupHistory(setup) {
    },
    setup({ dispatch }) {
      dispatch({ type: 'query' });
    }
  },
  effects: {
    * query({ payload }, { put, select }) {
    }
  },
  reducers: {}
});
