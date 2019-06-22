import Canvas from '../models/Canvas';
import Preview from '../models/Preview';
import View from '../views/View';

export default class Tools {
  constructor() {
    this.currentTool = 'btn_pen';
    this.canvasDraw = document.getElementById('canvas');
    this.btnPanel = document.querySelector('#draw-tools');
    this.canvasStart = new Canvas();
  }

  logic() {
    // const targetPoint = this.canvasStart.targetPoint();
    // console.log('targetPoint', targetPoint);
    View.actualState(this.currentTool);
    // actualView(this.currentTool);

    const canvas = this.canvasDraw;
    const btnPanelTools = this.btnPanel;
    const canvasInit = this.canvasStart;

    canvasInit.prepareData();
    let currentTool = null;

    const removeAction = () => {
      canvas.removeEventListener('mousemove', currentTool);
      canvas.removeEventListener('mouseup', removeAction);
      Preview.setSlides();
    };

    canvas.addEventListener('mousedown', (e) => {
      canvasInit.prepareData();
      currentTool = this.getTool();

      if (currentTool.name === 'bound bucketTool') {
        currentTool(e);
        canvas.addEventListener('mouseup', removeAction);
      } else {
        currentTool(e);
        canvas.addEventListener('mousemove', currentTool);
        canvas.addEventListener('mouseup', removeAction);
      }
    });

    btnPanelTools.addEventListener('click', (e) => {
      const tool = e.target.closest('li').className;
      this.currentTool = tool;
      View.actualState(tool);
    });
  }

  getTool() {
    let currentTool = null;
    const canvasInit = this.canvasStart;
    const penToolDefault = canvasInit.penToolDefault.bind(canvasInit);
    const bucketTool = canvasInit.bucketTool.bind(canvasInit);

    switch (this.currentTool) {
      case 'btn_bucket':
        currentTool = bucketTool;
        break;
      default:
        currentTool = penToolDefault;
    }

    return currentTool;
  }
}
