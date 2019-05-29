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
    const navBlock = document.querySelector('nav');

    const btnSearch = document.querySelector('button');
    btnSearch.addEventListener('click', async (event) => {
      query = document.querySelector('input').value;
      event.preventDefault();
      data = await model.getClips(query);
      reData = await model.getID(data);
      view.render(reData);
    });

    navBlock.addEventListener('click', async (event) => {
      const btnNext = document.querySelector('.next-btn');
      const btnPrev = document.querySelector('.prev-btn');

      const itemsList = document.querySelector('.wrapper ul');
      const translateX = itemsList.style.transform;
      const translateVal = translateX.slice(12);

      if (event.target === btnNext) {
        // eslint-disable-next-line no-plusplus
        counter++;
        if (counter % 3 === 0) {
          data = await model.getClips(query, token);
          token = data.nextPageToken;
          reData = await model.getID(data);
          view.render(reData);
        }

        if (!translateX) {
          const scroll = 100;
          AppView.changeSlide(scroll, counter);
        } else {
          const toScroll = parseInt(translateVal, 0) + 100;
          AppView.changeSlide(toScroll, counter);
        }
      }

      if (event.target === btnPrev) {
        // eslint-disable-next-line no-plusplus
        counter--;
        if (!translateX) return;
        const toScroll = parseInt(translateVal, 0) - 100;
        AppView.changeSlide(toScroll, counter);
      }
    });

    const itemsBox = document.querySelector('.wrapper ul');
    itemsBox.addEventListener('mousedown', () => {
      document.addEventListener('mousemove', AppView.move);
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', AppView.move);
      });
    });
  }
}
