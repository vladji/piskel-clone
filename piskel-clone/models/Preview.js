export default class Preview {
  constructor() {
    this.animationView = document.querySelector('.preview_screen');
    this.fpsButton = document.querySelector('.preview_input-range input');
    this.fps = 12;
    this.img = null;
    this.displayFps = document.querySelector('.fps-range');
    this.fpsDisplay(this.fps);
    this.setFps();
  }

  initAnimation() {
    let i = 0;
    const getFpsRange = this.getFps.bind(this);

    setTimeout(function run() {
      this.fps = getFpsRange();
      const workSlides = Preview.getSlides() || [''];
      Preview.putSlide(workSlides, i);
      setTimeout(run, 1000 / this.fps);
      i += 1;
    }, 1000 / this.fps);
  }

  getFps() {
    return this.fps;
  }

  setFps() {
    const fpsBtn = this.fpsButton;

    const actualFps = () => {
      const valueFps = fpsBtn.value;
      this.fps = +valueFps;
      this.fpsDisplay(this.fps);
    };

    fpsBtn.addEventListener('mousedown', () => {
      fpsBtn.addEventListener('mousemove', actualFps);
    });
    fpsBtn.addEventListener('mouseup', () => {
      actualFps();
      fpsBtn.removeEventListener('mousemove', actualFps);
    });
  }

  fpsDisplay(fps) {
    this.displayFps.innerHTML = `${fps}`;
  }

  static getSlides() {
    return this.img;
  }

  static setSlides() {
    let workSlides = document.querySelectorAll('.frames-list canvas');
    workSlides = Array.prototype.slice.call(workSlides);
    const imgArr = [];

    workSlides.forEach((frame) => {
      const imgData = frame.toDataURL();
      imgArr.push(imgData);
    });

    this.img = imgArr;
  }

  static putSlide(obj, i) {
    const actionScreen = document.querySelector('.preview_screen');

    actionScreen.style.backgroundImage = `url("${obj[i % obj.length]}")`;
    actionScreen.style.backgroundSize = 'contain';
  }
}
