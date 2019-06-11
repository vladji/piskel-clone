import Frames from './Frames';

export default class Canvas {
  constructor() {
    this.canvasDraw = document.getElementById('canvas');
  }

  draw(e) {
    const canvas = this.canvasDraw;

    let fillColor = this.color;
    if (!fillColor) fillColor = '#ccc';

    const ctxCanvas = canvas.getContext('2d');
    ctxCanvas.lineWidth = 20;
    ctxCanvas.lineCap = 'square';
    // ctxCanvas.lineJoin = 'bevel';

    let canvasData = null;

    let currentFrame = Frames.frame();
    if (!currentFrame) currentFrame = document.querySelector('.frame-unit');
    const ctxFrame = currentFrame.getContext('2d');
    const frameData = ctxFrame.getImageData(0, 0, currentFrame.width, currentFrame.height);
    ctxCanvas.putImageData(frameData, 0, 0);

    // let moveX = 0;
    // let moveY = 0;

    const fill = () => {
      if (canvas.getContext) {
        const moveX = Math.round((e.pageX - canvas.offsetLeft) / 20) * 20 - 10;
        const moveY = Math.round((e.pageY - canvas.offsetTop) / 20) * 20 - 10;
        console.log(moveX);
        console.log(moveY);

        ctxCanvas.lineTo(moveX, moveY);
        ctxCanvas.stroke();

        // ctxCanvas.fillRect(moveX, moveY, 20, 20);
        // ctxCanvas.fill();

        canvasData = ctxCanvas.getImageData(0, 0, canvas.width, canvas.height);
        ctxFrame.putImageData(canvasData, 0, 0);
      }
    };

    fill(e);

    canvas.addEventListener('mousemove', fill);

    canvas.addEventListener('mouseup', () => {
      canvas.removeEventListener('mousemove', fill);
      // ctxFrame.putImageData(canvasData, 0, 0);
    });
  }
}
