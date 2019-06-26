import Frames from './Frames';

export default class Canvas {
  constructor() {
    this.canvasDraw = document.getElementById('canvas');
    this.contextCanvas = this.canvasDraw.getContext('2d');
    this.canvasData = null;
    this.contextFrame = null;
    this.contextCanvas.fillStyle = null;
    this.thikness = null;
  }

  // targetPoint() {
  //   const canvas = this.canvasDraw;

  //   canvas.addEventListener('mouseover', () => {
  //     canvas.addEventListener('mousemove', (e) => {
  //       const moveX = e.pageX - canvas.offsetLeft;
  //       const moveY = e.pageY - canvas.offsetTop;

  //       console.log('moveX', moveX);
  //       console.log('moveY', moveY);
  //     });
  //   });
  // }

  prepareData(color, thikness) {
    let currentFrame = Frames.getFrame();
    if (!currentFrame) currentFrame = document.querySelector('.frame-unit');
    const ctxFrame = currentFrame.getContext('2d');
    this.contextFrame = ctxFrame;
    this.contextCanvas.fillStyle = color;
    if (!thikness) this.thikness = 20;
  }

  penToolDefault(evt) {
    const canvas = this.canvasDraw;
    const ctxCanvas = this.contextCanvas;
    const lineFat = this.thikness;

    if (canvas.getContext) {
      const moveX = evt.pageX - canvas.offsetLeft;
      const moveY = evt.pageY - canvas.offsetTop;

      const pointShiftX = moveX % lineFat;
      const pointShiftY = moveY % lineFat;

      const pointWidth = moveX - pointShiftX;
      const pointHeight = moveY - pointShiftY;

      ctxCanvas.fillRect(pointWidth, pointHeight, lineFat, lineFat);

      this.canvasData = ctxCanvas.getImageData(0, 0, canvas.width, canvas.height);
      this.contextFrame.putImageData(this.canvasData, 0, 0);
    }
  }

  bucketTool(evt) {
    const lineFat = this.thikness;
    const canvas = this.canvasDraw;

    const ctxCanvas = this.contextCanvas;

    let startX = evt.pageX - canvas.offsetLeft;
    const startY = evt.pageY - canvas.offsetTop;

    const pixelDefault = ctxCanvas.getImageData(startX, startY, 1, 1).data.join('');

    const shiftX = startX % lineFat;
    startX -= shiftX;
    const pixelStack = [[startX, startY]];

    const checkPixel = (posX, posY) => {
      const chekX = posX;
      const chekY = posY;
      const nextPixel = ctxCanvas.getImageData(chekX, chekY, 1, 1).data.join('');
      return nextPixel === pixelDefault;
    };

    const paintPixel = (posX, posY) => {
      ctxCanvas.fillRect(posX, posY, lineFat, lineFat);
    };

    while (pixelStack.length) {
      const newPos = pixelStack.pop();
      const x = newPos[0];
      let y = newPos[1];
      let stepX = lineFat;
      let stepY = lineFat;
      // GO UP
      do {
        y -= 1;
      } while (y >= 0 && checkPixel(x, y));
      y += 1;

      let reachRight = false;
      let reachLeft = false;
      do {
        paintPixel(x, y);

        if (x + stepX > canvas.width) {
          stepX = 1;
        } else {
          stepX = lineFat;
        }
        //  LOOK to the RIGHT
        if (x < canvas.width) {
          if (checkPixel(x + stepX, y)) {
            if (!reachRight) {
              pixelStack.push([x + stepX, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }

        //  LOOK to the LEFT
        if (x > 0) {
          if (checkPixel(x - stepX, y)) {
            if (!reachLeft) {
              pixelStack.push([x - stepX, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        if (y + lineFat > canvas.height) {
          stepY = 1;
        } else {
          stepY = lineFat;
        }
        y += stepY;
      } while (y !== canvas.height && checkPixel(x, y));
    }

    this.canvasData = ctxCanvas.getImageData(0, 0, canvas.width, canvas.height);
    this.contextFrame.putImageData(this.canvasData, 0, 0);
  }
}
