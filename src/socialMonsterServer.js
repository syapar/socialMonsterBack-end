import 'babel-polyfill';
import path from 'path';

import * as firebase from './api/firebase';
import * as express from './api/express';
import * as twitter from './api/twitter';
import * as facebook from './api/facebook';
import * as instagram from './api/instagram';

express.init();
firebase.init();
// twitter.init();

express.app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});


express.app.post('/api/v1/twitter/posts', (req, res) => {
  firebase.verifyIdToken(req.body.idToken).then(() => {
    twitter.getPosts(req.body.idToken.uid, req.body.socialAccountId).then((posts) => {
      res.json({
        result: {
          data: posts,
        },
        errorCode: 200,
      });
    }).catch((e) => {
      res.json({
        result: e,
        errorCode: 400,
      });
    });
  }).catch((e) => {
    res.json({
      result: e,
      errorCode: 400,
    });
  });
});


express.app.post('/api/v1/twitter/request', (req, res) => {
  firebase.verifyIdToken(req.body.idToken).then(() => {
    twitter.getRequestUrl(req.body.idToken.uid).then((response) => {
      res.json({
        result: {
          requestUrl: response,
        },
        errorCode: 200,
      });
    });
  }).catch((e) => {
    res.json({
      result: e,
      errorCode: 400,
    });
  });
});


express.app.post('/api/v1/twitter/auth', (req, res) => {
  firebase.verifyIdToken(req.body.idToken).then(() => {
    // console.log('auth called', req.body);
    twitter.getAccessToken(req.body.idToken.uid, req.body).then(() => {
      res.json({
        result: 'success',
        errorCode: 200,
      });
    }).catch((e) => {
      res.json({
        result: e,
        errorCode: 400,
      });
    });
  }).catch((e) => {
    res.json({
      result: e,
      errorCode: 400,
    });
  });
});

express.app.post('/api/v1/facebook/auth', (req, res) => {
  firebase.verifyIdToken(req.body.idToken).then(() => {
    // console.log('auth called', req.body);
    facebook.getAccessToken(
      req.body.idToken.uid,
      req.body.userID,
      req.body.accessToken
    ).then(() => {
      res.json({
        result: 'success',
        errorCode: 200,
      });
    }).catch((e) => {
      res.json({
        result: e,
        errorCode: 400,
      });
    });
  }).catch((e) => {
    res.json({
      result: e,
      errorCode: 400,
    });
  });
});

express.app.post('/api/v1/instagram/auth', (req, res) => {
  firebase.verifyIdToken(req.body.idToken).then(() => {
    // console.log('auth called', req.body);
    instagram.getAccessToken(
      req.body.idToken.uid,
      req.body.code
    ).then(() => {
      res.json({
        result: 'success',
        errorCode: 200,
      });
    }).catch((e) => {
      res.json({
        result: e,
        errorCode: 400,
      });
    });
  }).catch((e) => {
    res.json({
      result: e,
      errorCode: 400,
    });
  });
});
