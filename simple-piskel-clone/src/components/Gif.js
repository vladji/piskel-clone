export default class GifExport {
  constructor() {
    this.gifBtn = document.querySelector('.export-btn');
    this.framesCanvases = () => document.querySelectorAll('.frames-list canvas');
    this.fpsButton = document.querySelector('.preview_input-range input');
  }

  logic() {
    const btnGif = this.gifBtn;
    let gif = null;
    let gifURL = null;
    const fileName = 'giffka';

    const framePrepare = () => {
      const fps = this.fpsButton.value;
      const currentSizeBtn = document.querySelector('.wrap_size-btn button[style*="rgb(255, 237, 21)"]');
      const sizeVar = currentSizeBtn.dataset.penVar;

      const frames = this.framesCanvases();
      for (let i = 0; i < frames.length; i += 1) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = frames[i].width / sizeVar;
        tempCanvas.height = frames[i].height / sizeVar;
        const ctxTempCanvas = tempCanvas.getContext('2d');
        // eslint-disable-next-line max-len
        ctxTempCanvas.drawImage(frames[i], 0, 0, frames[i].width, frames[i].height, 0, 0, tempCanvas.width, tempCanvas.height);

        const ctxData = ctxTempCanvas.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        gif.addFrame(ctxData, { delay: 1000 / fps, copy: true });
      }
    };

    const downloadGif = () => {
      const link = document.createElement('a');
      link.href = gifURL;
      link.setAttribute('download', fileName);
      link.click();
    };

    btnGif.addEventListener('click', () => {
      // eslint-disable-next-line no-undef
      gif = new GIF({
        workers: 2,
        quality: 10,
        workerScript: './dist/lib/gif.worker.js',
        transparent: '0x000000',
      });
      framePrepare();

      gif.on('finished', (blob) => {
        gifURL = URL.createObjectURL(blob);
        downloadGif();
      });
      gif.render();
    });
  }
}
