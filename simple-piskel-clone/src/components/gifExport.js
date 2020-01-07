function downloadGif(gifURL) {
  const link = document.createElement('a');
  link.href = gifURL;
  link.setAttribute('download', 'giffka');
  link.click();
}

function framePrepare(gif) {
  const VAR = 4;
  const fps = document.querySelector('.preview_input-range input').value;
  const currentSizeBtn = document.querySelector('.active-canvas-size');
  const sizeVar = currentSizeBtn.dataset.penVar * VAR;
  const frames = document.querySelectorAll('.frames-list canvas');

  for (let i = 0; i < frames.length; i += 1) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = frames[i].width / sizeVar;
    tempCanvas.height = frames[i].height / sizeVar;
    const ctxTempCanvas = tempCanvas.getContext('2d');

    ctxTempCanvas.drawImage(frames[i], 0, 0, frames[i].width,
      frames[i].height, 0, 0, tempCanvas.width, tempCanvas.height);

    const ctxData = ctxTempCanvas.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    gif.addFrame(ctxData, { delay: 1000 / fps, copy: true });
  }
}

export default function gifExport() {
  const btnGif = document.querySelector('.export-btn');

  btnGif.addEventListener('click', () => {
    // eslint-disable-next-line no-undef
    const gif = new GIF({
      workers: 2,
      quality: 10,
      workerScript: './dist/lib/gif.worker.js',
      transparent: '0x000000',
    });

    framePrepare(gif);

    gif.on('finished', (blob) => {
      const gifURL = URL.createObjectURL(blob);
      downloadGif(gifURL);
    });

    gif.render();
  });
}
