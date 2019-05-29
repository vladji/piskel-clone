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
      let trans2 = scroll;
      trans2 += 33 * counter;
      itemsList.style.cssText = `transform: translateX(-${trans2}%);`;
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
  }

  static changeSlide(scroll, counter) {
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

    const chekContent = document.querySelector('.wrapper');
    if (!chekContent) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('wrapper');
      const content = document.createElement('ul');
      document.body.appendChild(wrapper);
      wrapper.appendChild(content);

      const navBar = document.createElement('nav');
      navBar.innerHTML = '<ul><li class="prev-btn">&lt;&lt; Prev</li><li class="counter-page"></li><li class="next-btn">Next >></li></ul>';
      document.body.appendChild(navBar);
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
    // const liArr = new Array(titles.length + 1).join('<li></li>');
    // content.appendChild(liArr);

    // const itemsList = document.querySelectorAll('.wrapper li');

    // for (const i of itemsList) {
    //   const desStr = descriptions[0].slice(0, 85);
    //   i.innerHTML = `<div>${titles[0]}</div><div>${desStr}...</div><div>${channel[0]}
    // </div><div>${published[0]}</div><div>${clipStatistics[0]}</div>`;
    //   i.style = `background: url("${pics[0]}") center top no-repeat`;
    //   titles.splice(0, 1);
    //   pics.splice(0, 1);
    //   descriptions.splice(0, 1);
    //   channel.splice(0, 1);
    //   published.splice(0, 1);
    //   clipStatistics.splice(0, 1);
    // }
  }

  static getCoords(elem) {
    const box = elem.getBoundingClientRect();
    return {
      left: box.left,
    };
  }
}
