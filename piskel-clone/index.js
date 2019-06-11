import Controller from './controllers/Controller';
import View from './views/View';

// import Frames from './models/Frames1';

import './style.css';

const initPage = new View();
initPage.render();

const control = new Controller();
control.start();
