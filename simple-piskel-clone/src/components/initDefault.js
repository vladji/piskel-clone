export default function initDefault(components) {
  const {
    frames, preview, storage, tools, canvasSize,
  } = components;

  if (localStorage.getItem('piskel-session-store')) {
    storage.loadSession(frames, preview, tools);
  } else {
    frames.addNewFrame();
  }

  frames.controller();
  preview.initAnimation();
  tools.logic();
  canvasSize.logic();
  // storage.saveSession();
}
