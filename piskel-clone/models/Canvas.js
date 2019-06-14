import Frames from './Frames';

export default class Canvas {
  constructor() {
    this.canvasDraw = document.getElementById('canvas');
    this.contextCanvas = this.canvasDraw.getContext('2d');
    this.canvasData = null;
    this.contextFrame = null;
    this.frameData = null;
  }

  prepareData() {
    let currentFrame = Frames.getFrame();
    if (!currentFrame) currentFrame = document.querySelector('.frame-unit');
    const ctxFrame = currentFrame.getContext('2d');
    this.contextFrame = ctxFrame;

    const frameData = ctxFrame.getImageData(0, 0, currentFrame.width, currentFrame.height);
    this.frameData = frameData;
  }

  penToolDefault(e) {
    const canvas = this.canvasDraw;
    const ctxCanvas = this.contextCanvas;

    ctxCanvas.putImageData(this.frameData, 0, 0);

    const fill = (evt) => {
      if (canvas.getContext) {
        const moveX = Math.round((evt.pageX - canvas.offsetLeft) / 20) * 20 - 10;
        const moveY = Math.round((evt.pageY - canvas.offsetTop) / 20) * 20 - 10;

        ctxCanvas.fillRect(moveX, moveY, 20, 20);

        this.canvasData = ctxCanvas.getImageData(0, 0, canvas.width, canvas.height);
        this.contextFrame.putImageData(this.canvasData, 0, 0);
      }
    };

    fill(e);

    this.canvasDraw.addEventListener('mousemove', fill);

    this.canvasDraw.addEventListener('mouseup', () => {
      this.canvasDraw.removeEventListener('mousemove', fill);
    });
  }
}
