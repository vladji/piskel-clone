import Canvas from '../models/Canvas';
import Preview from '../models/Preview';

export default class Tools {
  constructor() {
    this.currentTool = 'btn_pen';
    this.canvasDraw = document.getElementById('canvas');
    this.btnPanel = document.querySelector('#draw-tools');
    this.canvasStart = new Canvas();
    this.btnStates = [];
    this.defaultTool = document.querySelector('.btn_pen');
    this.currentColor = '#888';
    this.eraserDetect = {};
  }

  logic() {
    this.activeToolState(this.currentTool);

    const canvas = this.canvasDraw;
    const btnPanelTools = this.btnPanel;
    const canvasInit = this.canvasStart;
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
      this.activeToolState(tool);
    });
  }

  getTool() {
    let currentTool = null;
    const canvasInit = this.canvasStart;
    const penToolDefault = canvasInit.penToolDefault.bind(canvasInit);
    const bucketTool = canvasInit.bucketTool.bind(canvasInit);

    if (this.currentTool === 'btn_eraser') {
      this.eraserDetect.eraser = 'btn_eraser';
    } else if (this.eraserDetect.eraser) {
      this.eraserDetect.eraser = null;
      canvasInit.prepareData(this.currentColor);
    }

    switch (this.currentTool) {
      case 'btn_bucket':
        currentTool = bucketTool;
        break;
      case 'btn_eraser':
        canvasInit.prepareData('#fff');
        currentTool = penToolDefault;
        break;
      default:
        currentTool = penToolDefault;
    }
    return currentTool;
  }

  chooseColor(color) {
    const canvasInit = this.canvasStart;

    this.currentColor = color;
    canvasInit.prepareData(color);
  }

  activeToolState(tool) {
    this.btnStates.push(tool);

    if (this.btnStates.length < 2) {
      this.defaultTool.style.border = '2px solid #ffed15';
    } else {
      const prevState = this.btnStates.shift();
      const prevTool = document.querySelector(`.${prevState}`);
      prevTool.style.border = '2px solid #a7a79d';

      const currentState = this.btnStates[0];
      const currentTool = document.querySelector(`.${currentState}`);
      currentTool.style.border = '2px solid #ffed15';
    }
  }
}
