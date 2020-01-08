import './style.css';

import Storage from './components/Storage';
import Frames from './components/frames/Frames';
import Preview from './components/Preview';
import Canvas from './components/Canvas';
import Tools from './components/Tools';
import CanvasSize from './components/CavasSize';
import initDefault from './initDefault';
import authModalDialog from './components/auth/modalDialog';
import gifExport from './components/gifExport';

const storage = new Storage();
const frames = new Frames();
const preview = new Preview();
const canvas = new Canvas(frames);
const tools = new Tools(canvas);
const canvasSize = new CanvasSize(canvas);

const components = {
  frames,
  preview,
  storage,
  tools,
  canvasSize,
};

initDefault(components);
authModalDialog();
gifExport();
