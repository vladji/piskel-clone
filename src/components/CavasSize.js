export default class CanvasSize {
  constructor() {
    this.canvasDraw = document.getElementById('canvas');
    this.thicknessTools = document.querySelectorAll('.thickness-tool li');
    this.wrapSizeBtn = document.querySelector('.wrap_size-btn');
    this.defaultSizeBtn = document.querySelector('.large-canvas').className;
    this.stateBuffer = [this.defaultSizeBtn];
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
  }

  activeSize(sizeBtn) {
    this.stateBuffer.push(sizeBtn);

    const prevState = this.stateBuffer.shift();
    const prevSize = document.querySelector(`.${prevState}`);
    prevSize.style.border = '2px solid #a7a79d';

    const currentState = this.stateBuffer[0];
    const currentSize = document.querySelector(`.${currentState}`);
    currentSize.style.border = '2px solid #ffed15';

    this.recalcThick(currentSize);
  }

  chooseSize() {
    this.wrapSizeBtn.addEventListener('click', (e) => {
      if (e.target.closest('button')) {
        const target = e.target.className;
        this.activeSize(target);
      }
    });
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
    const canvas = this.canvasDraw;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    const tmpCanvCtx = tempCanvas.getContext('2d');
    const canvCtx = canvas.getContext('2d');
    // canvCtx.save();
    tmpCanvCtx.scale(2, 2);
    tmpCanvCtx.drawImage(canvas, 0, 0);
    tmpCanvCtx.scale(2, 2);
    // canvCtx.restore();
    // eslint-disable-next-line max-len
    // tmpCanvCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, canvas.width * 4, canvas.height * 4);

    canvCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvCtx.drawImage(tempCanvas, 0, 0);
  }
}
