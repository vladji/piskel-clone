import Frames from './modules/Frames';
import Preview from './modules/Preview';
import Tools from './modules/Tools';
import Storage from './modules/Storage';

const frames = new Frames();
frames.logic();

const preview = new Preview();
preview.initAnimation();

const tools = new Tools();
tools.logic();

const storage = new Storage();
storage.logic();
