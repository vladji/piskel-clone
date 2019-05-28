import AppModel from '../models/AppModel';
import AppView from '../views/View';

export default class App {
  constructor() {
    this.url = {
      url: 'https://www.googleapis.com/youtube/v3/search?&key=AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y&type=video&part=snippet&maxResults=15&q=',
    };
  }

  async start() {
    const model = new AppModel(this.url);
    let data = await model.getClips();
    let token = data.nextPageToken;
    let reData = await model.getID(data);

    const view = new AppView(reData);
    view.render();

    let query = '';
    let counter = 0;

    const btnSearch = document.querySelector('button');
    btnSearch.addEventListener('click', async (event) => {
      query = document.querySelector('input').value;
      event.preventDefault();
      data = await model.getClips(query);
      reData = await model.getID(data);
      view.render(reData);
    });

    const btnNext = document.querySelector('.next-btn');
    btnNext.addEventListener('click', async () => {
      // eslint-disable-next-line no-plusplus
      counter++;
      if (counter > 3) {
        data = await model.getClips(query, token);
        token = data.nextPageToken;
        reData = await model.getID(data);
        view.render(reData);
      }

      const itemsList = document.querySelector('.wrapper ul');
      const tempVal = itemsList.style.transform;
      let liveScroll;

      if (!tempVal) {
        const scroll = 100;
        AppView.changeSlide(scroll, counter);
      } else {
        liveScroll = +tempVal.slice(12, -2) + 100;
        AppView.changeSlide(liveScroll, counter);
      }
    });

    const btnPrev = document.querySelector('.prev-btn');
    btnPrev.addEventListener('click', () => {
      const itemsList = document.querySelector('.wrapper ul');
      const tempVal = itemsList.style.transform;
      // eslint-disable-next-line no-plusplus
      counter--;
      if (!itemsList) return;
      const liveScroll = +tempVal.slice(12, -2) - 100;
      AppView.changeSlide(liveScroll, counter);
    });

    const itemsBox = document.querySelector('.wrapper ul');
    itemsBox.addEventListener('mousedown', () => {
      document.addEventListener('mousemove', AppView.move);
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', AppView.move);
      });
    });

    // if (counter == 3) {

    // }
  }
}
