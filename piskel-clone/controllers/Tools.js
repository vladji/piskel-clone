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
    this.currentColor = null;
    this.chooseColor();
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

  chooseColor() {
    const canvasInit = this.canvasStart;
    let primaryBtn = null;
    const paletteWrap = document.querySelector('.wrap_palette');
    const colorSection = document.querySelector('.wrap_color-section');
    const colorPalette = document.querySelector('.wrap_palette img');
    const colorCanvas = document.querySelector('.wrap_palette canvas');
    const colorContext = colorCanvas.getContext('2d');
    let currentColorBtn = null;

    const setColor = () => {
      primaryBtn = document.querySelector('.wrap_color-section button:first-child');
      const primBtnStyle = getComputedStyle(primaryBtn);
      const color = primBtnStyle.backgroundColor;

      this.currentColor = color;
      canvasInit.prepareData(color);
    };

    colorSection.addEventListener('click', (e) => {
      const targetBtn = e.target;
      if (targetBtn.closest('.choose-color-btn')) {
        colorContext.drawImage(colorPalette, 0, 0);
        paletteWrap.hidden = false;
        currentColorBtn = targetBtn.closest('.choose-color-btn');
      }

      if (targetBtn.closest('.color-switch')) {
        primaryBtn = document.querySelector('.wrap_color-section button:first-child');
        const secondaryBtn = document.querySelector('.wrap_color-section button:nth-child(2)');
        colorSection.insertBefore(secondaryBtn, primaryBtn);
        setColor();
      }

      if (targetBtn.closest('.wrap_close-btn')) paletteWrap.hidden = true;
    });

    const palettePicker = (e) => {
      const colorPixel = colorContext.getImageData(e.layerX, e.layerY, 1, 1).data.join(', ');
      currentColorBtn.style.backgroundColor = `rgba(${colorPixel})`;
    };

    colorCanvas.addEventListener('mousedown', () => {
      colorCanvas.addEventListener('mousemove', palettePicker);
      colorCanvas.addEventListener('mouseup', () => {
        colorCanvas.removeEventListener('mousemove', palettePicker);
        setColor();
      });
    });

    setColor();
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
