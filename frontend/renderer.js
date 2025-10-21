import {NavigationPane} from './component/navigation-pane.js';
import { MainPane } from './component/main-pane.js';

const mainPane = new MainPane(
  {
    textArea: document.getElementById('editing-textarea'),
    urlInput: document.getElementById('url-input')
  });

const navigationPane = new NavigationPane(mainPane);
