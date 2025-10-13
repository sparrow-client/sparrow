import {NavigationPane} from './component/navigation-pane.js';
import { MainPane } from './component/main-pane.js';
import { configureHtmlJsInterface } from './component/html-adapter.js';

const mainPane = new MainPane(
  {
    textArea: document.getElementById('editing-textarea'),
    urlInput: document.getElementById('url-input'),
    structurePane: document.getElementById('structure-pane')
  });

const navigationPane = new NavigationPane(mainPane);
configureHtmlJsInterface(navigationPane, mainPane);
