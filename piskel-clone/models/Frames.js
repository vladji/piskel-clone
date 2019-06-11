// import Canvas from './Canvas';

export default class Frames {
  constructor() {
    this.canvasDraw = document.getElementById('canvas');
    this.framesBlock = document.querySelector('#frames-block');
    this.currentFrame = null;
  }

  logic() {
    const framesWrap = this.framesBlock;

    framesWrap.addEventListener('click', (e) => {
      if (e.target.closest('.frames-list')) Frames.pickFrame(e);
      if (e.target.closest('.add-frame')) Frames.clearFrameDraw();
    });
  }

  static pickFrame(e) {
    const targetFrame = e.target;
    this.currentFrame = targetFrame;
  }

  static frame() {
    return this.currentFrame;
  }

  static clearFrameDraw() {
    const ctxCanvas = this.canvasDraw.getContext('2d');
    ctxCanvas.clearRect(0, 0, this.canvasDraw.width, this.canvasDraw.height);
    ctxCanvas.beginPath();
  }
}
