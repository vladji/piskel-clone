import * as firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDBqfkUi0YAhO4KzKBXrQiCUFED0QCe9zo',
  authDomain: 'piskel-clone-4b7f9.firebaseapp.com',
  databaseURL: 'https://piskel-clone-4b7f9.firebaseio.com',
  projectId: 'piskel-clone-4b7f9',
  storageBucket: 'piskel-clone-4b7f9.appspot.com',
  messagingSenderId: '661881353534',
  appId: '1:661881353534:web:e0d0c3ac2cda554e61a86f',
  measurementId: 'G-Q1V3KVJV3V',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
