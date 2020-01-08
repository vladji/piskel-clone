import firebase from './firebaseConfig';
import modalDialog from './View/modalDialog';

function logIn(email, pass) {
  firebase.auth().signInWithEmailAndPassword(email, pass);
}

function signIn(email, pass) {
  firebase.auth().createUserWithEmailAndPassword(email, pass);
}

export default function loginEvents() {
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.log-in')) modalDialog();
    if (e.target.closest('.modal-close-btn')) {
      document.querySelector('.modal-box').remove();
    }
    if (e.target.closest('.modal_log-in')) {
      const emailField = document.querySelector('.input-email');
      const passField = document.querySelector('.input-pass');
      logIn(emailField.value, passField.value);
    }
    if (e.target.closest('.modal_sign-in')) {
      const emailField = document.querySelector('.input-email');
      const passField = document.querySelector('.input-pass');
      signIn(emailField.value, passField.value);
    }
  });
}

// firebase.auth().onAuthStateChanged((user) => {
//   if (user) {
//     console.log('name', user.displayName);
//   } else {
//     console.log('not exist');
//   }
// });
