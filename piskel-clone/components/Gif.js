// import GIF from '../../dist/gif';
export default class GifExport {
  constructor() {
    this.gifBtn = document.querySelector('.service-btn');
    this.canvases = () => document.querySelectorAll('.frames-list canvas');
  }

  logic() {
    const btnGif = this.gifBtn;

    // eslint-disable-next-line no-undef
    const gif = new GIF({
      workers: 2,
      quality: 10,
    });

    const framePrepare = () => {
      const frames = this.canvases();

      for (let i = 0; i < frames.length; i += 1) {
        const ctx = frames[i].getContext('2d');
        gif.addFrame(ctx, { copy: true });
        // gif.addFrame(frames[i], { delay: 200 });
      }
    };

    btnGif.addEventListener('click', () => {
      framePrepare();
      gif.on('finished', (blob) => {
        window.open(URL.createObjectURL(blob));
      });

      gif.render();
    });
  }
}
