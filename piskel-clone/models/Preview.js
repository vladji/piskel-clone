export default class Preview {
  constructor() {
    this.animationView = document.querySelector('.preview_screen');
  }

  static prepareSlides() {
    let workSlides = document.querySelectorAll('.frames-list canvas');
    workSlides = Array.prototype.slice.call(workSlides);
    const imgArr = [];

    workSlides.forEach((frame) => {
      const imgData = frame.toDataURL();
      imgArr.push(imgData);
    });

    return {
      scope: imgArr,
    };
  }

  static animationRun(obj, i) {
    const actionScreen = document.querySelector('.preview_screen');
    const slidesArr = obj.scope;

    actionScreen.style.background = `url("${slidesArr[i % slidesArr.length]}")`;
  }
}
