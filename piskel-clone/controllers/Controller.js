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

    const animation = Preview.animationRun.bind(Preview);
    let workSlides = { scope: [''] };
    let i = 0;

    const remove = () => {
      canvas.removeEventListener('mousemove', penToolDefault);
      canvas.removeEventListener('mouseup', remove);
      workSlides = Preview.prepareSlides();
    };

    setTimeout(function run() {
      animation(workSlides, i);
      setTimeout(run, 2000);
      i += 1;
    }, 2000);

    canvas.addEventListener('mousedown', (e) => {
      canvasInit.prepareData();
      penToolDefault(e);
      canvas.addEventListener('mousemove', penToolDefault);
      canvas.addEventListener('mouseup', remove);
    });
  }
}
