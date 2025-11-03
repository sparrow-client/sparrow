class MainPane {
  #textArea;
  #urlInput;
  #files;
  #currentFile;

  constructor({ textAreaRef, urlInputRef }) {
    this.#textArea = document.getElementById(textAreaRef);
    this.#urlInput = document.getElementById(urlInputRef);
    this.#files = new Map();

    this.#textArea.addEventListener("input", (event) => {
      if (this.hasCurrentFileChanged()) {
        console.log("setting color to pink");
        this.currentFileState().button.style.backgroundColor = "pink";
      } else {
        console.log("resetting color");
        this.currentFileState().button.style.backgroundColor = "";
      }
    })
  }

  load(filename, content, btn) {
    const usecase = JSON.parse(content);
    this.#textArea.value = content;
    const state = new FileState({ savedState: content, currentState: content, btn: btn });
    this.#files.set(filename, state);
    this.#currentFile = filename;
  }

  display(filename) {
    if (this.#currentFile !== null && this.#currentFile !== undefined) {
      // save any intermediate changes before switching to newly selected file
      this.currentFileState().update(this.#textArea.value);
    }
    this.#textArea.value = this.currentFileState().current;
    this.#currentFile = filename;
  }

  reformat() {
    const originalJson = JSON.parse(this.#textArea.value);
    const reformattedJson = JSON.stringify(originalJson, null, 2)
    this.currentFileState().update(reformattedJson);
    this.#textArea.value = reformattedJson;
    this.#manualColorReset();
  }

  currentFile() {
    return this.#currentFile;
  }

  currentFileState() {
    return this.#files.get(this.#currentFile);
  }

  hasCurrentFileChanged() {
    return this.#currentFile && this.#files.get(this.#currentFile).hasChanges(this.#textArea.value)
  }

  #manualColorReset() {
    if (!this.hasCurrentFileChanged()) {
      console.log("resetting color");
      this.currentFileState().button.style.backgroundColor = "";
    }
  }
}

class FileState {
  saved;
  current;
  button;

  constructor({ savedState, currentState, btn }) {
    this.saved = savedState;
    this.current = currentState;
    this.button = btn;
  }

  hasChanges(textAreaContent) {
    return this.saved !== textAreaContent;
  }

  update(newContent) {
    this.current = newContent;
  }
}

export { MainPane };
