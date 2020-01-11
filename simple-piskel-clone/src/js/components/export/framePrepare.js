export default function framePrepare() {
  const fps = document.querySelector('.fps-range').value;
  const delay = 1000 / fps;

  const frames = document.querySelectorAll('.frame-canvas');
  const currentSizeBtn = document.querySelector('.active-canvas-size');
  const CALC_VAR = 4;
  const calcSize = currentSizeBtn.dataset.penVar * CALC_VAR;
  const actualSize = frames[0].width / calcSize;

  const ctxDataArr = [];

  for (let i = 0; i < frames.length; i += 1) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = frames[i].width / calcSize;
    tempCanvas.height = frames[i].height / calcSize;
    const ctxTempCanvas = tempCanvas.getContext('2d');

    ctxTempCanvas.drawImage(frames[i], 0, 0, frames[i].width,
      frames[i].height, 0, 0, tempCanvas.width, tempCanvas.height);

    const ctxData = ctxTempCanvas.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    ctxDataArr.push(ctxData);
  }
  return { ctxDataArr, delay, actualSize };
}
