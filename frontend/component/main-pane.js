class MainPane {
  #textArea;
  #reader;
  #urlInput;

  constructor({textArea, urlInput}) {
    this.#textArea = textArea;
    this.#urlInput = urlInput;
    this.#reader = this.#buildReader();
  }

  display(file) {
    this.#reader.readAsText(file);
  }

  reformat() {
    const originalJson = JSON.parse(this.#textArea.value);
    this.#textArea.value = JSON.stringify(originalJson, null, 2);
  }

  #buildReader() {
    const reader = new FileReader();
    reader.onload = (event) => {
      this.#textArea.value = event.target.result;
    }

    return reader;
  }
}

export { MainPane };
