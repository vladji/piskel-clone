import AppModel from '../models/AppModel';
import AppView from '../views/View';

export default class App {
  constructor() {
    this.state = {
      url: 'https://www.googleapis.com/youtube/v3/search?&key=AIzaSyBlxA3nAtgqIAobnJHamtdMz3sTz1ud89A&type=video&part=snippet&maxResults=15&q=',
    };
  }

  async start() {
    const model = new AppModel(this.state);
    let data = await model.getClips();
    let reData = await model.getID(data);

    const view = new AppView(reData);
    view.render();
    view.navBtn();

    const btnSearch = document.querySelector('button');
    btnSearch.addEventListener('click', async (event) => {
      const query = document.querySelector('input').value;
      event.preventDefault();
      data = await model.getClips(query);
      reData = await model.getID(data);
      view.render(reData);
    });

    // const btnNext = document.querySelector('.prev-btn');
    // btnNext.addEventListener('click', () => {
    //   const items = document.querySelectorAll('.wrapper li');
    //   console.log(items);
    //   for (let key in items) {
    //     const coord = items[key].getBoundingClientRect();
    //     console.log(coord.x);
    //   }
    // });
  }
}
