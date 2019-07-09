export default class CanvasSize {
  constructor() {
    this.canvasDraw = document.getElementById('canvas');
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
      sizeBtn = storeObj.canvasSize;
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

    // this.redrawCanvas();
  }

  redrawCanvas() {
    const canvas = this.canvasDraw;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // const wrap = document.querySelector('.canvas-wrapper');
    // wrap.appendChild(tempCanvas);

    const canvCtx = canvas.getContext('2d');
    let canvData = canvCtx.getImageData(0, 0, canvas.width, canvas.height);
    canvCtx.save();
    canvCtx.scale(2, 2);
    canvCtx.putImageData(canvData, 0, 0);
    canvData = canvCtx.getImageData(0, 0, canvas.width, canvas.height);

    const tmpCanvCtx = tempCanvas.getContext('2d');
    tmpCanvCtx.scale(2, 2);
    tmpCanvCtx.putImageData(canvData, 0, 0);

    // canvCtx.restore();
  }
}
