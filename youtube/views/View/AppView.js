export default class AppView {
  constructor(clips) {
    this.clips = clips;
  }

  static move(evt) {
    const itemsBox = document.querySelector('.wrapper ul');
    itemsBox.style.cssText = `transform: translateX(-${evt.pageX}px);`;
  }

  static actualResize(scroll, counter) {
    const bodyWidth = document.body.getBoundingClientRect().width;
    const itemsList = document.querySelector('.wrapper ul');


    if (bodyWidth > 1000) {
      itemsList.style.cssText = `transform: translateX(-${scroll}%);`;
    }

    if (bodyWidth < 1000 && bodyWidth > 768) {
      let trans1 = scroll;
      trans1 += 33 * counter;
      itemsList.style.cssText = `transform: translateX(-${trans1}%);`;
    }

    if (bodyWidth < 768 && bodyWidth > 540) {
      let trans2 = scroll;
      trans2 += 100 * counter;
      itemsList.style.cssText = `transform: translateX(-${trans2}%);`;
    }

    if (bodyWidth < 540) {
      let trans3 = scroll;
      trans3 += 300 * counter;
      itemsList.style.cssText = `transform: translateX(-${trans3}%);`;
    }

    // let currentScroll = itemsList.style.transform;
    // console.log(currentScroll);
    // const btnNext = document.querySelector('.next-btn');
    // btnNext.addEventListener('click', () => {
    //   // eslint-disable-next-line no-plusplus
    //   // eslint-disable-next-line no-param-reassign
    //   counter++;
    //   currentScroll += 100;
    //   AppView.nextSlide(currentScroll, counter);
    // });
  }

  static nextSlide(scroll, counter) {
    // const bodyWidth = document.body.getBoundingClientRect().width;
    // let trans = scroll;
    const itemsList = document.querySelector('.wrapper ul');
    const lastItem = document.querySelector('.wrapper li:last-child');

    if (lastItem.getBoundingClientRect().x > document.body.getBoundingClientRect().width) {
      itemsList.style.cssText = `transform: translateX(-${scroll}%);`;
    }

    window.addEventListener('resize', () => {
      let resizeTimeout;
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(() => {
          resizeTimeout = null;
          AppView.actualResize(scroll, counter);
        }, 66);
      }
    }, false);
  }

  render(data) {
    if (data) this.clips = data;
    const [titles, pics, descriptions, channel, published, clipStatistics] = this.clips;

    const checkForm = document.querySelector('div');
    if (!checkForm) {
      const form = document.createElement('div');
      form.classList.add('txt-center');
      form.innerHTML = '<form action=""><input class="search-box" type="text" value=""><button>SEND</button></form>';
      document.body.appendChild(form);
    }

    let content = document.querySelector('.wrapper');
    if (!content) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('wrapper');
      content = document.createElement('ul');
      wrapper.appendChild(content);

      const liArr = new Array(titles.length + 1).join('<li></li>');
      content.innerHTML = liArr;
      document.body.appendChild(wrapper);

      const navBar = document.createElement('nav');
      navBar.innerHTML = '<ul><li class="prev-btn">&lt;&lt; Prev</li><li class="counter-page"></li><li class="next-btn">Next >></li></ul>';
      document.body.appendChild(navBar);
    }

    const itemsList = document.querySelectorAll('.wrapper li');
    // eslint-disable-next-line no-restricted-syntax
    for (const i of itemsList) {
      const desStr = descriptions[0].slice(0, 85);
      i.innerHTML = `<div>${titles[0]}</div><div>${desStr}...</div><div>${channel[0]}</div><div>${published[0]}</div><div>${clipStatistics[0]}</div>`;
      i.style = `background: url("${pics[0]}") center top no-repeat`;
      titles.splice(0, 1);
      pics.splice(0, 1);
      descriptions.splice(0, 1);
      channel.splice(0, 1);
      published.splice(0, 1);
      clipStatistics.splice(0, 1);
    }
  }

  static getCoords(elem) {
    const box = elem.getBoundingClientRect();
    return {
      left: box.left,
    };
  }
}
