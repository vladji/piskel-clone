export default class Canvas {
  constructor(frames) {
    this.frames = frames;
    this.canvasDraw = document.getElementById('canvas');
    this.contextCanvas = this.canvasDraw.getContext('2d');
    this.canvasData = null;
    this.contextFrame = null;
    this.contextCanvas.fillStyle = null;
    this.thick = null;
    this.tool = null;
  }

  prepareData(...args) {
    const color = args[0];
    const thikness = args[1];
    const tool = args[2];

    let currentFrame = this.frames.getFrameCanvas();
    if (!currentFrame) currentFrame = document.querySelector('.frame-canvas');
    const ctxFrame = currentFrame.getContext('2d');
    this.contextFrame = ctxFrame;

    if (color) this.contextCanvas.fillStyle = color;
    if (thikness) this.thick = thikness;
    this.tool = tool;
  }

  getCoordinate(evt) {
    const canvas = this.canvasDraw;

    const moveX = (evt.pageX - canvas.offsetLeft) * 2;
    const moveY = (evt.pageY - canvas.offsetTop) * 2;

    const dotShiftX = moveX % this.thick;
    const dotShiftY = moveY % this.thick;

    const dotX = moveX - dotShiftX;
    const dotY = moveY - dotShiftY;

    return {
      dotX,
      dotY,
    };
  }

  penTool(evt) {
    const coord = this.getCoordinate(evt);
    this.startX = coord.dotX;
    this.startY = coord.dotY;
    this.contextCanvas.fillRect(this.startX, this.startY, this.thick, this.thick);

    const bresenham = this.bresenham.bind(this);

    const remove = () => {
      console.log('remove');
      this.canvasDraw.removeEventListener('mousemove', bresenham);
      document.removeEventListener('mouseup', remove);
    };
    this.canvasDraw.addEventListener('mousemove', bresenham);
    document.addEventListener('mouseup', remove);

    // if (this.tool === 'eraser') {
    //   this.canvasData = ctxCanvas.getImageData(pointWidth, pointHeight, lineFat, lineFat);
    //   for (let i = 3; i < this.canvasData.data.length; i += 4) {
    //     this.canvasData.data[i] = 0;
    //   }
    //   ctxCanvas.putImageData(this.canvasData, pointWidth, pointHeight);
    //   this.contextFrame.putImageData(this.canvasData, pointWidth, pointHeight);
    // } else {
    //   ctxCanvas.fillRect(pointWidth, pointHeight, lineFat, lineFat);

    //   this.canvasData = ctxCanvas.getImageData(0, 0, canvas.width, canvas.height);
    //   this.contextFrame.putImageData(this.canvasData, 0, 0);
    // }
  }

  // Bresenham's line algorithm
  bresenham(e) {
    const ctx = this.contextCanvas;
    // ctx.fillStyle = this.color;
    const lineFat = this.thick;
    console.log('lineFat', lineFat);
    const coord = this.getCoordinate(e);

    let dirX = coord.dotX - this.startX;
    let dirY = coord.dotY - this.startY;
    const lineX = Math.abs(dirX / lineFat);
    const lineY = Math.abs(dirY / lineFat);

    let pointX = this.startX;
    let pointY = this.startY;

    const dir = +lineFat;

    dirX = (dirX > 0) ? dir : -dir;
    dirY = (dirY > 0) ? dir : -dir;

    let ratio = Math.abs(coord.dotY - this.startY) / Math.abs(coord.dotX - this.startX);
    let direction = lineX;

    if (lineX < lineY) {
      direction = lineY;
      ratio = Math.abs(coord.dotX - this.startX) / Math.abs(coord.dotY - this.startY);
    }

    const tempVal = Math.trunc(ratio);
    ratio -= tempVal;

    let breakLine = 0;

    if (lineX >= lineY) {
      for (let i = 0; i < direction; i += 1) {
        breakLine += ratio;
        pointX += dirX;

        if (breakLine >= 0.5) {
          pointY += dirY;
          breakLine -= 1;
        }

        if (this.tool === 'eraser') {
          const eraseCoord = {
            pointX,
            pointY,
          };
          this.eraserTool(eraseCoord);
        } else {
          ctx.fillRect(pointX, pointY, lineFat, lineFat);
        }
      }
    } else {
      for (let i = 0; i < direction; i += 1) {
        breakLine += ratio;
        pointY += dirY;

        if (breakLine >= 0.5) {
          pointX += dirX;
          breakLine -= 1;
        }

        if (this.tool === 'eraser') {
          const eraseCoord = {
            pointX,
            pointY,
          };
          this.eraserTool(eraseCoord);
        } else {
          ctx.fillRect(pointX, pointY, lineFat, lineFat);
        }
      }
    }

    this.startX = pointX;
    this.startY = pointY;
  }

  colorPicker(evt) {
    const canvas = this.canvasDraw;
    const pontX = (evt.pageX - canvas.offsetLeft) * 2;
    const pointY = (evt.pageY - canvas.offsetTop) * 2;

    const colorData = this.contextCanvas.getImageData(pontX, pointY, 1, 1).data.join(', ');
    const colorCSS = `rgba(${colorData})`;

    const primaryColorBtn = document.querySelector('.wrap_color-section button:first-child');

    primaryColorBtn.style.backgroundColor = colorCSS;
    this.prepareData(colorCSS);
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
