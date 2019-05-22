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
      form.innerHTML = '<form action=""><input type="text" value=""><button>SEND</button></form>';
      document.body.appendChild(form);
    }

    let content = document.querySelector('ul');
    if (!content) {
      content = document.createElement('ul');
      const liArr = new Array(titles.length).join('<li></li>');
      content.innerHTML = liArr;
      document.body.appendChild(content);
    }

    const itemsList = document.getElementsByTagName('LI');
    // eslint-disable-next-line no-restricted-syntax
    for (const i of itemsList) {
      const desStr = descriptions[0].slice(0, 161);
      i.innerHTML = `<div>${titles[0]}</div><div>${desStr}</div><div>${channel[0]}</div><div>${published[0]}</div><div>${clipStatistics[0]}</div>`;
      i.style = `background: url("${pics[0]}") center top no-repeat`;
      titles.splice(0, 1);
      pics.splice(0, 1);
      descriptions.splice(0, 1);
      channel.splice(0, 1);
      published.splice(0, 1);
      clipStatistics.splice(0, 1);
    }
  }
}
