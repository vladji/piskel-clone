import AppModel from '../models/AppModel';
import AppView from '../views/View';

export default class App {
  constructor() {
    this.url = {
      url: 'https://www.googleapis.com/youtube/v3/search?&key=AIzaSyCTWC75i70moJLzyNh3tt4jzCljZcRkU8Y&type=video&part=snippet&maxResults=15&q=',
    };
    this.scroll = 0;
  }

  async start() {
    const model = new AppModel(this.url);
    let data = await model.getClips();
    let reData = await model.getID(data);

    const view = new AppView(reData);
    view.render();

    let translate = this.scroll;
    let counter = 0;

    const btnSearch = document.querySelector('button');
    btnSearch.addEventListener('click', async (event) => {
      const query = document.querySelector('input').value;
      event.preventDefault();
      data = await model.getClips(query);
      reData = await model.getID(data);
      view.render(reData);

      translate = this.scroll;
      const itemsList = document.querySelector('.wrapper ul');
      itemsList.style.cssText = `transform: translateX(-${translate}%);`;
    });

    const btnNext = document.querySelector('.next-btn');
    btnNext.addEventListener('click', () => {
      // eslint-disable-next-line no-plusplus
      translate += 100;
      // eslint-disable-next-line no-plusplus
      counter++;
      AppView.nextSlide(translate, counter);
    });

    const btnPrev = document.querySelector('.prev-btn');
    btnPrev.addEventListener('click', () => {
      // eslint-disable-next-line no-plusplus
      translate -= 100;
      // eslint-disable-next-line no-plusplus
      counter--;
      AppView.nextSlide(translate);
    });

    const itemsBox = document.querySelector('.wrapper ul');
    itemsBox.addEventListener('mousedown', () => {
      // const coords = AppView.getCoords(itemsBox);

      document.addEventListener('mousemove', AppView.move);

      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', AppView.move);
      });
    });
  }
}
