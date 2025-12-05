class Usecase {
  #json;

  constructor(jsonString) {
    this.#json = JSON.parse(jsonString);
  }

  steps() {
    return this.#json.steps;
  }

  async run() {
    const jsonString = JSON.stringify(this.#json, null, 2);
    const results = await window.coreApi.runUsecase({ usecaseJson: jsonString });
    return results;
  }
}

export { Usecase };
