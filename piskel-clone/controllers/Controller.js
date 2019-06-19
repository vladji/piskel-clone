import Canvas from '../models/Canvas';
import Preview from '../models/Preview';
import Tools from './Tools';

export default class Controller {
  constructor() {
    this.canvasDraw = document.getElementById('canvas');
    this.fps = null;
  }

  start() {
    const canvas = this.canvasDraw;

    const canvasInit = new Canvas();
    canvasInit.prepareData();
    const penToolDefault = canvasInit.penToolDefault.bind(canvasInit);
    const bucketTool = canvasInit.bucketTool.bind(canvasInit);

    const remove = () => {
      canvas.removeEventListener('mousemove', penToolDefault);
      canvas.removeEventListener('mouseup', remove);
      Preview.setSlides();
    };

    canvas.addEventListener('mousedown', (e) => {
      canvasInit.prepareData();
      const currentTool = Tools.getTool();

      if (!currentTool) {
        penToolDefault(e);
        canvas.addEventListener('mousemove', penToolDefault);
        canvas.addEventListener('mouseup', remove);
      } else {
        bucketTool(e);
      }
    });
  }
}
