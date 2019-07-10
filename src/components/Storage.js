import Frames from './Frames';
import Preview from './Preview';
import Tools from './Tools';
import CanvasSize from './CavasSize';

export default class Storage {
  constructor() {
    this.frames = null;
    this.preview = null;
    this.tools = null;
    this.canvasSize = null;
    this.store = {};
    this.canvasWrap = document.querySelector('.canvas-wrapper');
    this.framesWrap = document.querySelector('.frames-list');
    this.fpsButton = document.querySelector('.preview_input-range input');
    this.colorPrimary = document.querySelector('.wrap_color-section button:first-child');
    this.colorSecondary = document.querySelector('.wrap_color-section button:nth-child(2)');
    this.thicknessTools = document.querySelector('.thickness-tool');
    this.thickBtns = document.querySelectorAll('.thickness-tool li');
    this.sizeService = document.querySelector('.wrap_size-btn');
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

      // active thickness restore
      const currentBtn = storeObj.currentThickBtn;
      const thickness = storeObj.currentThickness;
      this.tools.activeThick(currentBtn, thickness);

      // recalc thickness-tbn value
      for (let i = 0; i < this.thickBtns.length; i += 1) {
        const size = storeObj.thickBuffer.shift();
        this.thickBtns[i].dataset.thick = size;
      }
    };

    window.addEventListener('load', () => {
      this.frames = new Frames();
      this.frames.logic();

      this.preview = new Preview();
      this.preview.initAnimation();

      this.tools = new Tools();
      this.tools.logic();

      this.canvasSize = new CanvasSize();

      if (localStorage.getItem('storeKey')) renewalData();
    });

    if (localStorage.getItem('storeKey')) {
      // frames restore
      this.putCanvas();
      this.putFrames();
    }

    window.addEventListener('beforeunload', () => {
      this.grabCanvas();
      this.grabFrames();
      this.fps();
      this.color();
      this.currentThick();
      this.currentSize();

      const storeObj = JSON.stringify(this.store);
      localStorage.setItem('storeKey', storeObj);
    });
  }

  currentSize() {
    const currentSizeBtn = this.sizeService.querySelector('button[style*="rgb(255, 237, 21)"]');
    this.store.currentSize = currentSizeBtn.className;

    const thickBuffer = [];
    for (let i = 0; i < this.thickBtns.length; i += 1) {
      thickBuffer.push(this.thickBtns[i].dataset.thick);
    }

    this.store.thickBuffer = thickBuffer;
  }

  currentThick() {
    const currentBtn = this.thicknessTools.querySelector('li[style*="rgb(255, 237, 21)"]');
    const currentBtnClass = currentBtn.className;
    const currentThickness = currentBtn.dataset.thick;

    this.store.currentThickBtn = currentBtnClass;
    this.store.currentThickness = currentThickness;
  }

  color() {
    const colorPrimary = document.querySelector('.wrap_color-section button:first-child');
    const colorSecondary = document.querySelector('.wrap_color-section button:nth-child(2)');

    this.store.colorPrimary = colorPrimary.style.backgroundColor;
    this.store.colorSecondary = colorSecondary.style.backgroundColor;
  }

  fps() {
    this.store.fps = this.fpsButton.value;
  }

  grabCanvas() {
    this.canvasWrap = document.querySelector('.canvas-wrapper');
    this.store.canvasDraw = this.canvasWrap.innerHTML;
  }

  putCanvas() {
    const storeObj = JSON.parse(localStorage.getItem('storeKey'));
    this.canvasWrap.innerHTML = storeObj.canvasDraw;
  }

  grabFrames() {
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
