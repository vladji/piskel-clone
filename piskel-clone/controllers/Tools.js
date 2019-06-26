import Canvas from '../models/Canvas';
import Preview from '../models/Preview';

export default class Tools {
  constructor() {
    this.canvasStart = new Canvas();
    this.currentTool = 'btn_pen';
    this.canvasDraw = document.getElementById('canvas');
    this.btnPanel = document.querySelector('#draw-tools');
    this.btnStates = [];
    this.eraserDetect = {};
    this.defaultTool = document.querySelector('.btn_pen');
    this.currentColor = null;
    this.chooseColor();
    this.chooseThickness();
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

  chooseThickness() {
    const canvasInit = this.canvasStart;
    let thicknessBtn = null;
    let lineFat = 20;

    const thicknessPanel = document.querySelector('.thickness-tool');

    const thiscknessState = [];
    const firstThick = document.querySelector('.thickness-1').className;
    thiscknessState.push(firstThick);

    const activeThick = (btn) => {
      thiscknessState.push(btn);

      const prevState = thiscknessState.shift();
      const prevThick = document.querySelector(`.${prevState}`);
      prevThick.style.border = '2px solid #a7a79d';

      const currentState = thiscknessState[0];
      const currentThick = document.querySelector(`.${currentState}`);
      currentThick.style.border = '2px solid #ffed15';
    };

    thicknessPanel.addEventListener('click', (e) => {
      if (e.target.closest('li')) {
        thicknessBtn = e.target.closest('li').className;

        switch (thicknessBtn) {
          case 'thickness-1':
            lineFat = 20;
            break;
          case 'thickness-2':
            lineFat = 30;
            break;
          case 'thickness-3':
            lineFat = 40;
            break;
          default:
            lineFat = 20;
        }
        canvasInit.prepareData(null, lineFat);
        activeThick(thicknessBtn);
      }
    });

    canvasInit.prepareData(null, lineFat);
    activeThick(firstThick);
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
