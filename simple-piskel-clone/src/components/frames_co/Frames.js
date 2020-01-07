import Preview from '../Preview';
import { firstFrameTools, toggleFrameTools } from './firstFrameTools';

export default class Frames {
  constructor() {
    this.DIMENSION = 512;
    this.framesBlock = document.getElementById('frames-block');
    this.framesList = document.querySelector('.frames-list');
    this.ctxCanvas = document.getElementById('canvas').getContext('2d');
    this.framesUnits = () => document.querySelectorAll('.frames-list li');
    this.lastFrame = () => document.querySelector('.frames-list li:last-child canvas');
    this.currentFrame = () => document.querySelector('.active-frame');
  }

  controller() {
    this.frameHover();
    this.frameDragDrop();
    this.countFrames();

    const framesObj = this;
    const frameEvents = {
      addFrame() {
        framesObj.addNewFrame();
      },
      frameDelete(e) {
        framesObj.frameDelete(e);
      },
      frameDuplicate(e) {
        framesObj.frameDuplicate(e);
      },
    };

    this.framesBlock.addEventListener('click', (e) => {
      if (e.target.closest('[data-frame-action]')) {
        const actionElem = e.target.closest('[data-frame-action]');
        const action = actionElem.dataset.frameAction;
        frameEvents[action](e);

        this.countFrames();
        Preview.setSlides();
      }

      if (e.target.closest('.frame-wrap') && !e.target.closest('[data-frame-action]')) {
        const activeFrame = e.target.closest('.frame-wrap');
        const frameCanvas = activeFrame.querySelector('canvas');
        this.putFrameData(frameCanvas);
        this.activeFrame(activeFrame);
      }
    });
  }

  putFrameData(frameCanvas) {
    const ctxFrame = frameCanvas.getContext('2d');
    const frameData = ctxFrame.getImageData(0, 0, frameCanvas.width, frameCanvas.height);

    this.ctxCanvas.putImageData(frameData, 0, 0);
  }

  activeFrame(frame) {
    this.currentFrame().classList.remove('active-frame');
    frame.classList.add('active-frame');
  }

  getFrameCanvas() {
    return this.currentFrame().querySelector('.frame-canvas');
  }

  addNewFrame() {
    const prevActiveFrame = this.currentFrame();
    if (prevActiveFrame) prevActiveFrame.classList.remove('active-frame');

    this.framesList.insertAdjacentHTML('beforeend',
      `<li class="frame-wrap active-frame">
        <p class="frame-num"></p>
        <canvas class="frame-canvas" width="${this.DIMENSION}" height="${this.DIMENSION}"></canvas>
        <div class="frame-tools" hidden>
          <button class="frame-duplicate" data-frame-action="frameDuplicate"><i class="fas fa-clone"></i></button>
          <button class="frame-delete" data-frame-action="frameDelete"><i class="fas fa-trash-alt"></i></button>
          <button class="frame-move"><i class="fas fa-arrows-alt-v"></i></button>
        </div>
      </li>`);

    const frameCanvas = this.currentFrame().querySelector('.frame-canvas');
    this.putFrameData(frameCanvas);
  }

  frameDelete(e) {
    const targetFrame = e.target.closest('li');

    let nextFrame = targetFrame.previousElementSibling;
    if (!nextFrame) nextFrame = targetFrame.nextElementSibling;

    const nextCanvas = nextFrame.querySelector('canvas');
    this.putFrameData(nextCanvas);
    this.activeFrame(nextFrame);

    targetFrame.remove();
  }

  frameDuplicate(e) {
    if (this.framesUnits().length === 1) firstFrameTools(false);

    const targetFrameLi = e.target.closest('li');
    const targetCanvas = targetFrameLi.querySelector('canvas');
    const targetCanvasData = targetCanvas.getContext('2d').getImageData(0, 0, targetCanvas.width, targetCanvas.height);

    const cloneFrameLi = targetFrameLi.cloneNode(true);
    const cloneCanvas = cloneFrameLi.querySelector('canvas');
    const cloneCanvasCtx = cloneCanvas.getContext('2d');
    cloneCanvasCtx.putImageData(targetCanvasData, 0, 0);

    cloneFrameLi.classList.remove('active-frame');

    toggleFrameTools(cloneFrameLi, true);
    targetFrameLi.after(cloneFrameLi);
    this.activeFrame(cloneFrameLi);
  }

  countFrames() {
    const frames = this.framesUnits();
    if (frames.length === 1) {
      firstFrameTools(true);
    } else {
      firstFrameTools(false);
    }

    let counter = 1;
    for (let i = 0; i < frames.length; i += 1) {
      const frameNumber = frames[i].querySelector('.frame-num');
      frameNumber.innerHTML = `${counter}`;
      counter += 1;
    }
  }

  frameHover() {
    this.framesList.addEventListener('mouseover', (e) => {
      if (e.target.closest('li')) {
        toggleFrameTools(e.target.closest('li'), false, this.currentFrame());
      }
    });

    this.framesList.addEventListener('mouseout', (e) => {
      if (e.target.closest('li')) {
        toggleFrameTools(e.target.closest('li'), true);
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

      if (frameParam.nextSibling && replaceFrame === frameParam.nextSibling) {
        replaceFrame.after(dropElemProxy);
      }

      if (frameParam.previousSibling && replaceFrame === frameParam.previousSibling) {
        replaceFrame.before(dropElemProxy);
      }
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
