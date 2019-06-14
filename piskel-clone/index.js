import View from './views/View';
import Controller from './controllers/Controller';
import Frames from './models/Frames';

import './style.css';

const initPage = new View();
initPage.render();

const control = new Controller();
control.start();

const frames = new Frames();
frames.logic();
