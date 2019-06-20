export default class Preview {
  constructor() {
    this.animationView = document.querySelector('.preview_screen');
    this.fpsButton = document.querySelector('.preview_input-range input');
    this.fps = 12;
    this.img = null;
    this.setFps = this.setFps();
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

    fpsBtn.addEventListener('mouseup', () => {
      const valueFps = fpsBtn.value;
      console.log('value FPS', valueFps);
      this.fps = +valueFps;
    });
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
