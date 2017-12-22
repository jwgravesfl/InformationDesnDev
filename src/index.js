/**
 * React Starter Kit for Firebase and GraphQL
 * https://github.com/kriasoft/react-firebase-starter
 * Copyright (c) 2015-present Kriasoft | MIT License
 */

/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import firebase from '@firebase/app';

import App from './components/App';
import auth from './auth';
import history from './history';
import routes from './routes';
import registerServiceWorker from './registerServiceWorker';

firebase.initializeApp({
  apiKey: 'AIzaSyCef0aX4HAyuTJQl_XKRxt0N2SdWJKgAUI',
  authDomain: 'informationdesndev.firebaseapp.com',
  databaseURL: 'https://informationdesndev.firebaseio.com',
  projectId: 'informationdesndev',
  storageBucket: 'informationdesndev.appspot.com',
  messagingSenderId: '954561464990',
});

const render = props =>
  new Promise((resolve, reject) => {
    try {
      ReactDOM.render(
        <App {...props} />,
        document.getElementById('root'),
        resolve(props),
      );
    } catch (err) {
      reject(err);
    }
  });

const resolve = promise =>
  promise.then(({ user, location }) =>
    routes.resolve({
      pathname: location.pathname,
      location,
      user,
      render,
    }),
  );

let promise;

auth.onAuthStateChanged(user => {
  if (!promise) {
    promise = Promise.resolve({ user, location: history.location });
    history.listen(location => {
      promise = resolve(promise.then(x => ({ ...x, location })));
    });
  }
  promise = resolve(promise.then(x => ({ ...x, user })));
});

registerServiceWorker();
