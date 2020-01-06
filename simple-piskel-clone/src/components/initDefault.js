export default function initDefault(components) {
  const {
    frames, preview, storage, tools, canvasSize,
  } = components;

  if (localStorage.getItem('piskel-session-store')) {
    storage.loadSession(frames, preview, tools, canvasSize);
  } else {
    frames.addNewFrame();
    tools.activeThick(document.querySelector('.thickness-1'));
    canvasSize.activeSize(document.querySelector('.large-canvas'));
  }

  frames.controller();
  preview.initAnimation();
  tools.logic();
  storage.saveSession();
}
