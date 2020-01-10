import './style.css';

import Storage from './js/components/Storage';
import Frames from './js/components/frames/Frames';
import Preview from './js/components/Preview';
import Canvas from './js/components/Canvas';
import Tools from './js/components/Tools';
import CanvasSize from './js/components/CavasSize';
import initDefault from './js/initDefault';
import googleAuth from './js/components/auth/googleAuth';
import gifExport from './js/components/gifExport';

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
googleAuth();
gifExport();
