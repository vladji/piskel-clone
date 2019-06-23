import Preview from './Preview';

export default class Frames {
  constructor() {
    this.framesBlock = document.querySelector('#frames-block');
    this.framesList = document.querySelector('.frames-list ul');
    this.currentFrame = document.querySelector('.frames-list canvas');
    this.framesUnits = () => document.querySelectorAll('.frames-list li');
    this.lastFrame = () => document.querySelector('.frames-list li:last-child canvas');
    this.framesStates = [];
    this.frameTools = document.querySelector('.frame-tools');
    this.frameTools.hidden = true;
    this.frameHover();
  }

  logic() {
    const framesWrap = this.framesBlock;
    this.countFrames();
    this.activeFrameState(this.currentFrame);

    framesWrap.addEventListener('click', (e) => {
      let frameHighlited = null;

      if (e.target.closest('canvas')) {
        frameHighlited = Frames.setFrame(e);
        this.activeFrameState(frameHighlited);
        this.currentFrame = frameHighlited;
      }

      if (e.target.closest('.add-frame')) {
        Frames.addNewFrame(this.framesList);
        frameHighlited = Frames.setFrame(this.lastFrame());
        Preview.setSlides();
        this.activeFrameState(frameHighlited);
        this.countFrames();
        this.currentFrame = frameHighlited;
      }

      if (e.target.closest('.frame-delete')) {
        this.frameDelete(e);
        this.countFrames();
      }
    });
  }

  static setFrame(e) {
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

  static addNewFrame(framesList) {
    framesList.insertAdjacentHTML('beforeend',
      `<li>
        <p class="frame-num"></p>
        <canvas class="frame-unit" width="700" height="700"></canvas>
        <div class="frame-tools">
          <button class="frame-duplicate">dupl</button>
          <button class="frame-delete">del</button>
          <button class="frame-move">move</button>
        </div>
      </li>`);
  }

  frameDelete(e) {
    const targetFrameLi = e.target.closest('li');
    const targetCanvas = targetFrameLi.querySelector('canvas');

    if (targetCanvas === this.currentFrame) {
      let nextFrameLi = targetFrameLi.previousElementSibling;
      if (!nextFrameLi) nextFrameLi = targetFrameLi.nextElementSibling;

      const nextCanvas = nextFrameLi.querySelector('canvas');
      this.currentFrame = nextCanvas;

      Frames.setFrame(nextCanvas);
      this.activeFrameState(nextCanvas);
    }

    this.framesList.removeChild(targetFrameLi);
    Preview.setSlides();
  }

  countFrames() {
    const frames = this.framesUnits();
    let counter = 1;
    for (let i = 0; i < frames.length; i += 1) {
      const frameNumber = frames[i].querySelector('.frame-num');
      frameNumber.innerHTML = `${counter}`;
      counter += 1;
    }
  }

  activeFrameState(frame) {
    const activeFrameLi = frame.closest('li');
    this.framesStates.push(activeFrameLi);

    if (this.framesStates.length < 2) {
      activeFrameLi.style.border = '5px solid #ffed15';
    } else {
      const prevFrame = this.framesStates.shift();
      prevFrame.style.border = '';

      const currentFrame = this.framesStates[0];
      currentFrame.style.border = '5px solid #ffed15';
    }
  }

  frameHover() {
    let frameTools;
    let targetLi;

    this.framesList.addEventListener('mouseover', (e) => {
      if (e.target.closest('li')) {
        targetLi = e.target.closest('li');
        frameTools = targetLi.querySelector('.frame-tools');
        frameTools.hidden = false;

        const activeFrame = this.currentFrame.closest('li');
        if (targetLi !== activeFrame) targetLi.style.border = '4px solid #888';
      }
    });

    this.framesList.addEventListener('mouseout', () => {
      if (targetLi) {
        frameTools.hidden = true;

        const activeFrame = this.currentFrame.closest('li');
        if (targetLi !== activeFrame) targetLi.style.border = '';
      }
    });
  }
}
