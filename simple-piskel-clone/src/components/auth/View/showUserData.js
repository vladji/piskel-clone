export default function showUserData(userName, userPic) {
  const logInBtn = document.querySelector('.log-in');
  logInBtn.hidden = true;

  const displayBlock = document.querySelector('.auth-block');
  const div = document.createElement('div');
  div.classList.add('auth-inner');

  const infoMarkup = `
    <div class="user-info">
      <p>Hello, ${userName}</p>
      <img src="${userPic}" alt="avatar ${userName}">
    </div>
  `;

  div.innerHTML = infoMarkup;
  displayBlock.append(div);

  const logOutBtn = document.querySelector('.log-out');
  return logOutBtn;
}
