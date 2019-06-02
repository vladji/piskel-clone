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

    const nav = document.querySelector('nav');
    const btnSearch = document.querySelector('button');

    btnSearch.addEventListener('click', async (event) => {
      query = document.querySelector('input').value;
      event.preventDefault();
      data = await model.getClips(query);
      reData = await model.getID(data);
      const list = document.querySelector('.wrapper ul');
      list.remove();
      counter = 0;
      view.render(reData);
    });

    nav.addEventListener('click', async (event) => {
      const toScroll = 100;

      const btnNext = document.querySelector('.next-btn');
      const btnPrev = document.querySelector('.prev-btn');

      const anchorLi = document.querySelector('.wrapper li:nth-last-child(5)');
      const uploadInit = anchorLi.getBoundingClientRect().x;

      if (uploadInit < 2000) {
        data = await model.getClips(query, token);
        token = data.nextPageToken;
        reData = await model.getID(data);
        view.render(reData);
      }

      if (event.target === btnNext) {
        // eslint-disable-next-line no-plusplus
        counter++;
        // toScroll *= counter;
        AppView.changeSlide(toScroll, counter);
      }

      if (event.target === btnPrev) {
        if (counter === 0) return;
        // eslint-disable-next-line no-plusplus
        counter--;
        // toScroll *= counter;
        AppView.changeSlide(-toScroll, counter);
      }
    });

    let list = null;
    let touchDown = null;
    document.addEventListener('mousedown', (e) => {
      list = document.querySelector('.wrapper ul');
      const translateX = list.style.transform;
      const translateVal = translateX.slice(12);
      const scroll = parseInt(translateVal, 0);
      window.scroll = scroll;

      if (e.target.parentNode !== list) return;

      touchDown = e.clientX;
      window.touchDown = touchDown;

      list.onselectstart = () => false;

      list.addEventListener('mousemove', AppView.move);
    });

    const box = document.querySelector('.wrapper');
    box.addEventListener('mouseup', async (e) => {
      list.removeEventListener('mousemove', AppView.move);

      const touchUp = e.clientX;

      const anchorLi = document.querySelector('.wrapper li:nth-last-child(5)');
      const lastLi = document.querySelector('.wrapper li:last-child');
      const uploadInit = anchorLi.getBoundingClientRect().x;
      const uploadInitLast = lastLi.getBoundingClientRect().x;

      if (uploadInit < 2000 || uploadInitLast < 0) {
        data = await model.getClips(query, token);
        token = data.nextPageToken;
        reData = await model.getID(data);
        view.render(reData);
      }

      let deltaScroll = window.move - window.scroll;
      if (deltaScroll < 0) deltaScroll = 0 - deltaScroll;
      const bodyWidth = document.body.getBoundingClientRect().width;

      if (deltaScroll < 25) {
        if (bodyWidth > 1000) {
          deltaScroll = 25;
        } else if (bodyWidth < 1000 && bodyWidth > 768) {
          deltaScroll = 100;
        } else if (bodyWidth < 768 && bodyWidth > 540) {
          deltaScroll = 50;
        } else {
          deltaScroll = 100;
        }
      } else if (deltaScroll > 25 && deltaScroll < 50) {
        if (bodyWidth > 1000) {
          deltaScroll = 50;
        } else if (bodyWidth < 1000 && bodyWidth > 768) {
          deltaScroll = 100;
        } else if (bodyWidth < 768 && bodyWidth > 540) {
          deltaScroll = 50;
        } else {
          deltaScroll = 100;
        }
      } else if (deltaScroll > 50 && deltaScroll < 75) {
        if (bodyWidth > 1000) {
          deltaScroll = 75;
        } else if (bodyWidth < 1000 && bodyWidth > 768) {
          deltaScroll = 100;
        } else if (bodyWidth < 768 && bodyWidth > 540) {
          deltaScroll = 100;
        } else {
          deltaScroll = 100;
        }
      } else {
        deltaScroll = 100;
      }

      if (touchUp < touchDown) {
        // eslint-disable-next-line no-plusplus
        counter++;
        AppView.changeSlide(deltaScroll, counter);
      } else {
        // if (counter === 0) return;
        // eslint-disable-next-line no-plusplus
        counter--;
        AppView.changeSlide(-deltaScroll, counter);
      }
    });
  }
}
