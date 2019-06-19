import Canvas from '../models/Canvas';
import Preview from '../models/Preview';

export default class Tools {
  constructor() {
    this.currentTool = null;
    this.canvasDraw = document.getElementById('canvas');
    this.panelTools = document.querySelector('#draw-tools');
    this.bucketBtn = document.querySelector('.bucket-btn p');
    this.canvasStart = new Canvas();
  }

  logic() {
    const canvas = this.canvasDraw;
    const toolsPanel = this.panelTools;
    const canvasInit = this.canvasStart;

    canvasInit.prepareData();

    const currentTool = this.getTool();

    const remove = () => {
      canvas.removeEventListener('mousemove', currentTool);
      canvas.removeEventListener('mouseup', remove);
      Preview.setSlides();
    };

    canvas.addEventListener('mousedown', (e) => {
      canvasInit.prepareData();


      // if (!currentTool) {
      currentTool(e);
      canvas.addEventListener('mousemove', currentTool);
      canvas.addEventListener('mouseup', remove);
      // }
    });

    toolsPanel.addEventListener('click', (e) => {
      this.currentTool = e.target;
    });
  }

  getTool() {
    let currentTool = null;
    const canvasInit = this.canvasStart;
    const penToolDefault = canvasInit.penToolDefault.bind(canvasInit);
    const bucketTool = canvasInit.bucketTool.bind(canvasInit);

    switch (this.currentTool) {
      case this.bucketBtn:
        currentTool = bucketTool;
        break;
      default:
        currentTool = penToolDefault;
    }

    return currentTool;
  }
}
