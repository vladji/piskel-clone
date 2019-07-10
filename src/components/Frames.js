import Preview from './Preview';

export default class Frames {
  constructor() {
    this.framesBlock = document.getElementById('frames-block');
    this.framesList = document.querySelector('.frames-list ul');
    this.currentFrame = null;
    this.framesUnits = () => document.querySelectorAll('.frames-list li');
    this.addFrame = () => {
      if (this.framesUnits().length === 0) Frames.addNewFrame(this.framesList);
    };
    this.lastFrame = () => document.querySelector('.frames-list li:last-child canvas');
    this.frameTools = () => document.querySelector('.frame-tools');
    this.framesStates = [this.currentFrame];
  }

  logic() {
    const framesWrap = this.framesBlock;
    this.addFrame();

    this.currentFrame = document.querySelector('.frames-list li[style*="border"] canvas') || document.querySelector('.frames-list canvas');

    this.frameHover();
    this.countFrames();
    this.frameDragDrop();
    this.activeFrameState(this.currentFrame);

    Frames.setFrame(this.currentFrame);
    Preview.setSlides();

    framesWrap.addEventListener('click', (e) => {
      let frameHighlited = null;

      if (e.target.closest('canvas')) {
        frameHighlited = Frames.setFrame(e);
        this.activeFrameState(frameHighlited);
        this.currentFrame = frameHighlited;
      } else {
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
    const dimension = 1280;
    framesList.insertAdjacentHTML('beforeend',
      `<li class="frame-wrap">
        <p class="frame-num"></p>
        <canvas class="frame-unit" width="${dimension}" height="${dimension}"></canvas>
        <div class="frame-tools" style="display: none;">
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

    targetFrameLi.after(cloneFrameLi);

    cloneFrameLi.style.border = '';
    const frameTools = cloneFrameLi.querySelector('.frame-tools');
    frameTools.style.display = 'none';
    this.chekFrameTools(frameTools);
  }

  countFrames() {
    const frames = this.framesUnits();
    this.chekFrameTools(this.frameTools());

    let counter = 1;
    for (let i = 0; i < frames.length; i += 1) {
      const frameNumber = frames[i].querySelector('.frame-num');
      frameNumber.innerHTML = `${counter}`;
      counter += 1;
    }
  }

  chekFrameTools(frameTools) {
    const frames = this.framesUnits();

    const delTool = frameTools.querySelector('.frame-delete');
    const moveTool = frameTools.querySelector('.frame-move');

    if (frames.length === 1 && delTool) {
      delTool.remove();
      moveTool.remove();
    } else if (frames.length > 1 && !delTool) {
      frameTools.insertAdjacentHTML('beforeend',
        '<button class="frame-delete"><i class="fas fa-trash-alt"></i></button><button class="frame-move"><i class="fas fa-arrows-alt-v"></i></button>');
    }
  }

  activeFrameState(frame) {
    const activeFrameLi = frame.closest('li');
    this.framesStates.push(activeFrameLi);

    const prevFrame = this.framesStates.shift();
    if (prevFrame) prevFrame.style.border = '';

    const currentFrame = this.framesStates[0];
    currentFrame.style.border = '5px solid #ffed15';
  }

  frameHover() {
    let frameTools;
    let targetLi;

    this.framesList.addEventListener('mouseover', (e) => {
      if (e.target.closest('li')) {
        targetLi = e.target.closest('li');
        frameTools = targetLi.querySelector('.frame-tools');
        // frameTools.hidden = false;
        if (frameTools) frameTools.style.display = '';

        const activeFrame = this.currentFrame.closest('li');
        if (targetLi !== activeFrame) targetLi.style.border = '5px solid #888';
      }
    });

    this.framesList.addEventListener('mouseout', () => {
      if (targetLi) {
        // frameTools.hidden = true;
        if (frameTools) frameTools.style.display = 'none';

        const activeFrame = this.currentFrame.closest('li');
        if (targetLi !== activeFrame) targetLi.style.border = '';
      }
    });
  }

  frameDragDrop() {
    const allFrames = this.framesList;
    let targetFrameLi = null;
    const frameParam = {};

    const framesLayout = () => {
      const frames = this.framesUnits();
      for (let i = 0; i < frames.length; i += 1) {
        frames[i].style.zIndex = '11';
      }
    };

    const chekElement = (evt) => {
      const dropElemProxy = frameParam.proxy;

      frameParam.previousSibling = dropElemProxy.previousElementSibling;
      frameParam.nextSibling = dropElemProxy.nextElementSibling;

      targetFrameLi.style.zIndex = '-1';
      const elem = document.elementFromPoint(evt.clientX, evt.clientY);
      const replaceFrame = elem.closest('li');

      // eslint-disable-next-line max-len
      if (frameParam.nextSibling && replaceFrame === frameParam.nextSibling) replaceFrame.after(dropElemProxy);
      // eslint-disable-next-line max-len
      if (frameParam.previousSibling && replaceFrame === frameParam.previousSibling) replaceFrame.before(dropElemProxy);
      targetFrameLi.style.zIndex = '99';
    };

    const startMove = () => {
      framesLayout();
      const dropElemProxy = document.createElement('li');
      dropElemProxy.className = 'drop-elem-proxy frame-wrap';

      targetFrameLi.style.zIndex = '99';
      targetFrameLi.style.top = `${frameParam.startTop}px`;
      targetFrameLi.style.left = `${frameParam.startLeft}px`;
      targetFrameLi.style.position = 'absolute';
      targetFrameLi.after(dropElemProxy);
      document.body.appendChild(targetFrameLi);
      return dropElemProxy;
    };

    const frameMove = (evt) => {
      const startY = frameParam.startTop;
      const firstTouch = frameParam.firstTouchY;
      const moveY = (firstTouch - evt.clientY) - startY;
      if (Math.abs(moveY) > 3) {
        if (!frameParam.proxy) {
          frameParam.proxy = startMove();
        }

        targetFrameLi.style.top = `${-moveY}px`;
        setInterval(chekElement(evt), 1000);
      }
    };

    allFrames.addEventListener('mousedown', (e) => {
      if (this.framesUnits().length === 1) return;
      targetFrameLi = e.target.closest('li');

      frameParam.firstTouchY = e.clientY;
      frameParam.startTop = targetFrameLi.offsetTop;
      frameParam.startLeft = targetFrameLi.offsetLeft;

      targetFrameLi.addEventListener('mousemove', frameMove);

      targetFrameLi.addEventListener('mouseup', () => {
        targetFrameLi.removeEventListener('mousemove', frameMove);

        if (frameParam.proxy) frameParam.proxy.replaceWith(targetFrameLi);
        frameParam.proxy = null;
        targetFrameLi.style.position = 'relative';
        targetFrameLi.style.top = '';
        targetFrameLi.style.left = '';
        Preview.setSlides();
        this.countFrames();
      });
    });
  }
}
