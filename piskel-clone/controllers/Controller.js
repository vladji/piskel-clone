// import Canvas from '../models/Canvas';
// import Preview from '../models/Preview';
// import Tools from './Tools';

// export default class Controller {
//   constructor() {
//     this.canvasDraw = document.getElementById('canvas');
//   }

//   start() {
//     const canvas = this.canvasDraw;

//     const canvasInit = new Canvas();
//     canvasInit.prepareData();
//     const penToolDefault = canvasInit.penToolDefault.bind(canvasInit);
//     // const bucketTool = canvasInit.bucketTool.bind(canvasInit);

//     // const tools = new Tools();
//     // tools.logic();

//     const remove = () => {
//       canvas.removeEventListener('mousemove', penToolDefault);
//       canvas.removeEventListener('mouseup', remove);
//       Preview.setSlides();
//     };

//     canvas.addEventListener('mousedown', (e) => {
//       canvasInit.prepareData();
//       const currentTool = tools.currentTool();

//       if (!currentTool) {
//         penToolDefault(e);
//         canvas.addEventListener('mousemove', penToolDefault);
//         canvas.addEventListener('mouseup', remove);
//       }
//     });
//   }
// }
