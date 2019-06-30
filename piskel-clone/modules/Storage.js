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
    this.fpsButton = document.querySelector('.preview_input-range input');
    this.colorPrimary = document.querySelector('.wrap_color-section button:first-child');
    this.colorSecondary = document.querySelector('.wrap_color-section button:nth-child(2)');
  }

  logic() {
    const renewalData = () => {
      const storeObj = JSON.parse(localStorage.getItem('storeKey'));

      // fps restore
      this.preview.setFps(storeObj.fps);

      // color restore
      this.colorPrimary.style.backgroundColor = storeObj.colorPrimary;
      this.colorSecondary.style.backgroundColor = storeObj.colorSecondary;
      this.tools.setColor();
    };

    window.onload = () => {
      this.frames = new Frames();
      this.frames.logic();

      this.preview = new Preview();
      this.preview.initAnimation();

      this.tools = new Tools();
      this.tools.logic();

      if (localStorage.getItem('storeKey')) renewalData();
    };

    if (localStorage.getItem('storeKey')) {
      // frames restore
      this.putFrames();
    }

    window.addEventListener('beforeunload', () => {
      this.framesStore();
      this.fps();
      this.color();

      const storeObj = JSON.stringify(this.store);
      localStorage.setItem('storeKey', storeObj);
    });
  }

  color() {
    this.store.colorPrimary = this.colorPrimary.style.backgroundColor;
    this.store.colorSecondary = this.colorSecondary.style.backgroundColor;
  }

  fps() {
    this.store.fps = this.fpsButton.value;
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
  }

  putFrames() {
    const storeObj = JSON.parse(localStorage.getItem('storeKey'));
    const framesStoreUl = storeObj.framesWrap;
    const frameslist = this.framesWrap;
    frameslist.innerHTML = framesStoreUl;

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
