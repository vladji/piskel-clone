import firebase from './firebaseConfig';
import showUserData from './View/showUserData';

function logOut(btn) {
  btn.addEventListener('click', () => {
    firebase.auth().signOut();

    const logInBtn = document.querySelector('.log-in');
    const authInner = document.querySelector('.auth-inner');
    authInner.remove();
    logInBtn.hidden = false;
  });
}

function logIn() {
  const logInBtn = document.querySelector('.log-in');
  logInBtn.hidden = false;

  logInBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((res) => {
        const userName = res.user.displayName;
        const userPic = res.additionalUserInfo.profile.picture;
        const logOutBtn = showUserData(userName, userPic);
        logOut(logOutBtn);
      });
  });
}

export default function googleAuthInit() {
  firebase.auth().onAuthStateChanged((user) => {
    const authInner = document.querySelector('.auth-inner');
    if (user && !authInner) {
      const userName = user.displayName;
      const userPic = user.photoURL;
      const logOutBtn = showUserData(userName, userPic);
      logOut(logOutBtn);
    } else if (!user) {
      logIn();
    }
  });
}
