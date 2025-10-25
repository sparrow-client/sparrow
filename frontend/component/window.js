import {NavigationPane} from './navigation-pane.js';
import { MainPane } from './main-pane.js';

class Window {
  #mainPane;
  #navigationPane;

  constructor() {
    this.#mainPane = new MainPane(
      {
        textAreaRef: 'editing-textarea',
        urlInputRef: 'url-input'
      });

    this.#navigationPane = new NavigationPane(this.#mainPane);

    this.#wireUploadButton();
    this.#wireReformatButton();
    this.#wireSaveButton();
  }

  #wireUploadButton() {
    document.getElementById('file-load-btn').addEventListener('click', async() => {
      const result = await window.electronApi.openFile();

      if (result) {
        this.#navigationPane.loadAndSelectFile(result);
      }
    })
  }

  #wireReformatButton() {
    document.getElementById('reformat-btn').addEventListener('click', () => {
      this.#mainPane.reformat();
    })
  }

  #wireSaveButton() {
    document.getElementById('save').addEventListener('click', async() => {
      const currentFile = this.#mainPane.currentFile()
      if (!currentFile) {
        window.alert('no file selected --> nothing to save')
        return;
      }
      const content = document.getElementById("editing-textarea").value;
      const result = await window.electronApi.saveFile({ currentFile: currentFile, content: content});
    })
  }
}

export { Window };
