class NavigationPane {
  #mainPaneRef;
  #files = [];
  constructor(mainPane) {
    this.#mainPaneRef = mainPane;

  }

  loadAndSelectFile(file) {
    this.#files.push(file);
    this.#mainPaneRef.display(file);
  }
}

export { NavigationPane };
