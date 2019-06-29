export default class Storage {
  constructor() {
    this.store = {};
    this.framesWrap = document.querySelector('.frames-list');
  }

  logic() {
    if (localStorage.getItem('storeKey')) {
      this.putImage();
    }

    window.addEventListener('beforeunload', () => {
      this.framesStore();
    });
  }

  framesStore() {
    const canvasList = document.querySelectorAll('.frames-list canvas');
    const framesData = [];

    for (let i = 0; i < canvasList.length; i += 1) {
      const frame = canvasList[i];
      const frameCtx = frame.getContext('2d');
      framesData.push(frameCtx.getImageData(0, 0, frame.width, frame.height));
    }
    const framesWrap = document.querySelector('.frames-list ul');
    this.store.framesWrap = framesWrap.outerHTML;
    // this.store.framesData = framesData;

    const storeObj = JSON.stringify(this.store);
    localStorage.setItem('storeKey', storeObj);
  }

  putImage() {
    const storeObj = JSON.parse(localStorage.getItem('storeKey'));
    const framesStoreUl = storeObj.framesWrap;
    const frameslist = this.framesWrap;
    frameslist.innerHTML = framesStoreUl;

    const frames = document.querySelectorAll('.frames-list li');
    frames[0].remove();
    const lookFrameStyle = document.querySelector('.frames-list li[style]');
    if (lookFrameStyle) lookFrameStyle.style = '';

    // const images = storeObj.framesData;
    // const canvasList = document.querySelectorAll('.frames-list canvas');

    // for (let i = 0; i < images.length; i += 1) {
    //   const currentCtx = canvasList[i].getContext('2d');
    //   currentCtx.putImageData(images[i], 0, 0);
    // }
  }

  // createFrame() {
  //   this.framesUl.insertAdjacentHTML('beforeend',
  //     `<li class="frame-wrap">
  //     <p class="frame-num"></p>
  //     <canvas class="frame-unit" width="700" height="700"></canvas>
  //     <div class="frame-tools" style="display: none;">
  //       <button class="frame-duplicate"><i class="fas fa-clone"></i></button>
  //       <button class="frame-delete"><i class="fas fa-trash-alt"></i></button>
  //       <button class="frame-move"><i class="fas fa-arrows-alt-v"></i></button>
  //     </div>
  //   </li>`);
  //   const lastFrame = document.querySelector('.frames-list li:last-child');
  //   return lastFrame;
  // }
}
