class NavigationPane {
  #mainPane;
  #loadedFileList;
  #files = new Map();
  constructor({ mainPane, loadedFileListRef }) {
    this.#mainPane = mainPane
    this.#loadedFileList = document.getElementById(loadedFileListRef);
  }

  loadAndSelectFile(file) {
    const loadedFileButton = document.createElement('button');
    loadedFileButton.dataset.filename = file.filepath;
    loadedFileButton.className = 'loaded-file';
    loadedFileButton.textContent = file.filepath;
    loadedFileButton.addEventListener('click', () => { this.#mainPane.display(file.filepath); })

    if (!this.#files.has(file.filepath)) {

      this.#mainPane.load(file.filepath, file.content);
      const existingFileButton = this.#loadedFileList.querySelector(`[data-filename='${file.name}']`);

      this.#loadedFileList.appendChild(loadedFileButton);

    } else {
      window.alert('found duplicate entry, replacing existing entry with new one');
      this.#loadedFileList.replaceChild(loadedFileButton, existingFileButton);
    }
    this.#files.set(file.filepath, file.content);
  }
}

export { NavigationPane };
