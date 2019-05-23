export default class AppView {
  constructor(clips) {
    this.clips = clips;
  }

  render(data) {
    if (data) this.clips = data;
    const [titles, pics, descriptions, channel, published, clipStatistics] = this.clips;

    const checkForm = document.querySelector('div');
    if (!checkForm) {
      const form = document.createElement('div');
      form.classList.add('txt-center');
      form.innerHTML = '<form action=""><input class="search-box" type="text" value=""><button>SEND</button></form>';
      document.body.appendChild(form);
    }

    let content = document.querySelector('.wrapper');
    if (!content) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('wrapper');
      content = document.createElement('ul');
      wrapper.appendChild(content);
      const liArr = new Array(titles.length + 1).join('<li></li>');
      content.innerHTML = liArr;
      document.body.appendChild(wrapper);
    }

    const itemsList = document.querySelectorAll('.wrapper li');
    // eslint-disable-next-line no-restricted-syntax
    for (const i of itemsList) {
      const desStr = descriptions[0].slice(0, 161);
      i.innerHTML = `<div>${titles[0]}</div><div>${desStr}...</div><div>${channel[0]}</div><div>${published[0]}</div><div>${clipStatistics[0]}</div>`;
      i.style = `background: url("${pics[0]}") center top no-repeat`;
      titles.splice(0, 1);
      pics.splice(0, 1);
      descriptions.splice(0, 1);
      channel.splice(0, 1);
      published.splice(0, 1);
      clipStatistics.splice(0, 1);
    }
  }

  navBtn(count) {
    this.clips = count;
    let navBar = document.querySelector('nav');
    if (!navBar) {
      navBar = document.createElement('nav');
      navBar.innerHTML = '<ul><li class="prev-btn">&lt;&lt; Prev</li><li class="counter-page"></li><li class="nex-btn">Next >></li></ul>';
      document.body.appendChild(navBar);
    }
  }
}
