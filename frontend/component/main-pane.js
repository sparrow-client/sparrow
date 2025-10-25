class MainPane {
  #textAreaRef;
  #urlInputRef;
  #files;
  #currentFile;

  constructor({textAreaRef, urlInputRef}) {
    this.#textAreaRef = textAreaRef;
    this.#urlInputRef = urlInputRef;
    this.#files = new Map();
  }

  load(filename, content) {
    const usecase = JSON.parse(content);
    document.getElementById(this.#textAreaRef).value = content;
    this.#files.set(filename, content);
    this.#currentFile = filename;
  }

  display(filename) {
    if (this.#currentFile !== null && this.#currentFile !== undefined) {
      // save any intermediate changes before switching to newly selected file
      this.#files.set(this.#currentFile, document.getElementById(this.#textAreaRef).value);
    }
    document.getElementById(this.#textAreaRef).value = this.#files.get(filename);
    this.#currentFile = filename;
  }

  reformat() {
    const originalJson = JSON.parse(this.#textAreaRef.value);
    document.getElementById(this.#textAreaRef).value = JSON.stringify(originalJson, null, 2);
  }

  currentFile() {
    return this.#currentFile;
  }
}

export { MainPane };
