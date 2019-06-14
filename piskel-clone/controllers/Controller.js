import Canvas from '../models/Canvas';

export default class Controller {
  constructor() {
    this.canvasDraw = document.getElementById('canvas');
  }

  start() {
    const canvas = this.canvasDraw;

    const canvasInit = new Canvas();
    canvasInit.prepareData();

    canvas.addEventListener('mousedown', (e) => {
      canvasInit.prepareData();
      canvasInit.penToolDefault(e);
    });
  }
}
