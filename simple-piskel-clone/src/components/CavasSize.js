import Preview from './Preview';

export default class CanvasSize {
  constructor(canvas) {
    this.canvas = canvas;
    this.canvasDraw = document.getElementById('canvas');
    this.canvasDraft = document.createElement('canvas');
    this.canvasManager = document.querySelector('.canvas-manager');
    this.thicknessTools = document.querySelectorAll('.thickness-tool li');
    this.listeners();
  }

  listeners() {
    this.canvasManager.addEventListener('click', (e) => {
      if (e.target.closest('[data-event]')) {
        const btn = e.target.closest('[data-event]');
        const btnEvent = btn.dataset.event;
        this[btnEvent](btn);
      }
    });
  }

  activeSize(btn) {
    this.prevBtnSize = document.querySelector('.active-canvas-size');
    if (this.prevBtnSize) this.prevBtnSize.classList.remove('active-canvas-size');

    btn.classList.add('active-canvas-size');
    this.newBtnSize = btn;

    this.recalcThick(btn);
    if (this.prevBtnSize) this.redrawCanvas();
  }

  recalcThick(btn) {
    const thickVar = btn.dataset.penVar;
    let INIT_THICK_VAL = 2;

    for (let i = 0; i < this.thicknessTools.length; i += 1) {
      INIT_THICK_VAL *= 2;
      const resize = INIT_THICK_VAL * thickVar;
      this.thicknessTools[i].dataset.thick = resize;
    }

    const currentThickBtn = document.querySelector('.active-thick');
    this.canvas.thick = currentThickBtn.dataset.thick;
  }

  redrawCanvas() {
    const newSize = this.newBtnSize.dataset.penVar;
    const prevSize = this.prevBtnSize.dataset.penVar;

    const scaleValue = newSize / prevSize;
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
