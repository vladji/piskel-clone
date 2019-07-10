import Preview from './Preview';

export default class CanvasSize {
  constructor() {
    this.canvasDraw = document.getElementById('canvas');
    this.canvasDraft = document.createElement('canvas');
    this.thicknessTools = document.querySelectorAll('.thickness-tool li');
    this.wrapSizeBtn = document.querySelector('.wrap_size-btn');
    this.defaultSizeBtn = document.querySelector('.large-canvas').className;
    this.stateBuffer = [this.defaultSizeBtn];
    this.redrawStateBuffer = [];
    this.logic();
  }

  logic() {
    let sizeBtn = this.defaultSizeBtn;
    if (localStorage.getItem('storeKey')) {
      const storeObj = JSON.parse(localStorage.getItem('storeKey'));
      this.stateBuffer = [storeObj.currentSize];
      sizeBtn = storeObj.currentSize;
    }

    this.activeSize(sizeBtn);
    this.chooseSize();

    const startSizeBtn = document.querySelector('.large-canvas');
    this.recalcThick(startSizeBtn);
  }

  chooseSize() {
    this.wrapSizeBtn.addEventListener('click', (e) => {
      if (e.target.closest('button')) {
        const target = e.target.className;
        this.activeSize(target);
      }
    });
  }

  activeSize(sizeBtn) {
    this.stateBuffer.push(sizeBtn);
    this.redrawStateBuffer = this.stateBuffer.slice(0, this.stateBuffer.length);

    const prevState = this.stateBuffer.shift();
    const prevSize = document.querySelector(`.${prevState}`);
    prevSize.style.border = '2px solid #a7a79d';

    const currentState = this.stateBuffer[0];
    const currentSize = document.querySelector(`.${currentState}`);
    currentSize.style.border = '2px solid #ffed15';

    if (prevState !== currentState) this.recalcThick(currentSize);
  }

  recalcThick(currentSize) {
    const thickVar = currentSize.dataset.penSize;

    for (let i = 0; i < this.thicknessTools.length; i += 1) {
      const resizeThick = (i + 1) * thickVar;
      this.thicknessTools[i].dataset.thick = resizeThick;
    }

    const currentThickBtn = document.querySelector('.thickness-tool li[style*="rgb(255, 237, 21)"]');
    window.prepareCanvas(null, currentThickBtn.dataset.thick);

    this.redrawCanvas();
  }

  redrawCanvas() {
    const buffer = this.redrawStateBuffer;
    const nextVar = buffer.pop();
    const presentVar = buffer.pop();
    const nextBtn = document.querySelector(`.${nextVar}`);
    const presentBtn = document.querySelector(`.${presentVar}`);
    const nextSize = nextBtn.dataset.penSize;
    const presentSize = presentBtn.dataset.penSize;

    const scaleValue = nextSize / presentSize;
    const canvas = this.canvasDraw;

    const redraw = (unit) => {
      const tempCanvas = this.canvasDraft;
      tempCanvas.width = unit.width;
      tempCanvas.height = unit.height;
      const tmpCanvCtx = tempCanvas.getContext('2d');
      tmpCanvCtx.imageSmoothingEnabled = false;
      tmpCanvCtx.webkitImageSmoothingEnabled = false;
      tmpCanvCtx.mozImageSmoothingEnabled = false;
      tmpCanvCtx.scale(scaleValue, scaleValue);

      tmpCanvCtx.drawImage(unit, 0, 0);

      const canvCtx = unit.getContext('2d');
      canvCtx.clearRect(0, 0, unit.width, unit.height);
      canvCtx.drawImage(tempCanvas, 0, 0);
    };

    redraw(canvas);

    const framesCanvas = document.querySelectorAll('.frames-list canvas');
    for (let i = 0; i < framesCanvas.length; i += 1) {
      redraw(framesCanvas[i]);
    }

    Preview.setSlides();
  }
}
