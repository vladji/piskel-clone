

export default class Frames {
  constructor() {
    this.framesBlock = document.querySelector('#frames-block');
    this.framesList = document.querySelector('.frames-list ul');
    this.currentFrame = null;
    this.lastFrame = () => document.querySelector('.frames-list li:last-child canvas');
  }

  logic() {
    const framesWrap = this.framesBlock;

    framesWrap.addEventListener('click', (e) => {
      if (e.target.closest('.frames-list')) Frames.pickFrame(e);

      if (e.target.closest('.add-frame')) {
        Frames.addNewFrame(this.framesList);
        Frames.pickFrame(this.lastFrame());
      }
    });
  }

  static pickFrame(e) {
    const targetFrame = e.target || e;
    this.currentFrame = targetFrame;

    const ctxFrame = targetFrame.getContext('2d');
    const frameData = ctxFrame.getImageData(0, 0, targetFrame.width, targetFrame.height);

    const canvasDraw = document.getElementById('canvas');
    const ctxCanvas = canvasDraw.getContext('2d');
    ctxCanvas.putImageData(frameData, 0, 0);
  }

  static getFrame() {
    return this.currentFrame;
  }

  // static clearFrameDraw(canvasDraw, canvasDrawWidth, canvasDrawHeight) {
  //   const ctxCanvas = canvasDraw.getContext('2d');
  //   ctxCanvas.clearRect(0, 0, canvasDrawWidth, canvasDrawHeight);
  //   ctxCanvas.beginPath();
  // }

  static addNewFrame(framesList) {
    framesList.insertAdjacentHTML('beforeend', '<li><canvas class="frame-unit" width="500" height="500"></canvas></li>');
  }
}
