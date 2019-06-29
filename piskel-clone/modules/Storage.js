export default class Storage {
  constructor() {
    this.store = {};
    this.framesWrap = document.querySelector('.frames-list');
  }

  logic() {
    // if (localStorage.getItem('storeKey')) {
    //   this.putImage();
    // }

    window.addEventListener('beforeunload', () => {
      this.framesStore();
    });
  }

  framesStore() {
    const canvasList = document.querySelectorAll('.frames-list canvas');
    const framesData = [];

    for (let i = 0; i < canvasList.length; i += 1) {
      const frame = canvasList[i];
      framesData.push(frame.toDataURL());
    }

    const framesWrap = document.querySelector('.frames-list ul');
    this.store.framesWrap = framesWrap.outerHTML;
    this.store.framesData = framesData;

    const storeObj = JSON.stringify(this.store);
    localStorage.setItem('storeKey', storeObj);
  }

  putImage() {
    const storeObj = JSON.parse(localStorage.getItem('storeKey'));
    const framesStoreUl = storeObj.framesWrap;
    const frameslist = this.framesWrap;
    frameslist.innerHTML = framesStoreUl;

    const lookActiveFrame = document.querySelector('.frames-list li[style*="border"]');
    if (lookActiveFrame) lookActiveFrame.style = '';

    const images = storeObj.framesData;
    const canvasList = document.querySelectorAll('.frames-list canvas');

    for (let i = 0; i < images.length; i += 1) {
      const currentCtx = canvasList[i].getContext('2d');
      const image = new Image();
      image.onload = () => {
        currentCtx.drawImage(image, 0, 0);
      };
      image.src = images[i];
    }
  }
}
