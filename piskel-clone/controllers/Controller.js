import Canvas from '../models/Canvas';

export default class Controller {
  constructor() {
    this.canvasDraw = document.getElementById('canvas');
  }

  start() {
    const canvas = this.canvasDraw;
    const ctxCanvas = canvas.getContext('2d');

    const paint = new Canvas();
    canvas.addEventListener('mousedown', (e) => {
      const moveX = Math.round((e.pageX - canvas.offsetLeft) / 20) * 20 - 10;
      const moveY = Math.round((e.pageY - canvas.offsetTop) / 20) * 20 - 10;
      ctxCanvas.beginPath();
      ctxCanvas.moveTo(moveX, moveY);
      paint.draw(e);
    });
  }
}
