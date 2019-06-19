export default class Tools {
  constructor() {
    this.currentTool = null;
    this.panelTools = document.querySelector('#draw-tools');
    this.bucketBtn = document.querySelector('.bucket-btn p');
  }

  logic() {
    const toolsPanel = this.panelTools;

    toolsPanel.addEventListener('click', (e) => {
      const targetBtn = e.target;
      if (targetBtn === this.bucketBtn) Tools.setTool(targetBtn);
    });
  }

  static setTool(targetBtn) {
    this.currentTool = targetBtn;
  }

  static getTool() {
    return this.currentTool;
  }
}
