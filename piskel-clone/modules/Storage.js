export default class Storage {
  constructor() {
    this.putSession = null;
    this.framesData = null;
    this.firstFrame = document.querySelector('.frames-list li');
    this.framesList = document.querySelector('.frames-list ul');
  }

  logic() {
    const result = this.putSession;
    window.addEventListener('beforeunload', (e) => {
      e.preventDefault();
      e.returnValue = '';
      this.framesStore();
      console.log('result', result);
    });
  }

  putStore() {
    if (this.framesData) this.putImage(this.firstFrame);
  }

  putImage(frame) {
    const [...framesData] = this.framesData;
    frame.putImageData(framesData[0], 0, 0);

    if (framesData.length > 1) {
      for (let i = 1; i < framesData.length; i += 1) {
        const currentFrame = this.createFrame();
        const currentCtx = currentFrame.getContext('2d');
        currentCtx.putImageData(framesData[i], 0, 0);
      }
    }
  }

  createFrame() {
    this.framesList.insertAdjacentHTML('beforeend',
      `<li class="frame-wrap">
      <p class="frame-num"></p>
      <canvas class="frame-unit" width="700" height="700"></canvas>
      <div class="frame-tools" style="display: none;">
        <button class="frame-duplicate"><i class="fas fa-clone"></i></button>
        <button class="frame-delete"><i class="fas fa-trash-alt"></i></button>
        <button class="frame-move"><i class="fas fa-arrows-alt-v"></i></button>
      </div>
    </li>`);
    const lastFrame = document.querySelector('.frames-list li:last-child');
    return lastFrame;
  }

  framesStore() {
    const frames = document.querySelectorAll('.frames-list li');
    const framesData = [];

    for (let i = 0; i < frames.length; i += 1) {
      const frameCtx = frames[i].getContext('2d');
      framesData.push(frameCtx.getImageData(0, 0, frames[i].width, frames[i].height));
    }

    this.framesData = framesData;
  }
}
