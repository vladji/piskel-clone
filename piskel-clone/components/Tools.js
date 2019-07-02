import Canvas from './Canvas';
import Preview from './Preview';

export default class Tools {
  constructor() {
    this.canvasStart = new Canvas();
    this.currentTool = 'btn_pen';
    this.canvasDraw = document.getElementById('canvas');
    this.btnPanel = document.querySelector('#draw-tools');
    this.btnStates = [];
    this.thiscknessState = [];
    this.defaultTool = document.querySelector('.btn_pen');
    this.currentColor = null;
    this.setColor();
    this.chooseColor();
    this.firstThick = document.querySelector('.thickness-tool li').className;
    this.chooseThickness();
    this.activeThick(this.firstThick, 20);
  }

  logic() {
    this.activeToolState(this.currentTool);

    const canvas = this.canvasDraw;
    const btnPanelTools = this.btnPanel;
    let currentTool = null;

    const removeAction = () => {
      canvas.removeEventListener('mousemove', currentTool);
      canvas.removeEventListener('mouseup', removeAction);
      Preview.setSlides();
    };

    canvas.addEventListener('mousedown', (e) => {
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

    switch (this.currentTool) {
      case 'btn_bucket':
        currentTool = bucketTool;
        break;
      case 'btn_eraser':
        currentTool = penToolDefault;
        break;
      default:
        currentTool = penToolDefault;
    }

    if (this.currentTool === 'btn_eraser') {
      canvasInit.prepareData(null, null, 'eraser');
    } else {
      canvasInit.prepareData();
    }

    return currentTool;
  }

  activeThick(btn, thick) {
    const canvasInit = this.canvasStart;

    this.thiscknessState.push(btn);

    const prevState = this.thiscknessState.shift();
    const prevThick = document.querySelector(`.${prevState}`);
    prevThick.style.border = '2px solid #a7a79d';

    const currentState = this.thiscknessState[0];
    const currentThick = document.querySelector(`.${currentState}`);
    currentThick.style.border = '2px solid #ffed15';

    canvasInit.prepareData(null, thick);
  }

  chooseThickness() {
    const thicknessPanel = document.querySelector('.thickness-tool');

    this.thiscknessState.push(this.firstThick);

    thicknessPanel.addEventListener('click', (e) => {
      if (e.target.closest('li')) {
        const thicknessBtn = e.target.closest('li').className;
        const lineFat = e.target.closest('li').dataset.thick;
        this.activeThick(thicknessBtn, lineFat);
      }
    });
  }

  setColor() {
    const canvasInit = this.canvasStart;
    const primaryBtn = document.querySelector('.wrap_color-section button:first-child');
    const primBtnStyle = getComputedStyle(primaryBtn);
    const color = primBtnStyle.backgroundColor;

    this.currentColor = color;
    canvasInit.prepareData(color);
  }

  chooseColor() {
    const paletteWrap = document.querySelector('.wrap_palette');
    const colorSection = document.querySelector('.wrap_color-section');
    const colorPalette = document.querySelector('.wrap_palette img');
    const colorCanvas = document.querySelector('.wrap_palette canvas');
    const colorContext = colorCanvas.getContext('2d');
    let currentColorBtn = null;

    colorSection.addEventListener('click', (e) => {
      const targetBtn = e.target;
      if (targetBtn.closest('.choose-color-btn')) {
        colorContext.drawImage(colorPalette, 0, 0);
        paletteWrap.hidden = false;
        currentColorBtn = targetBtn.closest('.choose-color-btn');
      }

      if (targetBtn.closest('.color-switch')) {
        const primaryBtn = document.querySelector('.wrap_color-section button:first-child');
        const secondaryBtn = document.querySelector('.wrap_color-section button:nth-child(2)');
        colorSection.insertBefore(secondaryBtn, primaryBtn);
        this.setColor();
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
        this.setColor();
      });
    });
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
