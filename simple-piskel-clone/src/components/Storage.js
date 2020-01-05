export default class Storage {
  constructor() {
    this.store = {};
    this.canvas = document.querySelector('#canvas');
    this.framesWrap = document.querySelector('.frames-list');
    this.fpsButton = document.querySelector('.preview_input-range input');
    this.colorPrimary = document.querySelector('.wrap_color-section button:first-child');
    this.colorSecondary = document.querySelector('.wrap_color-section button:nth-child(2)');
    this.thicknessTools = document.querySelector('.thickness-tool');
    this.thickBtns = document.querySelectorAll('.thickness-tool li');
    this.sizeService = document.querySelector('.wrap_size-btn');
  }

  loadSession(frames, preview, tools) {
    console.log('load frames', frames);
    const storeLoad = JSON.parse(localStorage.getItem('piskel-session-store'));

    this.putCanvas(storeLoad);
    this.putFrames(storeLoad);
    preview.setFps(storeLoad.fps);

    // color restore
    this.colorPrimary.style.backgroundColor = storeLoad.colorPrimary;
    this.colorSecondary.style.backgroundColor = storeLoad.colorSecondary;
    tools.setColor();

    const currentBtn = storeLoad.currentThickBtn;
    const thickness = storeLoad.currentThickness;
    tools.activeThick(currentBtn, thickness);

    // recalc thickness-tbn value
    for (let i = 0; i < this.thickBtns.length; i += 1) {
      const size = storeLoad.thickBuffer.shift();
      this.thickBtns[i].dataset.thick = size;
    }
  }

  saveSession() {
    window.addEventListener('beforeunload', () => {
      this.grabCanvas();
      this.grabFrames();
      this.fps();
      this.color();
      this.currentThick();
      this.currentSize();

      localStorage.setItem('piskel-session-store', JSON.stringify(this.store));
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
    this.store.canvasData = this.canvas.toDataURL();
  }

  putCanvas(storeLoad) {
    const canvasCtx = this.canvas.getContext('2d');
    const imageData = storeLoad.canvasData;
    const image = new Image();
    image.onload = () => {
      canvasCtx.drawImage(image, 0, 0);
    };
    image.src = imageData;
  }

  grabFrames() {
    const framesCanvases = document.querySelectorAll('.frames-list canvas');
    const framesData = [];

    for (let i = 0; i < framesCanvases.length; i += 1) {
      framesData.push(framesCanvases[i].toDataURL());
    }

    const framesMarkup = this.framesWrap.innerHTML;
    this.store.framesMarkup = framesMarkup;
    this.store.framesData = framesData;
  }

  putFrames(storeLoad) {
    const framesHTML = storeLoad.framesMarkup;
    this.framesWrap.innerHTML = framesHTML;

    const imageData = storeLoad.framesData;
    const framesCanvases = document.querySelectorAll('.frames-list canvas');

    for (let i = 0; i < framesCanvases.length; i += 1) {
      const frameCtx = framesCanvases[i].getContext('2d');
      const image = new Image();
      image.onload = () => {
        frameCtx.drawImage(image, 0, 0);
      };
      image.src = imageData[i];
    }
  }
}
