export default class View {
  constructor() {
    this.body = document.querySelector('body');
  }

  render() {
    this.body.innerHTML = `<header>
    <h1>Piskel-clone</h1>
  </header>
  <main>
    <section id="draw-tools">
      <div class="pen-tool">
        <div><i class="fas fa-exchange-alt"></i></div>
        <p>Pen</p>
      </div>
      <div class="bucket-btn">
        <div><i class="fas fa-fill-drip"></i></div>
        <p>Paint bucket</p>
      </div>
      <div class="choose-btn">
        <div><i class="fas fa-eye-dropper"></i></div>
        <p>Choose color</p>
      </div>
      <div class="move-btn">
        <div><i class="fas fa-arrows-alt"></i></div>
        <p>Move</p>
      </div>
    </section>
    <div id="frames-block">
      <div class="frames-list">
        <ul>
          <li><canvas class="frame-unit" width="500" height="500"></canvas></li>
        </ul>
      </div>
      <div class="add-frame">
        <p>Add Frame</p>
      </div>
    </div>
    <canvas id="canvas" width="500" height="500"></canvas>
  </main>`;
  }
}
