import * as admin from 'firebase-admin';

import serviceAccount from '../key/social-monster-98d0c-firebase-adminsdk-ve5j2-f335bdf40c.json';

export const init = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
};

export const verifyIdToken = (idToken) =>
  new Promise((resolve, reject) => {
    admin.auth().verifyIdToken(idToken.token)
      .then((decodedToken) => {
        if (idToken.uid === decodedToken.uid) {
          resolve();
        } else {
          reject('id token not verified');
        }
      }).catch(() => {
        reject('id token not verified');
      });
  });

export const setSocialRequestSecret = (uid, socialRequestSecret) =>
  new Promise((resolve, reject) => {
    const userRef = admin.firestore().doc(`users/${uid}`);
    userRef.update({
      socialRequestSecret,
    }).then(() => {
      resolve();
    }).catch((e) => {
      // console.log(e);
      reject(e);
    });
  });


export const getSocialRequestSecret = (uid) =>
  new Promise((resolve, reject) => {
    const userRef = admin.firestore().doc(`users/${uid}`);
    userRef.get().then(doc => {
      if (!doc.exists) {
        reject('SocialRequestSecret not found!');
      } else {
        resolve(doc.data().socialRequestSecret);
      }
    }).catch((e) => {
      // console.log(e);
      reject(e);
    });
  });

export const setSocialAccountData = (uid, socialAccountData, socialAccountId, type) =>
  new Promise((resolve, reject) => {
    // console.log('2222', uid, socialAccountId, type, socialAccountData);
    const socialAccountRef = admin.firestore().doc(
      `users/${uid}/socialAccounts/${socialAccountId}`
    );
    socialAccountRef.set({
      ...socialAccountData,
      id: socialAccountId,
      type,
    }).then(() => {
      resolve();
    }).catch((e) => {
      // console.log(e);
      reject(e);
    });
  });

export const getSocialAccountData = (uid, socialAccountId) =>
  new Promise((resolve, reject) => {
    // console.log('3333', uid, socialAccountId);
    const socialAccountRef = admin.firestore().doc(
      `users/${uid}/socialAccounts/${socialAccountId}`
    );
    socialAccountRef.get().then(doc => {
      if (!doc.exists) {
        reject('SocialAccountData not found!');
      } else {
        // console.log('333', doc.data());
        resolve(doc.data());
      }
    }).catch((e) => {
      reject(e);
    });
  });
