export default class GifExport {
  constructor() {
    this.gifBtn = document.querySelector('.service-btn');
    this.canvases = () => document.querySelectorAll('.frames-list canvas');
    this.fpsButton = document.querySelector('.preview_input-range input');
  }

  logic() {
    const btnGif = this.gifBtn;
    let gif = null;
    let gifURL = null;
    const fileName = 'giffka';

    const framePrepare = () => {
      const fps = this.fpsButton.value;
      const frames = this.canvases();
      for (let i = 0; i < frames.length; i += 1) {
        gif.addFrame(frames[i], { delay: 1000 / fps });
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
        workerScript: '../../dist/gif.worker.js',
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
