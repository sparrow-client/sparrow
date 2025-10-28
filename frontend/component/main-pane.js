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
      const state = this.#files.get(this.#currentFile);
      state.current = this.#textArea.value;
    }
    this.#textArea.value = this.#files.get(filename).current;
    this.#currentFile = filename;
  }

  reformat() {
    const originalJson = JSON.parse(this.#textArea.value);
    this.#textArea.value = JSON.stringify(originalJson, null, 2);
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
}

export { MainPane };
