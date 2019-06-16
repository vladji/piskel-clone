import Canvas from '../models/Canvas';
import Preview from '../models/Preview';

export default class Controller {
  constructor() {
    this.canvasDraw = document.getElementById('canvas');
  }

  start() {
    const canvas = this.canvasDraw;

    const canvasInit = new Canvas();
    canvasInit.prepareData();
    const penToolDefault = canvasInit.penToolDefault.bind(canvasInit);

    const preview = new Preview();
    preview.setFps();

    let workSlides = { scope: [''] };
    let i = 0;
    let fps = null;

    setTimeout(function run() {
      fps = preview.getFps();
      Preview.animationRun(workSlides, i);
      setTimeout(run, 1000 / fps);
      i += 1;
    }, 1000 / fps);

    const remove = () => {
      canvas.removeEventListener('mousemove', penToolDefault);
      canvas.removeEventListener('mouseup', remove);
      workSlides = Preview.prepareSlides();
    };

    canvas.addEventListener('mousedown', (e) => {
      canvasInit.prepareData();
      penToolDefault(e);
      canvas.addEventListener('mousemove', penToolDefault);
      canvas.addEventListener('mouseup', remove);
    });
  }
}
