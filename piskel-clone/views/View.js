export default class View {
  constructor() {
    // this.state = document.querySelector('body');
    this.body = null;
  }

  logic() {
    this.body = document.querySelector('body');
  }

  static actualState(state) {
    const elem = document.querySelector(`.${state}`);
    elem.style.border = '2px solid #ffed15';
  }
}
