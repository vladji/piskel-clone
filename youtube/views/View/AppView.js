export default class AppView {
  constructor(clips) {
    this.clips = clips;
  }

  render(data) {
    const checkForm = document.querySelector('div');
    if (!checkForm) {
      const form = document.createElement('div');
      form.innerHTML = '<form action=""><input type="text" value=""><button>SEND</button></form>';
      document.body.appendChild(form);
    }

    if (data) this.clips = data;

    let ulTag = document.querySelector('ul');
    if (!ulTag) {
      const content = document.createElement('ul');
      document.body.appendChild(content);
      ulTag = content;
    }
    ulTag.innerHTML = this.clips.map(title => `<li>${title}</li>`).join('');
  }
}
