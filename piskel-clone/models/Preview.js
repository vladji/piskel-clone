export default class Preview {
  constructor() {
    this.animationView = document.querySelector('.preview_screen');
    this.imgDataArray = [];
    this.timerId = null;
  }

  prepareSlides() {
    this.timerId = null;

    let workSlides = document.querySelectorAll('.frames-list canvas');
    workSlides = Array.prototype.slice.call(workSlides);
    const imgArr = [];

    workSlides.forEach((frame) => {
      const imgData = frame.toDataURL();
      imgArr.push(imgData);
    });

    this.imgDataArray = imgArr;
    console.log('this', this.imgDataArray);
  }

  animationRun() {
    const actionScreen = this.animationView;
    const slidesArr = this.imgDataArray;

    let i = 0;
    this.timerId = setTimeout(function run() {
      // const actualSlides = getSlides();
      actionScreen.style.background = `url("${slidesArr[i % slidesArr.length]}")`;
      i += 1;
      setTimeout(run, 2500);
    }, 2500);

    // const getSlides = () => {
    //   const slidesArr = this.imgDataArray;
    //   return slidesArr;
    // };

    // const actualSlides = getSlides();
    // actualSlides.forEach((slide) => {
    //   setInterval(() => {
    //     actionScreen.style.background = `url("${slide}")`;
    //   }, 2000);
    // });
  }
}
