import request from 'request';
import qs from 'querystring';

import facebookConfig from '../key/facebookKey.json';
import * as firebase from './firebase';
import * as ProviderTypes from '../constants/ProviderTypes';

export const getAccessToken = (uid, socialAccountId, shortLivedToken) =>
  new Promise((resolve, reject) => {
    const queryString = qs.stringify({
      grant_type: 'fb_exchange_token',
      client_id: facebookConfig.appId,
      client_secret: facebookConfig.appSecret,
      fb_exchange_token: shortLivedToken,
    });
    const url = `https://graph.facebook.com/oauth/access_token?${queryString}`;
    request.get(url, (e, response, body) => {
      if (e) {
        reject(e);
      }
      const socialAccountData = JSON.parse(body);
      // console.log('socialAccountData', socialAccountData);
      firebase.setSocialAccountData(
        uid,
        socialAccountData,
        socialAccountId,
        ProviderTypes.FACEBOOK
      ).then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  });
