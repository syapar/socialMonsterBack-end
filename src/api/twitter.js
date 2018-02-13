import request from 'request';
import qs from 'querystring';

import twitterConfig from '../key/twitterKey.json';
import * as firebase from './firebase';
import * as ProviderTypes from '../constants/ProviderTypes';

export const init = () => {

};

export const getRequestUrl = (uid) =>
  new Promise((resolve, reject) => {
    request.post({
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        oauth_callback: 'http://localhost:3000/myAccount',
        consumer_key: twitterConfig.consumerKey,
        consumer_secret: twitterConfig.consumerSecret,
      },
    }, (err, response, body) => {
      if (err) {
        reject(err);
      }

      const requestToken = qs.parse(body);
      firebase.setSocialRequestSecret(uid, requestToken.oauth_token_secret);
      const uri = `https://api.twitter.com/oauth/authenticate?${qs.stringify({
        oauth_token: requestToken.oauth_token,
        // force_login: true,
      })}`;
      resolve(uri);
    });
  });

export const getAccessToken = (uid, requestResultBody) =>
  new Promise((resolve, reject) => {
    firebase.getSocialRequestSecret(uid).then((socialRequestSecret) => {
      const authData = requestResultBody;
      request.post({
        url: 'https://api.twitter.com/oauth/access_token',
        oauth: {
          consumer_key: twitterConfig.consumerKey,
          consumer_secret: twitterConfig.consumerSecret,
          token: authData.oauth_token,
          token_secret: socialRequestSecret,
          verifier: authData.oauth_verifier,
        },
      }, (e, response, body) => {
        if (e) {
          reject(e);
        }
        const socialAccountData = qs.parse(body);
        firebase.setSocialAccountData(
          uid,
          socialAccountData,
          socialAccountData.user_id,
          ProviderTypes.TWITTER
        ).then(() => {
          resolve();
        }).catch(err => {
          reject(err);
        });
      });
    }).catch(e => {
      reject(e);
    });
  });

export const getPosts = (uid, socialAccountId) =>
  new Promise((resolve, reject) => {
    firebase.getSocialAccountData(uid, socialAccountId).then((socialAccountData) => {
      request.get({
        url: 'https://api.twitter.com/1.1/statuses/user_timeline',
        oauth: {
          consumer_key: twitterConfig.consumerKey,
          consumer_secret: twitterConfig.consumerSecret,
          token: socialAccountData.oauth_token,
          token_secret: socialAccountData.oauth_token_secret,
        },
        qs: {
          screen_name: socialAccountData.screen_name,
          user_id: socialAccountData.user_id,
        },
        json: true,
      }, (e, response, body) => {
        if (e) {
          reject(e);
        }
        resolve(body);
      });
    }).catch((e) => {
      reject(e);
    });
  });
