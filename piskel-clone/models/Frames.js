import Preview from './Preview';

export default class Frames {
  constructor() {
    this.framesBlock = document.querySelector('#frames-block');
    this.framesList = document.querySelector('.frames-list ul');
    this.currentFrame = document.querySelector('.frames-list canvas');
    this.framesUnits = () => document.querySelectorAll('.frames-list li');
    this.lastFrame = () => document.querySelector('.frames-list li:last-child canvas');
    this.framesStates = [];
    this.frameTools = () => document.querySelector('.frame-tools');
    this.frameTools().hidden = true;
    this.frameHover();
    this.countFrames();
    this.activeFrameState(this.currentFrame);
    this.frameDragDrop();
  }

  logic() {
    const framesWrap = this.framesBlock;

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
        this.activeFrameState(frameHighlited);
        this.currentFrame = frameHighlited;
      }

      if (e.target.closest('.frame-delete')) {
        this.frameDelete(e);
      }

      if (e.target.closest('.frame-duplicate')) {
        this.frameDuplicate(e);
      }

      Preview.setSlides();
      this.countFrames();
    });
  }

  frameDragDrop() {
    const allFrames = this.framesList;
    let targetFrameLi = null;
    let startMove = null;
    let firstTouch = null;

    const frameMove = (evt) => {
      const shiftY = firstTouch - evt.clientY - startMove;
      targetFrameLi.style.top = `${-shiftY}px`;

      const checkDistance = (firstTouch - evt.clientY) % 20;
      if (checkDistance === 0) {
        targetFrameLi.style.zIndex = '-1';
        const elem = document.elementFromPoint(evt.clientX, evt.clientY);
        console.log('elem', elem);

        // if (elem.matches('canvas')) {

        // }
        targetFrameLi.style.zIndex = '99';
      }
    };

    allFrames.addEventListener('mousedown', (e) => {
      targetFrameLi = e.target.closest('li');
      firstTouch = e.clientY;
      startMove = parseInt(targetFrameLi.style.top, 0) || 0;
      this.framesLayout();
      targetFrameLi.style.zIndex = '99';

      targetFrameLi.addEventListener('mousemove', frameMove);
    });

    allFrames.addEventListener('mouseup', () => {
      targetFrameLi.removeEventListener('mousemove', frameMove);
    });
  }

  framesLayout() {
    const allFrames = this.framesUnits();
    for (let i = 0; i < allFrames.length; i += 1) {
      allFrames[i].style.zIndex = '11';
    }
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
          <button class="frame-duplicate"><i class="fas fa-clone"></i></button>
          <button class="frame-delete"><i class="fas fa-trash-alt"></i></button>
          <button class="frame-move"><i class="fas fa-arrows-alt-v"></i></button>
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
  }

  frameDuplicate(e) {
    const targetFrameLi = e.target.closest('li');
    const targetCanvas = targetFrameLi.querySelector('canvas');
    const targetCanvasCtx = targetCanvas.getContext('2d');
    // eslint-disable-next-line max-len
    const targetCanvasData = targetCanvasCtx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);

    const cloneFrameLi = targetFrameLi.cloneNode(true);
    const cloneCanvas = cloneFrameLi.querySelector('canvas');
    const cloneCanvasCtx = cloneCanvas.getContext('2d');
    cloneCanvasCtx.putImageData(targetCanvasData, 0, 0);

    this.framesList.insertBefore(cloneFrameLi, targetFrameLi);
  }

  countFrames() {
    const frames = this.framesUnits();
    const firsFrameTools = this.frameTools();

    const delTool = firsFrameTools.children[1];
    const moveTool = firsFrameTools.children[2];

    if (frames.length === 1 && delTool) {
      delTool.remove();
      moveTool.remove();
    } else if (frames.length > 1 && !delTool) {
      firsFrameTools.insertAdjacentHTML('beforeend',
        '<button class="frame-delete"><i class="fas fa-trash-alt"></i></button><button class="frame-move"><i class="fas fa-arrows-alt-v"></i></button>');
    }

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
