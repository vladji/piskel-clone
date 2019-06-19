// import Controller from './controllers/Controller';
import Frames from './models/Frames';
import Preview from './models/Preview';
import Tools from './controllers/Tools';

// const control = new Controller();
// control.start();

const frames = new Frames();
frames.logic();

const preview = new Preview();
preview.initAnimation();

const tools = new Tools();
tools.logic();
// tools.getTool();
