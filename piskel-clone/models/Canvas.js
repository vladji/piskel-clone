import Frames from './Frames';

export default class Canvas {
  constructor() {
    this.canvasDraw = document.getElementById('canvas');
    this.contextCanvas = this.canvasDraw.getContext('2d');
    this.canvasData = null;
    this.contextFrame = null;
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

  prepareData() {
    let currentFrame = Frames.getFrame();
    if (!currentFrame) currentFrame = document.querySelector('.frame-unit');
    const ctxFrame = currentFrame.getContext('2d');
    this.contextFrame = ctxFrame;
  }

  penToolDefault(evt) {
    console.log('penToolDefault');
    const canvas = this.canvasDraw;
    const ctxCanvas = this.contextCanvas;

    if (canvas.getContext) {
      const moveX = evt.pageX - canvas.offsetLeft;
      const moveY = evt.pageY - canvas.offsetTop;

      const pointShiftX = moveX % 20;
      const pointShiftY = moveY % 20;

      const pointWidth = moveX - pointShiftX;
      const pointHeight = moveY - pointShiftY;

      // console.log('pointWidth', pointWidth);
      // console.log('pointHeight', pointHeight);

      console.log('canvas.height', canvas.height);
      console.log('canvas.width', canvas.width);

      ctxCanvas.fillRect(pointWidth, pointHeight, 20, 20);

      this.canvasData = ctxCanvas.getImageData(0, 0, canvas.width, canvas.height);
      this.contextFrame.putImageData(this.canvasData, 0, 0);
    }
  }

  bucketTool(evt) {
    console.log('bucketTool');
    const canvas = this.canvasDraw;
    canvas.onmousemove = null;

    const ctxCanvas = this.contextCanvas;
    ctxCanvas.fillStyle = 'rgb(200,0,0)';

    let startX = evt.pageX - canvas.offsetLeft;
    const startY = evt.pageY - canvas.offsetTop;

    const pixelDefault = ctxCanvas.getImageData(startX, startY, 1, 1).data.join('');

    const shiftX = startX % 20;
    startX -= shiftX;
    const pixelStack = [[startX, startY]];

    const checkPixel = (posX, posY) => {
      const chekX = posX;
      const chekY = posY;
      const nextPixel = ctxCanvas.getImageData(chekX, chekY, 1, 1).data.join('');
      return nextPixel === pixelDefault;
    };

    const paintPixel = (posX, posY) => {
      ctxCanvas.fillRect(posX, posY, 20, 20);
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
          if (checkPixel(x + 20, y)) {
            if (!reachRight) {
              pixelStack.push([x + 20, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }

        //  LOOK to the LEFT
        if (x > 0) {
          if (checkPixel(x - 20, y)) {
            if (!reachLeft) {
              pixelStack.push([x - 20, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }
        y += 20;
      } while (y !== canvas.height && checkPixel(x, y));
    }

    this.canvasData = ctxCanvas.getImageData(0, 0, canvas.width, canvas.height);
    this.contextFrame.putImageData(this.canvasData, 0, 0);
  }
}
