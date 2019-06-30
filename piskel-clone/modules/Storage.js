import Frames from './Frames';
import Preview from './Preview';
import Tools from './Tools';

export default class Storage {
  constructor() {
    this.frames = null;
    this.preview = null;
    this.tools = null;
    this.store = {};
    this.framesWrap = document.querySelector('.frames-list');
  }

  logic() {
    window.onload = () => {
      this.frames = new Frames();
      this.frames.logic();

      this.preview = new Preview();
      this.preview.initAnimation();

      this.tools = new Tools();
      this.tools.logic();
    };

    if (localStorage.getItem('storeKey')) {
      this.putImage();
    }

    window.addEventListener('beforeunload', () => {
      this.framesStore();
    });
  }

  framesStore() {
    const canvasList = document.querySelectorAll('.frames-list canvas');
    const framesData = [];

    for (let i = 0; i < canvasList.length; i += 1) {
      const frame = canvasList[i];
      framesData.push(frame.toDataURL());
    }

    const framesWrap = document.querySelector('.frames-list ul');
    this.store.framesWrap = framesWrap.outerHTML;
    this.store.framesData = framesData;

    const storeObj = JSON.stringify(this.store);
    localStorage.setItem('storeKey', storeObj);
  }

  putImage() {
    const storeObj = JSON.parse(localStorage.getItem('storeKey'));
    const framesStoreUl = storeObj.framesWrap;
    const frameslist = this.framesWrap;
    frameslist.innerHTML = framesStoreUl;

    // const lookActiveFrame = document.querySelector('.frames-list li[style*="border"]');
    // if (lookActiveFrame) lookActiveFrame.style = '';

    const images = storeObj.framesData;
    const canvasList = document.querySelectorAll('.frames-list canvas');

    for (let i = 0; i < images.length; i += 1) {
      const currentCtx = canvasList[i].getContext('2d');
      const image = new Image();
      image.onload = () => {
        currentCtx.drawImage(image, 0, 0);
      };
      image.src = images[i];
    }
  }
}
