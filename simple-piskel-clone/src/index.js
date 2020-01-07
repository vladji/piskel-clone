import './style.css';

import Storage from './components/Storage';
import Frames from './components/frames_co/Frames';
import Preview from './components/Preview';
import Canvas from './components/Canvas';
import Tools from './components/Tools';
import CanvasSize from './components/CavasSize';
import initDefault from './components/initDefault';
import GifExport from './components/Gif';

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

const gifExport = new GifExport();
gifExport.logic();
