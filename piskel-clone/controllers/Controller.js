import Canvas from '../models/Canvas';
// import Preview from '../models/Preview';

export default class Controller {
  constructor() {
    this.canvasDraw = document.getElementById('canvas');
  }

  start() {
    const canvas = this.canvasDraw;

    const canvasInit = new Canvas();
    canvasInit.prepareData();

    const penToolDefault = canvasInit.penToolDefault.bind(canvasInit);

    // const preview = new Preview();

    const remove = () => {
      canvas.removeEventListener('mousemove', penToolDefault);
      canvas.removeEventListener('mouseup', remove);
    };

    canvas.addEventListener('mousedown', (e) => {
      canvasInit.prepareData();
      canvasInit.penToolDefault(e);
      // console.log('canvasInit', canvasInit);
      canvas.addEventListener('mousemove', penToolDefault);
      canvas.addEventListener('mouseup', remove);
    });

    // canvas.addEventListener('mouseup', () => {
    //   preview.prepareSlides();
    //   preview.animationRun();
    // });
  }
}
