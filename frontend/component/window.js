import { MainPane } from "./main-pane.js";

class Window {
  #mainPane;
  #navigationPane;
  #fileButtonList;
  #files = new Map();

  constructor() {
    this.#mainPane = new MainPane({
      textAreaRef: "editing-textarea",
      urlInputRef: "url-input",
    });
    this.#fileButtonList = document.getElementById("loaded-file-list");

    this.#wireUploadButton();
    this.#wireReformatButton();
    this.#wireSaveButton();
  }

  #wireUploadButton() {
    document
      .getElementById("file-load-btn")
      .addEventListener("click", async () => {
        const result = await window.electronApi.openFile();

        if (result) {
          this.#loadAndSelectFile(result);
        }
      });
  }

  #wireReformatButton() {
    document.getElementById("reformat-btn").addEventListener("click", () => {
      this.#mainPane.reformat();
    });
  }

  #loadAndSelectFile(file) {
    const loadedFileButton = document.createElement("button");
    loadedFileButton.dataset.filename = file.filepath;
    loadedFileButton.className = "loaded-file";
    loadedFileButton.textContent = file.filepath;
    loadedFileButton.addEventListener("click", () => {
      this.#mainPane.display(file.filepath);
    });

    if (!this.#files.has(file.filepath)) {
      this.#fileButtonList.appendChild(loadedFileButton);
    } else {
      const existingFileButton = this.#fileButtonList.querySelector(
        `[data-filename='${file.filepath}']`
      );
      window.alert(
        "found duplicate entry, replacing existing entry with new one",
      );
      this.#fileButtonList.replaceChild(loadedFileButton, existingFileButton);
    }
    this.#mainPane.load(file.filepath, file.content);
    this.#files.set(file.filepath, file.content);
  }

  #wireSaveButton() {
    document.getElementById("save-btn").addEventListener("click", async () => {
      const currentFile = this.#mainPane.currentFile();
      if (!currentFile) {
        window.alert("no file selected --> nothing to save");
        return;
      }
      const content = document.getElementById("editing-textarea").value;
      const result = await window.electronApi.saveFile({
        currentFile: currentFile,
        content: content,
      });
    });
  }
}

export { Window };
