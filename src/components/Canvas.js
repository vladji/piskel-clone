import Frames from './Frames';

export default class Canvas {
  constructor() {
    this.canvasDraw = document.getElementById('canvas');
    this.contextCanvas = this.canvasDraw.getContext('2d');
    this.canvasData = null;
    this.contextFrame = null;
    this.contextCanvas.fillStyle = null;
    this.thikness = null;
    this.tool = null;
  }

  prepareData(...args) {
    const color = args[0];
    const thikness = args[1];
    const tool = args[2];

    let currentFrame = Frames.getFrame();
    if (!currentFrame) currentFrame = document.querySelector('.frame-unit');
    const ctxFrame = currentFrame.getContext('2d');
    this.contextFrame = ctxFrame;

    if (color) this.contextCanvas.fillStyle = color;
    if (thikness) this.thikness = thikness;
    this.tool = tool;
  }

  penToolDefault(evt) {
    const canvas = this.canvasDraw;
    const ctxCanvas = this.contextCanvas;
    const lineFat = this.thikness;

    if (canvas.getContext) {
      const moveX = (evt.pageX - canvas.offsetLeft) * 2;
      const moveY = (evt.pageY - canvas.offsetTop) * 2;

      const pointShiftX = moveX % lineFat;
      const pointShiftY = moveY % lineFat;

      const pointWidth = moveX - pointShiftX;
      const pointHeight = moveY - pointShiftY;

      if (this.tool === 'eraser') {
        this.canvasData = ctxCanvas.getImageData(pointWidth, pointHeight, lineFat, lineFat);
        for (let i = 3; i < this.canvasData.data.length; i += 4) {
          this.canvasData.data[i] = 0;
        }
        ctxCanvas.putImageData(this.canvasData, pointWidth, pointHeight);
        this.contextFrame.putImageData(this.canvasData, pointWidth, pointHeight);
      } else {
        ctxCanvas.fillRect(pointWidth, pointHeight, lineFat, lineFat);

        this.canvasData = ctxCanvas.getImageData(0, 0, canvas.width, canvas.height);
        this.contextFrame.putImageData(this.canvasData, 0, 0);
      }
    }
  }

  bucketTool(evt) {
    const canvas = this.canvasDraw;
    const ctxCanvas = this.contextCanvas;

    let startX = (evt.pageX - canvas.offsetLeft) * 2;
    const startY = (evt.pageY - canvas.offsetTop) * 2;

    const pixelDefault = ctxCanvas.getImageData(startX, startY, 1, 1).data.join('');

    const toCompareData = ctxCanvas.getImageData(startX, startY, 1, 1).data.join(', ');
    const colorBtn = document.querySelector('.choose-color-btn');
    const color = colorBtn.style.backgroundColor;
    const toCompareColor = `${color.slice(4, -1)}, 255`;

    if (toCompareData === toCompareColor) return;

    const shiftX = startX % 10;
    startX -= shiftX;
    const pixelStack = [[startX, startY]];

    const checkPixel = (posX, posY) => {
      const chekX = posX;
      const chekY = posY;
      const nextPixel = ctxCanvas.getImageData(chekX, chekY, 1, 1).data.join('');
      return nextPixel === pixelDefault;
    };

    const paintPixel = (posX, posY) => {
      ctxCanvas.fillRect(posX, posY, 10, 10);
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
        if (x < canvas.width) {
          if (checkPixel(x + 10, y)) {
            if (!reachRight) {
              pixelStack.push([x + 10, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }

        //  LOOK to the LEFT
        if (x > 0) {
          if (checkPixel(x - 10, y)) {
            if (!reachLeft) {
              pixelStack.push([x - 10, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        y += 10;
      } while (y !== canvas.height && checkPixel(x, y));
    }

    this.canvasData = ctxCanvas.getImageData(0, 0, canvas.width, canvas.height);
    this.contextFrame.putImageData(this.canvasData, 0, 0);
  }
}
