import Frames from './Frames';
// import Tools from '../controllers/Tools';

export default class Canvas {
  constructor() {
    this.canvasDraw = document.getElementById('canvas');
    this.contextCanvas = this.canvasDraw.getContext('2d');
    this.canvasData = null;
    this.contextFrame = null;
    // this.bucketBtn = document.querySelector('.bucket-btn');
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

  bucketTool(evt) {
    const canvas = this.canvasDraw;
    const ctxCanvas = this.contextCanvas;
    ctxCanvas.fillStyle = 'rgb(200,0,0)';

    const startX = evt.pageX - canvas.offsetLeft;
    const startY = evt.pageY - canvas.offsetTop;

    const pixelDefault = ctxCanvas.getImageData(startX, startY, 1, 1).data.join('');
    const pixelStack = [[startX, startY]];

    const checkPixel = (posX, posY) => {
      const chekX = posX;
      const chekY = posY;
      const nextPixel = ctxCanvas.getImageData(chekX, chekY, 1, 1).data.join('');
      return nextPixel === pixelDefault;
    };

    const paintPixel = (posX, posY) => {
      ctxCanvas.fillRect(posX, posY, 1, 1);
    };

    while (pixelStack.length) {
      const newPos = pixelStack.pop();
      const x = newPos[0];
      let y = newPos[1];

      // GO UP
      do {
        y -= 1;
      } while (y >= 0 && checkPixel(x, y));
      y += 1;

      let reachRight = false;
      let reachLeft = false;
      do {
        paintPixel(x, y);

        //  LOOK to the RIGHT
        if (x < canvas.width - 1) {
          if (checkPixel(x + 1, y)) {
            if (!reachRight) {
              pixelStack.push([x + 1, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }

        //  LOOK to the LEFT
        if (x > 0) {
          if (checkPixel(x - 1, y)) {
            if (!reachLeft) {
              pixelStack.push([x - 1, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        y += 1;
      } while (y !== canvas.height - 1 && checkPixel(x, y));
    }

    this.canvasData = ctxCanvas.getImageData(0, 0, canvas.width, canvas.height);
    this.contextFrame.putImageData(this.canvasData, 0, 0);
  }
}
