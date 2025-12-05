import { Usecase } from "../../core/concepts.js";

class MainPane {
  #textArea;
  #responsePanel;
  #urlInput;
  #files;
  #currentFile;

  constructor({ textAreaRef, urlInputRef, responsePanel }) {
    this.#textArea = document.getElementById(textAreaRef);
    this.#urlInput = document.getElementById(urlInputRef);
    this.#responsePanel = document.getElementById(responsePanel);
    this.#files = new Map();

    this.#textArea.addEventListener("input", (event) => {
      if (this.hasCurrentFileChanged()) {
        console.log("setting color to pink");
        this.currentFileState().button.style.backgroundColor = "pink";
      } else {
        console.log("resetting color");
        this.currentFileState().button.style.backgroundColor = "";
      }
    });
  }

  load(filename, content, btn) {
    const usecase = JSON.parse(content);
    this.#textArea.value = content;
    const state = new FileState({
      savedState: content,
      currentState: content,
      btn: btn,
    });
    this.#files.set(filename, state);
    this.#currentFile = filename;
  }

  display(filename) {
    if (this.#currentFile !== null && this.#currentFile !== undefined) {
      // save any intermediate changes before switching to newly selected file
      this.currentFileState().update(this.#textArea.value);
    }
    this.#textArea.value = this.currentFileState().current;
  }

  reformat() {
    const originalJson = JSON.parse(this.#textArea.value);
    const reformattedJson = JSON.stringify(originalJson, null, 2);
    this.currentFileState().update(reformattedJson);
    this.#textArea.value = reformattedJson;
    this.#manualColorReset();
  }

  async run() {
    const responseObjects = await this.currentFileState().currentUsecase.run();
    let counter = 0;
    for (const { statusCode, body } of responseObjects) {
      const responsePane = document.createElement("div");
      responsePane.id = counter;
      counter += 1;
      responsePane.innerHTML = statusCode + " ||| " + body;

      this.#responsePanel.appendChild(responsePane);
    }
  }

  currentFile() {
    return this.#currentFile;
  }

  currentFileState() {
    return this.#files.get(this.#currentFile);
  }

  hasCurrentFileChanged() {
    return (
      this.#currentFile &&
      this.#files.get(this.#currentFile).hasChanges(this.#textArea.value)
    );
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
  currentUsecase;
  button;

  constructor({ savedState, currentState, btn }) {
    this.saved = savedState;
    this.current = currentState;
    this.currentUsecase = new Usecase(currentState);
    this.button = btn;
  }

  hasChanges(textAreaContent) {
    return this.saved !== textAreaContent;
  }

  update(newContent) {
    this.current = newContent;
    this.currentUsecase = new Usecase(newContent);
  }
}

export { MainPane };
