import Preview from './Preview';
import colorConverter from '../utils/colorConvert';

export default class Canvas {
  constructor(frames) {
    this.frames = frames;
    this.canvasDraw = document.getElementById('canvas');
    this.contextCanvas = this.canvasDraw.getContext('2d');
    this.frame = null;
    this.contextCanvas.fillStyle = null;
    this.thick = null;
    this.tool = null;
    this.controller();
  }

  controller() {
    this.canvasDraw.addEventListener('mousedown', (evt) => {
      this.frame = this.frames.getFrameCanvas();
      this.startDraw(evt, this.tool);
    });
  }

  getCoordinate(evt) {
    const canvas = this.canvasDraw;

    const moveX = evt.pageX - canvas.offsetLeft;
    const moveY = evt.pageY - canvas.offsetTop;

    const dotShiftX = moveX % this.thick;
    const dotShiftY = moveY % this.thick;

    const dotX = moveX - dotShiftX;
    const dotY = moveY - dotShiftY;

    return {
      dotX,
      dotY,
    };
  }

  startDraw(evt, tool) {
    const canvas = this.canvasDraw;
    const ctxFrame = this.frame.getContext('2d');
    const bresenham = this.bresenham.bind(this);

    const coord = this.getCoordinate(evt);
    this.startX = coord.dotX;
    this.startY = coord.dotY;

    this[tool](this.startX, this.startY);

    const endDraw = () => {
      this.canvasData = this.contextCanvas.getImageData(0, 0, canvas.width, canvas.height);
      ctxFrame.putImageData(this.canvasData, 0, 0);
      Preview.setSlides();
    };

    const removeEvent = () => {
      this.canvasDraw.removeEventListener('mousemove', bresenham);
      document.removeEventListener('mouseup', removeEvent);
      endDraw();
    };

    if (tool === 'pen' || tool === 'eraser') {
      this.canvasDraw.addEventListener('mousemove', bresenham);
      document.addEventListener('mouseup', removeEvent);
    } else {
      endDraw();
    }
  }

  pen(dotX, dotY) {
    this.contextCanvas.fillRect(dotX, dotY, this.thick, this.thick);
  }

  eraser(dotX, dotY) {
    this.canvasData = this.contextCanvas.getImageData(dotX, dotY, this.thick, this.thick);
    for (let i = 3; i < this.canvasData.data.length; i += 4) {
      this.canvasData.data[i] = 0;
    }
    this.contextCanvas.putImageData(this.canvasData, dotX, dotY);
  }

  // Bresenham's line algorithm
  bresenham(e) {
    const lineFat = this.thick;
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

    let ratio;
    let direction;

    if (lineX >= lineY) {
      ratio = Math.abs(coord.dotY - this.startY) / Math.abs(coord.dotX - this.startX);
      direction = lineX;
    } else {
      ratio = Math.abs(coord.dotX - this.startX) / Math.abs(coord.dotY - this.startY);
      direction = lineY;
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

        this[this.tool](pointX, pointY);
      }
    } else {
      for (let i = 0; i < direction; i += 1) {
        breakLine += ratio;
        pointY += dirY;

        if (breakLine >= 0.5) {
          pointX += dirX;
          breakLine -= 1;
        }
        this[this.tool](pointX, pointY);
      }
    }
    this.startX = pointX;
    this.startY = pointY;
  }

  colorPicker(dotX, dotY) {
    const colorData = this.contextCanvas.getImageData(dotX, dotY, 1, 1).data.join(', ');

    const hexColor = colorConverter(colorData);
    const primaryColorBtn = document.querySelector('.color-tools__select:first-child');
    primaryColorBtn.value = hexColor;
    this.contextCanvas.fillStyle = hexColor;
  }

  bucket(dotX, dotY) {
    const canvas = this.canvasDraw;
    const ctxCanvas = this.contextCanvas;
    const dot = +this.thick;

    const startX = dotX;
    const startY = dotY;

    const pixelDefault = ctxCanvas.getImageData(startX, startY, 1, 1).data.join('');

    const toCompareData = ctxCanvas.getImageData(startX, startY, 1, 1).data.join(', ');
    const primaryColorBtn = document.querySelector('.color-tools__select:first-child');
    primaryColorBtn.style.backgroundColor = this.contextCanvas.fillStyle;
    const toCompareColor = `${primaryColorBtn.style.backgroundColor.slice(4, -1)}, 255`;

    if (toCompareData === toCompareColor) return;

    const pixelStack = [[startX, startY]];

    const checkPixel = (posX, posY) => {
      const nextPixel = ctxCanvas.getImageData(posX, posY, 1, 1).data.join('');
      return nextPixel === pixelDefault;
    };

    const paintPixel = (posX, posY) => {
      ctxCanvas.fillRect(posX, posY, dot, dot);
    };

    while (pixelStack.length) {
      const newPos = pixelStack.pop();
      const x = newPos[0];
      let y = newPos[1];

      // GO UP
      do {
        y -= dot;
      } while (y >= 0 && checkPixel(x, y));
      y += dot;

      let reachRight = false;
      let reachLeft = false;
      do {
        paintPixel(x, y);

        //  LOOK to the RIGHT
        if (x < canvas.width) {
          if (checkPixel(x + dot, y)) {
            if (!reachRight) {
              pixelStack.push([x + dot, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }

        //  LOOK to the LEFT
        if (x > 0) {
          if (checkPixel(x - dot, y)) {
            if (!reachLeft) {
              pixelStack.push([x - dot, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        y += dot;
      } while (checkPixel(x, y) && y !== canvas.height);
    }
  }
}
