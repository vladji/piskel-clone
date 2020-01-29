export default class Preview {
  constructor() {
    this.animationView = document.querySelector('.preview_screen');
    this.previewWrap = document.querySelector('.preview_screen-inner');
    this.fpsButton = document.querySelector('.fps-range');
    this.displayFps = document.querySelector('.fps-display');
    this.fullScreen();
  }

  initAnimation() {
    setTimeout(() => {
      let i = 0;
      let fpsVal = this.fps;
      this.fpsButton.addEventListener('change', (e) => {
        fpsVal = e.currentTarget.value;
      });

      function run() {
        const slides = Preview.getSlides() || [''];
        Preview.putSlide(slides, i);
        i += 1;
        setTimeout(run, 1000 / fpsVal);
      }
      run();
    }, 1000 / this.fps);
  }

  getFps() {
    return this.fps;
  }

  setFps(val) {
    const fpsBtn = this.fpsButton;

    const displayFps = () => {
      this.fps = +fpsBtn.value;
      this.displayFps.innerHTML = this.fps;
    };

    fpsBtn.value = val;
    displayFps();

    fpsBtn.addEventListener('click', displayFps);
    fpsBtn.addEventListener('mousemove', displayFps);
  }

  static getSlides() {
    return this.img;
  }

  static setSlides() {
    const imgArr = [];
    let workSlides = document.querySelectorAll('.frame-canvas');
    workSlides = Array.from(workSlides);

    workSlides.forEach((frame) => {
      const imgData = frame.toDataURL();
      imgArr.push(imgData);
    });

    this.img = imgArr;
  }

  static putSlide(slides, i) {
    const actionScreen = document.querySelector('.preview_screen');
    actionScreen.style.backgroundImage = `url("${slides[i % slides.length]}")`;
  }

  fullScreen() {
    const btn = document.querySelector('.full-screen');
    btn.addEventListener('click', () => {
      this.animationView.classList.add('full-screen_active');
      this.previewWrap.requestFullscreen();
    });

    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        this.animationView.classList.remove('full-screen_active');
      }
    });
  }
}
