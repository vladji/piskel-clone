import Frames from './models/Frames';
import Preview from './models/Preview';
import Tools from './controllers/Tools';
import View from './views/View';

const frames = new Frames();
frames.logic();

const preview = new Preview();
preview.initAnimation();

const tools = new Tools();
tools.logic();

const view = new View();
view.logic();
