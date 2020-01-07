export default function initDefault(components) {
  const {
    frames, preview, storage, tools, canvasSize,
  } = components;

  if (localStorage.getItem('piskel-session-store')) {
    storage.loadSession(preview, tools, canvasSize);
  } else {
    frames.addNewFrame();
    tools.activeThick(document.querySelector('.thickness-1'));
    tools.activeTool(document.querySelector('.btn_pen'));
    tools.initColor('#0cf513', '#0a8ee6');
    canvasSize.activeSize(document.querySelector('.large-canvas'));
  }

  frames.controller();
  preview.initAnimation();
  // storage.saveSession();
}
