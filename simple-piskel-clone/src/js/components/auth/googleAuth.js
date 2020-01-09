
import firebase from './firebaseConfig';
import showUserData from './View/showUserData';

export default function loginEvents() {
  const logInBtn = document.querySelector('.log-in');

  logInBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((res) => {
        showUserData(res.user.displayName, res.additionalUserInfo.profile.picture);
      });
  });
}
