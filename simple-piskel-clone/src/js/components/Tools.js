
export default class Tools {
  constructor(canvas) {
    this.canvas = canvas;
    this.panel = document.querySelector('.wrap_draw-panel');
    this.canvasDraw = document.getElementById('canvas');
    this.colorPanel = document.querySelector('.color-tools');
    this.controller();
  }

  controller() {
    this.panel.addEventListener('click', (e) => {
      if (e.target.closest('[data-event]')) {
        const btn = e.target.closest('[data-event]');
        const btnEvent = btn.dataset.event;
        this[btnEvent](btn);
      }
      if (e.target.closest('.color-tools__select:first-child')) {
        const primeColor = e.target.closest('.color-tools__select:first-child');
        primeColor.addEventListener('change', () => {
          this.canvas.contextCanvas.fillStyle = primeColor.value;
        });
      }
    });
  }

  activeThick(btn) {
    const prevElem = document.querySelector('.active-thick');
    if (prevElem) prevElem.classList.remove('active-thick');

    btn.classList.add('active-thick');
    this.canvas.thick = btn.dataset.thick;
  }

  activeTool(btn) {
    const prevTool = document.querySelector('.active-tool');
    if (prevTool) prevTool.classList.remove('active-tool');

    btn.classList.add('active-tool');
    this.canvas.tool = btn.dataset.toolType;
  }

  switchColor() {
    const primaryBtn = document.querySelector('.color-tools__select:first-child');
    const secondaryBtn = document.querySelector('.color-tools__select:nth-child(2)');
    this.colorPanel.prepend(secondaryBtn, primaryBtn);
    this.canvas.contextCanvas.fillStyle = secondaryBtn.value;
  }

  initColor(colorPrime, colorSecond) {
    const primaryBtn = document.querySelector('.color-tools__select:first-child');
    const secondaryBtn = document.querySelector('.color-tools__select:nth-child(2)');
    primaryBtn.value = colorPrime;
    secondaryBtn.value = colorSecond;
    this.canvas.contextCanvas.fillStyle = primaryBtn.value;
  }
}
