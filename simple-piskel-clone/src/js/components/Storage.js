export default class Storage {
  constructor() {
    this.store = {};
    this.canvas = document.querySelector('#canvas');
    this.framesWrap = document.querySelector('.frames-list');
    this.fpsButton = document.querySelector('.preview_input-range input');
  }

  loadSession(preview, tools, canvasSize) {
    const storeLoad = JSON.parse(localStorage.getItem('piskel-session-store'));

    this.putCanvas(storeLoad);
    this.putFrames(storeLoad);
    preview.setFps(storeLoad.fps);

    const thickBtn = document.querySelector(`[data-thick-id="${storeLoad.currentThick}"]`);
    tools.activeThick(thickBtn);

    const toolBtn = document.querySelector(`[data-tool-type="${storeLoad.currentTool}"]`);
    tools.activeTool(toolBtn);

    tools.initColor(storeLoad.colorPrimary, storeLoad.colorSecondary);

    const sizeBtn = document.querySelector(`[data-pen-var="${storeLoad.currentSize}"]`);
    canvasSize.activeSize(sizeBtn);
  }

  saveSession() {
    window.addEventListener('beforeunload', () => {
      this.grabCanvas();
      this.grabFrames();
      this.fps();
      this.currentThick();
      this.currentTool();
      this.color();
      this.currentSize();

      localStorage.setItem('piskel-session-store', JSON.stringify(this.store));
    });
  }

  currentSize() {
    const currentSize = document.querySelector('.active-canvas-size').dataset.penVar;
    this.store.currentSize = currentSize;
  }

  currentThick() {
    const currentThick = document.querySelector('.active-thick').dataset.thickId;
    this.store.currentThick = currentThick;
  }

  currentTool() {
    const currentTool = document.querySelector('.active-tool').dataset.toolType;
    this.store.currentTool = currentTool;
  }

  color() {
    const colorPrimary = document.querySelector('.color-tools__select:first-child');
    const colorSecondary = document.querySelector('.color-tools__select:nth-child(2)');

    this.store.colorPrimary = colorPrimary.value;
    this.store.colorSecondary = colorSecondary.value;
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
