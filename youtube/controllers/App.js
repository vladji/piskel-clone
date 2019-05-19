import AppModel from '../models/AppModel';
import AppView from '../views/View';

export default class App {
  constructor() {
    this.state = {
      url: 'https://www.googleapis.com/youtube/v3/search?id=7lCDEYXw3mM&key=AIzaSyAS9w1yvZmCgRJWvsv1AnOAPJ824eX0n18&type=video&part=snippet&maxResults=10&q=',
    };
  }

  async start() {
    const model = new AppModel(this.state);
    let data = await model.getClips();

    const view = new AppView(data);
    view.render();

    const btn = document.querySelector('button');
    btn.addEventListener('click', async (event) => {
      const query = document.querySelector('input').value;
      event.preventDefault();
      data = await model.getClips(query);
      view.render(data);
    });
  }
}
