class NavigationPane {
  #mainPaneRef;
  #loadedFileListDOM;
  #files = new Map();
  constructor(mainPane) {
    this.#mainPaneRef = mainPane;
    this.#loadedFileListDOM = document.getElementById('loaded-file-list');

    this.#wireUploadButton();

  }

  loadAndSelectFile(file) {
    const loadedFileButton = document.createElement('button');
    loadedFileButton.dataset.filename = file.filepath;
    loadedFileButton.className = 'loaded-file';
    loadedFileButton.textContent = file.filepath;
    loadedFileButton.addEventListener('click', () => { this.#mainPaneRef.display(file.filepath); })

    if (!this.#files.has(file.filepath)) {

      this.#mainPaneRef.load(file.filepath, file.content);
      const existingFileButton = this.#loadedFileListDOM.querySelector(`[data-filename='${file.name}']`);

      this.#loadedFileListDOM.appendChild(loadedFileButton);

    } else {
      window.alert('found duplicate entry, replacing existing entry with new one');
      this.#loadedFileListDOM.replaceChild(loadedFileButton, existingFileButton);
    }
    this.#files.set(file.filepath, file.content);
  }

  #wireUploadButton() {
    document.getElementById('file-load-btn').addEventListener('click', async() => {
      const result = await window.electronApi.openFile();

      if (result) {
        console.log(result);
        this.loadAndSelectFile(result);
      }
    })
  }

}

export { NavigationPane };
