export default class AppView {
  constructor(clips) {
    this.clips = clips;
  }

  static move(evt) {
    const list = document.querySelector('.wrapper ul');
    list.onselectstart = () => false;

    const bodyWidth = list.getBoundingClientRect().width;
    const getPercentWidth = 100 / bodyWidth;
    const mouseMove = window.touchDown - evt.pageX;
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(window.scroll)) { window.scroll = 0; }
    const move = (mouseMove * getPercentWidth) + window.scroll;
    window.move = move;
    list.style.cssText = `transform: translateX(-${move}%);`;
  }

  static actualResize(scroll, counter) {
    const bodyWidth = document.body.getBoundingClientRect().width;
    const itemsList = document.querySelector('.wrapper ul');

    if (bodyWidth > 1000) {
      itemsList.style.cssText = `transform: translateX(-${scroll}%);`;
    }

    if (bodyWidth < 1000 && bodyWidth > 768) {
      let trans = scroll;
      trans += 33 * counter;
      itemsList.style.cssText = `transform: translateX(-${trans}%);`;
    }

    if (bodyWidth < 768 && bodyWidth > 540) {
      let trans = scroll;
      trans += 100 * counter;
      itemsList.style.cssText = `transform: translateX(-${trans}%);`;
    }

    if (bodyWidth < 540) {
      let trans = scroll;
      trans += 300 * counter;
      itemsList.style.cssText = `transform: translateX(-${trans}%);`;
    }
  }

  static changeSlide(toScroll, counter) {
    const list = document.querySelector('.wrapper ul');
    let pageScroll = window.scroll;
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(pageScroll)) { pageScroll = 0; }
    // eslint-disable-next-line no-restricted-globals
    const scr = pageScroll + toScroll;

    list.style.cssText = `transform: translateX(-${scr}%);`;

    window.addEventListener('resize', () => {
      let resizeTimeout;
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(() => {
          resizeTimeout = null;
          AppView.actualResize(scr, counter);
        }, 500);
      }
    }, false);
  }

  render(data) {
    if (data) this.clips = data;
    const [titles, pics, descriptions, channel, published, clipStatistics] = this.clips;

    let wrapper = document.querySelector('.wrapper');
    if (!wrapper) {
      const form = document.createElement('div');
      form.classList.add('txt-center');
      form.innerHTML = '<form action=""><input class="search-box" type="text" value=""><button>SEND</button></form>';
      document.body.appendChild(form);

      wrapper = document.createElement('div');
      wrapper.classList.add('wrapper');
      document.body.appendChild(wrapper);

      const navBar = document.createElement('nav');
      navBar.innerHTML = '<ul><li class="prev-btn">&lt;&lt; Prev</li><li class="counter-page"></li><li class="next-btn">Next >></li></ul>';
      document.body.appendChild(navBar);
    }

    const chekContent = document.querySelector('.wrapper ul');
    if (!chekContent) {
      const content = document.createElement('ul');
      wrapper.appendChild(content);
      window.content = content;
    }

    let itemList = '';
    while (titles.length) {
      const desStr = descriptions[0].slice(0, 85);
      const item = `<li style="background: url('${pics[0]}') center top no-repeat;"><div>${titles[0]}</div><div>${desStr}...</div><div>${channel[0]}</div><div>${published[0]}</div><div>${clipStatistics[0]}</div></li>`;
      itemList += item;
      titles.splice(0, 1);
      pics.splice(0, 1);
      descriptions.splice(0, 1);
      channel.splice(0, 1);
      published.splice(0, 1);
      clipStatistics.splice(0, 1);
    }

    window.content.insertAdjacentHTML('beforeEnd', itemList);
  }
}
