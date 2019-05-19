export default class AppView {
  constructor(clips) {
    this.clips = clips;
  }

  render() {
    const search = document.createElement('div');
    search.innerHTML = '<form action=""><input type="text" value=""><button>SEND</button></form>';
    document.body.appendChild(search);

    const content = document.createElement('ul');
    content.innerHTML = this.clips.map(title => `<li>${title}</li>`).join('');
    document.body.appendChild(content);
  }
}
