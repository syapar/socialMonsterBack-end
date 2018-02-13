import request from 'request';
import qs from 'querystring';

import instagramConfig from '../key/instagramKey.json';
import * as firebase from './firebase';
import * as ProviderTypes from '../constants/ProviderTypes';

export const getAccessToken = (uid, code) =>
  new Promise((resolve, reject) => {
    request.post({
      url: 'https://api.instagram.com/oauth/access_token',
      form: {
        client_id: instagramConfig.clientId,
        client_secret: instagramConfig.clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000/myAccount',
        code,
      },
    }, (e, response, body) => {
      if (e) {
        reject(e);
      }
      const socialAccountData = JSON.parse(body);
      // console.log('socialAccountData', socialAccountData);
      firebase.setSocialAccountData(
        uid, {
          access_token: socialAccountData.access_token,
          ...socialAccountData.user,
        },
        socialAccountData.user.id,
        ProviderTypes.INSTAGRAM
      ).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  });
