class NavigationPane {
  #mainPaneRef;
  #loadedFileListDOM;
  #files = [];
  constructor(mainPane) {
    this.#mainPaneRef = mainPane;
    this.#loadedFileListDOM = document.getElementById('loaded-file-list');

  }

  loadAndSelectFile(file) {
    this.#files.push(file);
    this.#mainPaneRef.display(file);

    const loadedFileEntry = document.createElement('button');
    loadedFileEntry.dataset.filename = file.name;
    loadedFileEntry.className = 'loaded-file';
    loadedFileEntry.textContent = file.name;
    loadedFileEntry.addEventListener('click', () => { this.#mainPaneRef.display(file); })

    console.log(`#${file.name}`);
    const existingFileEntry = this.#loadedFileListDOM.querySelector(`[data-filename='${file.name}']`);
    console.log(existingFileEntry);

    if (existingFileEntry != null) {
      window.alert('found duplicate entry, replacing existing entry with new one');
      this.#loadedFileListDOM.replaceChild(loadedFileEntry, existingFileEntry);
    } else {
      this.#loadedFileListDOM.appendChild(loadedFileEntry);
    }
  }
}

export { NavigationPane };
