import Preview from './Preview';

export default class Frames {
  constructor() {
    this.framesBlock = document.querySelector('#frames-block');
    this.framesList = document.querySelector('.frames-list ul');
    this.currentFrame = document.querySelector('.frames-list canvas');
    this.lastFrame = () => document.querySelector('.frames-list li:last-child canvas');
    this.framesStates = [];
  }

  logic() {
    const framesWrap = this.framesBlock;
    this.activeFrameState(this.currentFrame);

    framesWrap.addEventListener('click', (e) => {
      let frameHighlited = null;

      if (e.target.closest('.frames-list')) frameHighlited = Frames.pickFrame(e);

      if (e.target.closest('.add-frame')) {
        Frames.addNewFrame(this.framesList);
        frameHighlited = Frames.pickFrame(this.lastFrame());
        Preview.setSlides(this.lastFrame());
      }

      this.activeFrameState(frameHighlited);
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

    return targetFrame;
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
    framesList.insertAdjacentHTML('beforeend', '<li><canvas class="frame-unit" width="700" height="700"></canvas></li>');
  }

  activeFrameState(frame) {
    this.framesStates.push(frame);

    if (this.framesStates.length < 2) {
      this.currentFrame.style.border = '4px solid #ffed15';
    } else {
      const prevFrame = this.framesStates.shift();
      prevFrame.style.border = '';

      const currentFrame = this.framesStates[0];
      currentFrame.style.border = '4px solid #ffed15';
    }
  }
}
