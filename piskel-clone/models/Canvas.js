import Frames from './Frames';

export default class Canvas {
  constructor() {
    this.canvasDraw = document.getElementById('canvas');
    this.contextCanvas = this.canvasDraw.getContext('2d');
    this.canvasData = null;
    this.contextFrame = null;
  }

  prepareData() {
    let currentFrame = Frames.getFrame();
    if (!currentFrame) currentFrame = document.querySelector('.frame-unit');
    const ctxFrame = currentFrame.getContext('2d');
    this.contextFrame = ctxFrame;
  }

  penToolDefault(evt) {
    const canvas = this.canvasDraw;
    const ctxCanvas = this.contextCanvas;

    if (canvas.getContext) {
      const moveX = Math.round((evt.pageX - canvas.offsetLeft) / 20) * 20 - 10;
      const moveY = Math.round((evt.pageY - canvas.offsetTop) / 20) * 20 - 10;

      ctxCanvas.fillRect(moveX, moveY, 20, 20);

      this.canvasData = ctxCanvas.getImageData(0, 0, canvas.width, canvas.height);
      this.contextFrame.putImageData(this.canvasData, 0, 0);
    }
  }
}
