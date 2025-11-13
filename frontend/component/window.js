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
    this.#wireRunButton();
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

  #findFileBtn(filename) {
    return this.#fileButtonList.querySelector(`[data-filename='${filename}']`);
  }

  #loadAndSelectFile(file) {
    const loadedFileButton = this.buildAndRegisterNavigationButton({
      filepath: file.filepath,
      withOverrideAlert: true,
    });

    this.#mainPane.load(file.filepath, file.content, loadedFileButton);
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
        filename: currentFile,
        content: content,
      });

      const loadedFileButton = this.buildAndRegisterNavigationButton({
        filepath: currentFile,
        withOverrideAlert: false,
      });
      this.#mainPane.load(currentFile, content, loadedFileButton);
    });
  }

  #wireRunButton() {
    document.getElementById("run-btn").addEventListener("click", () => {
      console.log(this.#mainPane.run());
    });
  }

  buildAndRegisterNavigationButton({ filepath, withOverrideAlert }) {
    const loadedFileButton = document.createElement("button");
    loadedFileButton.dataset.filename = filepath;
    loadedFileButton.className = "loaded-file";
    loadedFileButton.textContent = filepath;
    loadedFileButton.addEventListener("click", () => {
      this.#mainPane.display(filepath);
    });

    if (!this.#files.has(filepath)) {
      this.#fileButtonList.appendChild(loadedFileButton);
    } else {
      const existingFileButton = this.#fileButtonList.querySelector(
        `[data-filename='${filepath}']`,
      );
      if (withOverrideAlert) {
        window.alert(
          "found duplicate entry, replacing existing entry with new one",
        );
      }
      this.#fileButtonList.replaceChild(loadedFileButton, existingFileButton);
    }

    return loadedFileButton;
  }
}

export { Window };
