class MainPane {
  #textArea;
  #urlInput;
  #files;
  #currentFile;

  constructor({ textAreaRef, urlInputRef }) {
    this.#textArea = document.getElementById(textAreaRef);
    this.#urlInput = document.getElementById(urlInputRef);
    this.#files = new Map();
  }

  load(filename, content) {
    console.log("displaying new file");
    const usecase = JSON.parse(content);
    this.#textArea.value = content;
    this.#files.set(filename, content);
    this.#currentFile = filename;
  }

  display(filename) {
    if (this.#currentFile !== null && this.#currentFile !== undefined) {
      // save any intermediate changes before switching to newly selected file
      this.#files.set(this.#currentFile, this.#textArea.value);
    }
    this.#textArea.value = this.#files.get(filename);
    this.#currentFile = filename;
  }

  reformat() {
    const originalJson = JSON.parse(this.#textArea.value);
    this.#textArea.value = JSON.stringify(originalJson, null, 2);
  }

  currentFile() {
    return this.#currentFile;
  }
}

export { MainPane };
