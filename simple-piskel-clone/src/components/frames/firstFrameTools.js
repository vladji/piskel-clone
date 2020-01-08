export function firstFrameTools(boolean) {
  const delToolFirstFrame = document.querySelector('.frame-delete');
  const moveToolFirstFrame = document.querySelector('.frame-move');
  delToolFirstFrame.hidden = boolean;
  moveToolFirstFrame.hidden = boolean;
}

export function toggleFrameTools(frame, boolean, currentFrame) {
  const frameTools = frame.querySelector('.frame-tools');
  frameTools.hidden = boolean;

  if (!boolean && frame !== currentFrame) {
    frame.classList.add('frame-hover');
  } else {
    frame.classList.remove('frame-hover');
  }
}
