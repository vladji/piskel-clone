import framePrepare from './framePrepare';

function downloadGif(gifURL) {
  const link = document.createElement('a');
  link.href = gifURL;
  link.setAttribute('download', 'giffka');
  link.click();
}

function addFrame(gif) {
  const dataObj = framePrepare();
  const { ctxDataArr, delay } = dataObj;

  for (let i = 0; i < ctxDataArr.length; i += 1) {
    gif.addFrame(ctxDataArr[i], { delay, copy: true });
  }
}

export default function gifExport() {
  const btnGif = document.querySelector('.gif-export-btn');

  btnGif.addEventListener('click', () => {
    // eslint-disable-next-line no-undef
    const gif = new GIF({
      workers: 2,
      quality: 10,
      workerScript: './lib/gif.worker.js',
      transparent: '0x000000',
    });

    addFrame(gif);

    gif.on('finished', (blob) => {
      const gifURL = URL.createObjectURL(blob);
      downloadGif(gifURL);
    });

    gif.render();
  });
}
