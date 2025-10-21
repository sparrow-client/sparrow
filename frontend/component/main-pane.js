class MainPane {
  #textArea;
  #urlInput;
  #files;
  #currentFile;

  constructor({textArea, urlInput}) {
    this.#textArea = textArea;
    this.#urlInput = urlInput;
    this.#files = new Map();

    this.#wireReformatButton();
  }

  load(filename, content) {
    const usecase = JSON.parse(content);
    this.#textArea.value = content;
    this.#files.set(filename, content);
    this.#currentFile = filename;
  }

  display(filename) {
    if (this.#currentFile !== null && this.#currentFile !== undefined) {
      console.log(this.#currentFile);
      this.#files.set(this.#currentFile, this.#textArea.value);
    }
    console.log(filename);
    console.log(this.#files.get(filename));
    this.#textArea.value = this.#files.get(filename);
    this.#currentFile = filename;
  }

  reformat() {
    const originalJson = JSON.parse(this.#textArea.value);
    this.#textArea.value = JSON.stringify(originalJson, null, 2);
  }

  #wireReformatButton() {
    document.getElementById('reformat-btn').addEventListener('click', () => {
      this.reformat();
    })

  }


}

export { MainPane };
