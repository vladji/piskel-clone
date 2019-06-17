import Canvas from '../models/Canvas';
import Preview from '../models/Preview';

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

    // const preview = new Preview();
    // let i = 0;

    // setTimeout(function run() {
    //   this.fps = preview.getFps();
    //   const workSlides = preview.getSlides();
    //   Preview.putSlide(workSlides, i);
    //   setTimeout(run, 1000 / this.fps);
    //   i += 1;
    // }, 1000 / this.fps);

    const remove = () => {
      canvas.removeEventListener('mousemove', penToolDefault);
      canvas.removeEventListener('mouseup', remove);
      Preview.setSlides();
    };

    canvas.addEventListener('mousedown', (e) => {
      canvasInit.prepareData();
      penToolDefault(e);
      canvas.addEventListener('mousemove', penToolDefault);
      canvas.addEventListener('mouseup', remove);
    });
  }
}
